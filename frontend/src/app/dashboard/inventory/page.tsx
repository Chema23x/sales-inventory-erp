// src/app/dashboard/inventory/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { productService } from '@/services/productService';
import { Product } from '@/types/inventory';
import ProductModal from './ProductModal';

interface PaginationMeta {
  total: number;
  page: number;
  lastPage: number;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts(page, 5); // Paginación fija de 5 en 5
      setProducts(data.products);
      setMeta(data.meta);
    } catch (err: any) {
      console.error(err);
      setError('Error al sincronizar el catálogo de almacén.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [page]);
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col p-6 max-w-7xl w-full mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Encabezado del Módulo */}
      <header className="border-b border-zinc-900 pb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1 select-none">
            <Link href="/dashboard" className="hover:text-zinc-300 transition">Dashboard</Link>
            <span>/</span>
            <span className="text-zinc-400">Inventario</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Control de Almacén</h1>
          <p className="text-sm text-zinc-400 mt-0.5">Catálogo general de productos, precios de compra/venta y alertas de existencias.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white hover:bg-zinc-200 text-black font-semibold px-4 py-2 rounded-xl text-sm transition active:scale-[0.98] shadow-md shadow-white/5"
        >
          + Agregar Artículo
        </button>
      </header>

      {/* Contenedor del Listado */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 text-center text-sm text-zinc-500 animate-pulse">Consultando base de datos de almacén...</div>
        ) : error ? (
          <div className="p-12 text-center text-sm text-red-400 bg-red-950/10 border border-red-900/50 m-4 rounded-xl">{error}</div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center text-sm text-zinc-500">No hay productos registrados en el inventario actual.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/40 text-zinc-400 font-medium select-none">
                  <th className="p-4">SKU / Código</th>
                  <th className="p-4">Producto</th>
                  <th className="p-4">Costo Compra</th>
                  <th className="p-4">Precio Venta</th>
                  <th className="p-4">Existencias</th>
                  <th className="p-4 text-right">Estatus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-800/10 transition-colors">
                    <td className="p-4 font-mono text-xs tracking-wider text-emerald-400 font-semibold">{product.sku}</td>
                    <td className="p-4">
                      <div className="font-medium text-zinc-200">{product.name}</div>
                      {product.description && <div className="text-xs text-zinc-500 truncate max-w-xs">{product.description}</div>}
                    </td>
                    <td className="p-4 text-zinc-400">${product.purchasePrice.toFixed(2)}</td>
                    <td className="p-4 font-medium text-white">${product.salePrice.toFixed(2)}</td>
                    <td className="p-4 font-semibold">{product.stock} <span className="text-xs font-normal text-zinc-500">uds</span></td>
                    <td className="p-4 text-right">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                        product.isLowStock 
                          ? 'bg-amber-500/10 text-amber-400 ring-amber-500/20' 
                          : 'bg-zinc-500/10 text-zinc-400 ring-zinc-500/10'
                      }`}>
                        {product.isLowStock ? 'Stock Bajo' : 'Estable'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Controles de Paginación */}
            {meta && meta.lastPage > 1 && (
              <div className="border-t border-zinc-800 px-4 py-3 flex items-center justify-between bg-zinc-950/20 select-none">
                <p className="text-xs text-zinc-500">
                  Mostrando página <span className="font-semibold text-zinc-400">{meta.page}</span> de{' '}
                  <span className="font-semibold text-zinc-400">{meta.lastPage}</span> ({meta.total} artículos totales)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium transition disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, meta.lastPage))}
                    disabled={page === meta.lastPage}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium transition disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* RENDER INTERACTIVO DEL MODAL INYECTADO */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductCreated={fetchInventory}
      />
    </div>
  );
}

