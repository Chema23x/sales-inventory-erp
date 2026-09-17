// backend/src/controllers/analyticsController.ts
import { Response } from 'express';
import { prisma } from '../prisma';
import { SubscriptionStatus, PaymentStatus } from '@prisma/client';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export const getDashboardAnalytics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // 1. Conteo total de clientes registrados
    const totalClients = await prisma.client.count();

    // 2. Cálculo del MRR (Suscripciones Activas)
    const mrrAggregation = await prisma.subscription.aggregate({
      where: { status: SubscriptionStatus.ACTIVE },
      _sum: { price: true }
    });
    const monthlyRecurringRevenue = mrrAggregation._sum.price ? mrrAggregation._sum.price.toNumber() : 0;

    // 3. Sumatoria Histórica de Pagos de Suscripciones (Liquidados)
    const billingAggregation = await prisma.payment.aggregate({
      where: { status: PaymentStatus.PAID },
      _sum: { amount: true }
    });
    const totalBillingRevenue = billingAggregation._sum.amount ? billingAggregation._sum.amount.toNumber() : 0;

    // 4. Sumatoria Histórica de Ventas Directas del POS
    const salesAggregation = await prisma.sale.aggregate({
      _sum: { total: true }
    });
    const totalSalesRevenue = salesAggregation._sum.total ? salesAggregation._sum.total.toNumber() : 0;

    // 5. Ingresos Consolidados Globales (Facturación + Ventas POS)
    const consolidatedTotalRevenue = totalBillingRevenue + totalSalesRevenue;

    // 6. Conteo de cobros por suscripción pendientes (Facturación en riesgo)
    const pendingPaymentsCount = await prisma.payment.count({
      where: { status: PaymentStatus.PENDING }
    });

    // Retorno del Payload unificado para la pantalla de inicio
    res.json({
      totalClients,
      monthlyRecurringRevenue,
      consolidatedTotalRevenue,
      pendingPaymentsCount
    });
  } catch (error) {
    console.error('Error en getDashboardAnalytics:', error);
    res.status(500).json({ error: 'Error al compilar los reportes analíticos del sistema.' });
  }
};
