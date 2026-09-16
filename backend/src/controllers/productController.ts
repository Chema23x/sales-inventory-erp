// backend/src/controllers/productController.ts
import { Response } from 'express';
import { prisma } from '../prisma';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

// 1. CREAR PRODUCTO (POST)
export const createProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { sku, name, description, purchasePrice, salePrice, stock, minStock } = req.body;

    if (!sku || !name || purchasePrice === undefined || salePrice === undefined) {
      res.status(400).json({ error: 'El SKU, nombre, precio de compra y precio de venta son obligatorios.' });
      return;
    }

    // Validar duplicidad de SKU
    const skuExists = await prisma.product.findUnique({ where: { sku: String(sku) } });
    if (skuExists) {
      res.status(400).json({ error: 'El código SKU proporcionado ya está registrado.' });
      return;
    }

    const newProduct = await prisma.product.create({
      data: {
        sku: String(sku),
        name: String(name),
        description: description ? String(description) : null,
        purchasePrice: Number(purchasePrice),
        salePrice: Number(salePrice),
        stock: stock !== undefined ? Number(stock) : 0,
        minStock: minStock !== undefined ? Number(minStock) : 5,
      },
    });

    res.status(201).json({
      message: 'Producto registrado exitosamente en el inventario.',
      product: {
        ...newProduct,
        purchasePrice: newProduct.purchasePrice.toNumber(),
        salePrice: newProduct.salePrice.toNumber(),
      },
    });
  } catch (error) {
    console.error('Error en createProduct:', error);
    res.status(500).json({ error: 'Error al registrar el producto.' });
  }
};

// 2. LISTAR PRODUCTOS CON PAGINACIÓN (GET)
export const getProducts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [productsRaw, total] = await prisma.$transaction([
      prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.product.count(),
    ]);

    // Sanitizar tipos Decimal de Prisma a Number antes de enviar al cliente
    const products = productsRaw.map((p) => ({
      ...p,
      purchasePrice: p.purchasePrice.toNumber(),
      salePrice: p.salePrice.toNumber(),
      isLowStock: p.stock <= p.minStock, // Marcador dinámico de alerta
    }));

    res.json({
      products,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error en getProducts:', error);
    res.status(500).json({ error: 'Error al obtener el inventario.' });
  }
};

// 3. ACTUALIZAR PRODUCTO (PUT)
export const updateProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { sku, name, description, purchasePrice, salePrice, stock, minStock } = req.body;

    const productExists = await prisma.product.findUnique({ where: { id: String(id) } });
    if (!productExists) {
      res.status(404).json({ error: 'El producto especificado no existe.' });
      return;
    }

    // Validar SKU si se está intentando cambiar
    if (sku && sku !== productExists.sku) {
      const skuConflict = await prisma.product.findUnique({ where: { sku } });
      if (skuConflict) {
        res.status(400).json({ error: 'El nuevo SKU ya pertenece a otro artículo.' });
        return;
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: String(id) },
      data: {
        sku: sku ? String(sku) : undefined,
        name: name ? String(name) : undefined,
        description: description !== undefined ? String(description) : undefined,
        purchasePrice: purchasePrice !== undefined ? Number(purchasePrice) : undefined,
        salePrice: salePrice !== undefined ? Number(salePrice) : undefined,
        stock: stock !== undefined ? Number(stock) : undefined,
        minStock: minStock !== undefined ? Number(minStock) : undefined,
      },
    });

    res.json({
      message: 'Producto actualizado con éxito.',
      product: {
        ...updatedProduct,
        purchasePrice: updatedProduct.purchasePrice.toNumber(),
        salePrice: updatedProduct.salePrice.toNumber(),
      },
    });
  } catch (error) {
    console.error('Error en updateProduct:', error);
    res.status(500).json({ error: 'Error al actualizar el producto.' });
  }
};

// 4. ELIMINAR PRODUCTO (DELETE)
export const deleteProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const productExists = await prisma.product.findUnique({ where: { id: String(id) } });
    if (!productExists) {
      res.status(404).json({ error: 'El producto especificado no existe.' });
      return;
    }

    await prisma.product.delete({ where: { id: String(id) } });
    res.json({ message: 'Producto removido del inventario satisfactoriamente.' });
  } catch (error) {
    console.error('Error en deleteProduct:', error);
    res.status(500).json({ error: 'Error al eliminar el producto.' });
  }
};

// 5. ALERTAS DE STOCK MÍNIMO / DESABASTO (GET)
export const getLowStockAlerts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Busca los productos cuyo stock actual sea menor o igual al umbral mínimo configurado
    const lowStockProductsRaw = await prisma.product.findMany({
      where: {
        stock: {
          lte: prisma.product.fields.minStock, // Comparación a nivel de base de datos
        },
      },
      orderBy: { stock: 'asc' },
    });

    const lowStockProducts = lowStockProductsRaw.map((p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      stock: p.stock,
      minStock: p.minStock,
      salePrice: p.salePrice.toNumber(),
    }));

    res.json(lowStockProducts);
  } catch (error) {
    console.error('Error en getLowStockAlerts:', error);
    res.status(500).json({ error: 'Error al calcular las alertas de stock.' });
  }
};
