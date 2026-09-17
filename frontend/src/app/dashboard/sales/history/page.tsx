// src/app/dashboard/sales/history/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { saleService } from '@/services/saleService';
import { SaleHistoryItem } from '@/types/sales';

interface PaginationMeta {
  total: number;
  page: number;
  lastPage: number;
}

export default function SalesHistoryPage() {
  const [sales, setSales] = useState<SaleHistoryItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await saleService.getSalesHistory(page, 5); // Paginación de 5 en 5 por consistencia
      setSales(data.sales);
      setMeta(data.meta);
    } catch (err: any) {
      console.error(err);
      setError('Error al sincronizar el historial de tickets comerciales.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col p-6 max-w-7xl w-full mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Encabezado de la Sección */}
      <header className="border-b border-zinc-900 pb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1 select-none">
            <Link href="/dashboard" className="hover:text-zinc-300 transition">Dashboard</Link>
            <span>/</span>
            <Link href="/dashboard/sales" className="hover:text-zinc-300 transition">Ventas</Link>
            <span>/</span>
            <span className="text-zinc-400">Historial</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Historial de Ventas</h1>
          <p className="text-sm text-zinc-400 mt-0.5">Auditoría transaccional de tickets emitidos y desglose de ingresos generados.</p>
        </div>

        <Link
          href="/dashboard/sales"
          className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-medium px-4 py-2 rounded-xl text-sm transition active:scale-[0.98]"
        >
          Ir a Terminal POS
        </Link>
      </header>

      {/* Contenedor del Listado Histórico */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 text-center text-sm text-zinc-500 animate-pulse">Sincronizando bitácora de tiques...</div>
        ) : error ? (
          <div className="p-12 text-center text-sm text-red-400 bg-red-950/10 border border-red-900/50 m-4 rounded-xl">{error}</div>
        ) : sales.length === 0 ? (
          <div className="p-16 text-center text-sm text-zinc-500 flex flex-col items-center justify-center space-y-2 select-none">
            <svg className="h-6 w-6 text-zinc-600 mb-1" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <p>No se registran folios de venta en la base de datos.</p>
            <p className="text-xs text-zinc-600 font-normal">Realiza tu primer cobro desde la terminal de ventas para poblar la auditoría.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/40 text-zinc-400 font-medium select-none">
                  <th className="p-4">Folio Transacción</th>
                  <th className="p-4">Fecha de Emisión</th>
                  <th className="p-4">Cliente / Cuenta</th>
                  <th className="p-4">Ítems Totales</th>
                  <th className="p-4 text-right">Monto Neto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-zinc-800/10 transition-colors">
                    <td className="p-4 font-mono text-xs tracking-tight text-zinc-500">
                      {sale.id.toUpperCase()}
                    </td>
                    <td className="p-4 text-zinc-400">
                      {new Date(sale.createdAt).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                        sale.clientName === 'Público en General'
                          ? 'bg-zinc-500/10 text-zinc-400 ring-zinc-500/10'
                          : 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'
                      }`}>
                        {sale.clientName}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-400 font-medium">
                      {sale.itemsCount} <span className="text-xs font-normal text-zinc-500">uds</span>
                    </td>
                    <td className="p-4 font-bold text-white text-right">
                      \${sale.total.toFixed(2)} <span className="text-xs font-normal text-zinc-500">MXN</span>
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
                  <span className="font-semibold text-zinc-400">{meta.lastPage}</span> ({meta.total} tiques en bitácora)
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
    </div>
  );
}
