// backend/src/controllers/saleController.ts
import { Response } from 'express';
import { prisma } from '../prisma';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

interface SaleItemInput {
  productId: string;
  quantity: number;
}

// 1. REGISTRAR UNA NUEVA VENTA (POST)
export const createSale = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { clientId, items } = req.body as { clientId?: string; items: SaleItemInput[] };

    if (!items || items.length === 0) {
      res.status(400).json({ error: 'La venta debe contener al menos un artículo.' });
      return;
    }

    // Si se envía clientId, validar que exista en Postgres
    if (clientId) {
      const clientExists = await prisma.client.findUnique({ where: { id: String(clientId) } });
      if (!clientExists) {
        res.status(444).json({ error: 'El cliente proporcionado no existe en el sistema.' });
        return;
      }
    }

    // Ejecutar todo el proceso dentro de una transacción aislada y segura
    const newSale = await prisma.$transaction(async (tx) => {
      let calculatedTotal = 0;
      const itemsToCreate = [];

      // Validar stock y calcular precios línea por línea
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!product) {
          throw new Error(`El producto con ID ${item.productId} no existe.`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para '${product.name}'. Solicitado: ${item.quantity}, Disponible: ${product.stock}`);
        }

        const unitPrice = product.salePrice.toNumber();
        const subtotal = unitPrice * item.quantity;
        calculatedTotal += subtotal;

        // Guardamos los datos preparados para la inserción
        itemsToCreate.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice: unitPrice,
          subtotal: subtotal
        });

        // 💡 DESCUENTO AUTOMÁTICO DE STOCK
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      // Crear la venta maestra
      const sale = await tx.sale.create({
        data: {
          clientId: clientId ? String(clientId) : null,
          total: calculatedTotal,
          items: {
            create: itemsToCreate
          }
        },
        include: {
          items: {
            include: { product: true }
          },
          client: true
        }
      });

      return sale;
    });

    res.status(201).json({
      message: 'Venta procesada con éxito y stock actualizado.',
      sale: {
        id: newSale.id,
        total: newSale.total.toNumber(),
        createdAt: newSale.createdAt,
        client: newSale.client,
        items: newSale.items.map(i => ({
          id: i.id,
          productId: i.productId,
          productName: i.product.name,
          sku: i.product.sku,
          quantity: i.quantity,
          unitPrice: i.unitPrice.toNumber(),
          subtotal: i.subtotal.toNumber()
        }))
      }
    });

  } catch (error: any) {
    console.error('Error en createSale:', error);
    res.status(400).json({ error: error.message || 'Error al procesar la venta.' });
  }
};

// 2. OBTENER EL HISTORIAL DE VENTAS (GET)
export const getSalesHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [salesRaw, total] = await prisma.$transaction([
      prisma.sale.findMany({
        skip,
        take: limit,
        include: {
          client: true,
          items: {
            include: { product: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.sale.count()
    ]);

    const sales = salesRaw.map(s => ({
      id: s.id,
      total: s.total.toNumber(),
      createdAt: s.createdAt,
      clientName: s.client ? s.client.name : 'Público en General',
      itemsCount: s.items.reduce((acc, curr) => acc + curr.quantity, 0)
    }));

    res.json({
      sales,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error en getSalesHistory:', error);
    res.status(500).json({ error: 'Error al obtener el historial de ventas.' });
  }
};
