// src/services/analyticsService.ts

export interface DashboardAnalytics {
  totalClients: number;
  monthlyRecurringRevenue: number;
  consolidatedTotalRevenue: number;
  pendingPaymentsCount: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const analyticsService = {
  // Obtener métricas consolidadas (Clientes, MRR, Ingresos Totales, Pendientes)
  getDashboardAnalytics: async (): Promise<DashboardAnalytics> => {
    const res = await fetch(`${API_URL}/analytics/dashboard`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Error al obtener las métricas analíticas.');
    return res.json();
  },
};
