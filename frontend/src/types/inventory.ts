// src/types/inventory.ts

export interface Product {
  id: string;
  sku: string;        // Código único de barras o referencia (ej. "PROD-1001")
  name: string;       // Nombre del artículo
  description: string | null;
  purchasePrice: number; // Precio de costo/compra
  salePrice: number;     // Precio de venta final
  stock: number;         // Cantidad actual en almacén
  minStock: number;      // Umbral para detonar alertas de escasez
  isLowStock?: boolean;  // Indicador dinámico calculado por el backend
  createdAt: string;
  updatedAt: string;
}

export interface LowStockAlert {
  id: string;
  sku: string;
  name: string;
  stock: number;
  minStock: number;
  salePrice: number;
}

export interface InventoryResponse {
  products: Product[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
