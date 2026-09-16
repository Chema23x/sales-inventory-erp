// src/services/productService.ts
import { InventoryResponse, Product, LowStockAlert } from '@/types/inventory';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const productService = {
  // 1. Obtener catálogo de productos paginado
  getProducts: async (page = 1, limit = 10): Promise<InventoryResponse> => {
    const res = await fetch(`${API_URL}/products?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Error al obtener el inventario de productos');
    return res.json();
  },

  // 2. Registrar un nuevo producto en el almacén
  createProduct: async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ message: string; product: Product }> => {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Error al registrar el producto');
    }
    return res.json();
  },

  // 3. Actualizar datos o existencias de un producto existente
  updateProduct: async (id: string, productData: Partial<Product>): Promise<{ message: string; product: Product }> => {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Error al actualizar el producto');
    }
    return res.json();
  },

  // 4. Eliminar permanentemente un artículo del inventario
  deleteProduct: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Error al eliminar el producto del inventario');
    return res.json();
  },

  // 5. Obtener el reporte rápido de alertas de stock mínimo
  getLowStockAlerts: async (): Promise<LowStockAlert[]> => {
    const res = await fetch(`${API_URL}/products/alerts/low-stock`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Error al obtener las alertas de inventario escaseante');
    return res.json();
  },
};
