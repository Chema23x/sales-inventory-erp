// src/services/billingService.ts
import { BillingSummary, Subscription } from '@/types/billing';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const billingService = {
  // Obtener resumen financiero (MRR, conteos, pagos recientes)
  getSummary: async (): Promise<BillingSummary> => {
    const res = await fetch(`${API_URL}/billing/summary`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Error al obtener el resumen de facturación');
    return res.json();
  },

  // Activar o actualizar una suscripción para un cliente
  activateSubscription: async (clientId: string, planName: string, price: number): Promise<Subscription> => {
    const res = await fetch(`${API_URL}/billing/subscribe`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ clientId, planName, price }),
    });
    if (!res.ok) throw new Error('Error al activar la suscripción');
    return res.json();
  },
};
