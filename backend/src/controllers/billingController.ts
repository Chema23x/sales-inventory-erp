// src/controllers/billingController.ts
import { Response } from 'express';
import { PaymentStatus, SubscriptionStatus } from '@prisma/client';
import { prisma } from '../prisma';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

// ==========================================
// 1. ENDPOINT CLAVE: RESUMEN FINANCIERO (MRR)
// ==========================================
export const getBillingSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // A. Conteo de suscripciones con estatus activo en Postgres
    const activeSubsCount = await prisma.subscription.count({
      where: { status: SubscriptionStatus.ACTIVE }
    });

    // B. Cálculo del MRR (Se añade toNumber() porque Prisma maneja objetos Decimal)
    const mrrAggregation = await prisma.subscription.aggregate({
      where: { status: SubscriptionStatus.ACTIVE },
      _sum: { price: true }
    });
    const monthlyRecurringRevenue = mrrAggregation._sum.price ? mrrAggregation._sum.price.toNumber() : 0;

    // C. Facturación Total Histórica (Sumatoria de estados PAID basados en tu Enum real)
    const revenueAggregation = await prisma.payment.aggregate({
      where: { status: PaymentStatus.PAID }, // <-- Sincronizado con tu Enum "PAID"
      _sum: { amount: true }
    });
    const totalRevenue = revenueAggregation._sum.amount ? revenueAggregation._sum.amount.toNumber() : 0;

    // D. Obtener los últimos 10 pagos registrados
    const recentPaymentsRaw = await prisma.payment.findMany({
      take: 10,
      orderBy: { dueDate: 'desc' }
    });

    // Mapeo defensivo homologando tu base de datos con las interfaces del frontend
    const recentPayments = recentPaymentsRaw.map(p => {
      // Mapeamos tus estados internos al estándar visual del frontend
      let visualStatus: 'SUCCESS' | 'PENDING' | 'FAILED' = 'PENDING';
      if (p.status === PaymentStatus.PAID) visualStatus = 'SUCCESS';
      if (p.status === PaymentStatus.OVERDUE) visualStatus = 'FAILED';

      return {
        id: p.id,
        subscriptionId: p.subscriptionId,
        amount: p.amount.toNumber(), // <-- Conversión limpia de Decimal a Number
        status: visualStatus,
        paymentMethod: 'CARD', 
        transactionId: p.id.substring(0, 8),
        billingDate: p.dueDate.toISOString(),
        createdAt: p.createdAt.toISOString()
      };
    });

    // Retorno del payload exacto estructurado para Next.js
    res.json({
      activeSubscriptions: activeSubsCount,
      monthlyRecurringRevenue,
      totalRevenue,
      recentPayments
    });
  } catch (error) {
    console.error('Error en getBillingSummary:', error);
    res.status(500).json({ error: 'Error al calcular las métricas financieras.' });
  }
};

// ==========================================
// 2. ACTIVAR SUSCRIPCIÓN (Transacción Atómica)
// ==========================================
export const createSubscription = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { planName, price, clientId } = req.body;

    if (!planName || !price || !clientId) {
      res.status(400).json({ error: 'El planName, price y clientId son requeridos.' });
      return;
    }

    // Validar existencia del cliente en Postgres
    const clientExists = await prisma.client.findUnique({ where: { id: String(clientId) } });
    if (!clientExists) {
      res.status(404).json({ error: 'El cliente especificado no existe.' });
      return;
    }

    const priceNum = Number(price);
    const now = new Date();

    // Transacción aislada en base de datos usando tus modelos y campos reales
    const result = await prisma.$transaction(async (tx) => {
      // 1. Crear la suscripción mapeada a 'name'
      const subscription = await tx.subscription.create({
        data: {
          clientId: String(clientId),
          name: String(planName), 
          price: priceNum,
          status: SubscriptionStatus.ACTIVE 
        }
      });

      // 2. Crear el primer cobro mapeado a tu Enum 'PAID' y campo 'dueDate'
      const payment = await tx.payment.create({
        data: {
          subscriptionId: subscription.id,
          amount: priceNum,
          status: PaymentStatus.PAID, // <-- Sincronizado a tu Enum
          dueDate: now,
          paidAt: now
        }
      });

      return { subscription, payment };
    });

    res.status(201).json({
      message: 'Suscripción activada e historial de pago registrado correctamente.',
      subscription: {
        ...result.subscription,
        price: result.subscription.price.toNumber() // Sanitizado para evitar problemas de parseo JSON con Decimal
      },
      payment: {
        ...result.payment,
        amount: result.payment.amount.toNumber()
      }
    });
  } catch (error) {
    console.error('Error en createSubscription:', error);
    res.status(500).json({ error: 'Error interno en la pasarela de suscripción.' });
  }
};

// ==========================================
// 3. MÉTODOS DE CONSULTA Y RESPALDO
// ==========================================
export const getSubscriptions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: { client: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las suscripciones.' });
  }
};

export const getPaymentHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { dueDate: 'desc' }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el historial transaccional.' });
  }
};
