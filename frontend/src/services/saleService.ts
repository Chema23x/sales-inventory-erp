// src/services/saleService.ts
import { CreateSaleInput, SalesHistoryResponse } from '@/types/sales';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const saleService = {
  // 1. Procesar y registrar una venta en el POS (Dispara la transacción atómica y descuenta stock)
  createSale: async (saleData: CreateSaleInput): Promise<{ message: string; sale: any }> => {
    const res = await fetch(`${API_URL}/sales`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(saleData),
    });
    
    if (!res.ok) {
      const errData = await res.json();
      // Captura y propaga el error exacto (ej: "Stock insuficiente para 'Producto X'")
      throw new Error(errData.error || 'Error al procesar la transacción comercial.');
    }
    
    return res.json();
  },

  // 2. Obtener el historial analítico de tickets paginado
  getSalesHistory: async (page = 1, limit = 10): Promise<SalesHistoryResponse> => {
    const res = await fetch(`${API_URL}/sales/history?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    if (!res.ok) throw new Error('Error al obtener el historial de ventas.');
    return res.json();
  },
};
