import { Response } from 'express';
import { prisma } from '../prisma';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

// === CONTROLADOR DE SUSCRIPCIONES ===

// Crear una suscripción ligada a un cliente
export const createSubscription = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, price, clientId } = req.body;

    if (!name || !price || !clientId) {
      res.status(400).json({ error: 'El nombre, precio y clientId son obligatorios.' });
      return;
    }

    // Validar que el cliente exista en Postgres
    const clientExists = await prisma.client.findUnique({ where: { id: String(clientId) } });
    if (!clientExists) {
      res.status(404).json({ error: 'El cliente proporcionado no existe.' });
      return;
    }

    const newSubscription = await prisma.subscription.create({
      data: {
        name,
        price: Number(price),
        clientId: String(clientId)
      }
    });

    res.status(201).json({ message: 'Suscripción activada con éxito', subscription: newSubscription });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la suscripción.' });
  }
};

// Obtener todas las suscripciones con sus clientes asociados (Eager Loading)
export const getSubscriptions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: { client: true }, // Muestra los datos del cliente dueño de esta suscripción
      orderBy: { createdAt: 'desc' }
    });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las suscripciones.' });
  }
};

// === CONTROLADOR DE PAGOS / HISTORIAL ===

// Registrar un nuevo cobro/factura ligado a una suscripción
export const createPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { amount, subscriptionId, dueDate } = req.body;

    if (!amount || !subscriptionId || !dueDate) {
      res.status(400).json({ error: 'El monto, subscriptionId y fecha límite (dueDate) son obligatorios.' });
      return;
    }

    const newPayment = await prisma.payment.create({
      data: {
        amount: Number(amount),
        subscriptionId: String(subscriptionId),
        dueDate: new Date(dueDate)
      }
    });

    res.status(201).json({ message: 'Cobro registrado con éxito', payment: newPayment });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el pago.' });
  }
};

// Obtener el historial completo financiero para las gráficas del Dashboard
export const getPaymentHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        subscription: {
          include: { client: true }
        }
      },
      orderBy: { dueDate: 'desc' }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el historial de pagos.' });
  }
};
