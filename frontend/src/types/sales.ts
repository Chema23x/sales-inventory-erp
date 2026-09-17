// src/types/sales.ts
import { Product } from './inventory';

// 1. Representación de un artículo dentro del carrito de compras activo
export interface CartItem {
  product: Product;  // El objeto producto completo para acceder a SKU, stock y precios
  quantity: number;  // Cantidad seleccionada por el usuario
}

// 2. Estructura que exige el Backend para procesar la venta (POST /api/sales)
export interface CreateSaleInput {
  clientId?: string; // Opcional (Público en general si se omite)
  items: {
    productId: string;
    quantity: number;
  }[];
}

// 3. Estructura simplificada para el listado del historial de ventas
export interface SaleHistoryItem {
  id: string;
  total: number;
  createdAt: string;
  clientName: string;
  itemsCount: number;
}

// 4. Respuesta paginada del historial de ventas
export interface SalesHistoryResponse {
  sales: SaleHistoryItem[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
