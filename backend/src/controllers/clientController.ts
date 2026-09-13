import { Response } from 'express';
import { prisma } from '../prisma';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

// 1. CREAR CLIENTE (POST)
export const createClient = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email) {
      res.status(400).json({ error: 'El nombre y el email son obligatorios.' });
      return;
    }

    const existingClient = await prisma.client.findUnique({ where: { email } });
    if (existingClient) {
      res.status(400).json({ error: 'Ya existe un cliente registrado con este email.' });
      return;
    }

    const newClient = await prisma.client.create({
      data: { name, email, phone },
    });

    res.status(201).json({ message: 'Cliente creado con éxito', client: newClient });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el cliente.' });
  }
};

// 2. OBTENER TODOS LOS CLIENTES (GET) con paginación y búsqueda básica
export const getClients = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '10', search = '' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Buscamos clientes que coincidan con el término por nombre o email
    const clients = await prisma.client.findMany({
      where: {
        OR: [
          { name: { contains: String(search), mode: 'insensitive' } },
          { email: { contains: String(search), mode: 'insensitive' } },
        ],
      },
      skip: skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });

    const totalClients = await prisma.client.count({
      where: {
        OR: [
          { name: { contains: String(search), mode: 'insensitive' } },
          { email: { contains: String(search), mode: 'insensitive' } },
        ],
      },
    });

    res.json({
      clients,
      meta: {
        total: totalClients,
        page: Number(page),
        lastPage: Math.ceil(totalClients / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los clientes.' });
  }
};

// 3. ACTUALIZAR CLIENTE (PUT)
export const updateClient = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const updatedClient = await prisma.client.update({
      where: { id: String(id) },
      data: { name, email, phone },
    });

    res.json({ message: 'Cliente actualizado con éxito', client: updatedClient });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el cliente.' });
  }
};

// 4. ELIMINAR CLIENTE (DELETE)
export const deleteClient = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.client.delete({ where: { id: String(id) } });

    res.json({ message: 'Cliente eliminado con éxito (y todas sus suscripciones en cascada).' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el cliente.' });
  }
};
