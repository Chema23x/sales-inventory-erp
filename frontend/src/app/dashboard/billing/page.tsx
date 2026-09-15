// src/app/dashboard/billing/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { billingService } from '@/services/billingService';
import { BillingSummary } from '@/types/billing';

export default function BillingPage() {
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBillingData() {
      try {
        setLoading(true);
        const data = await billingService.getSummary();
        setSummary(data);
      } catch (err: any) {
        setError(err.message || 'Error de conexión con el módulo financiero.');
      } finally {
        setLoading(false);
      }
    }
    loadBillingData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-zinc-400">
        <p className="text-sm font-medium animate-pulse">Cargando métricas financieras...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-950/30 border border-red-800 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-7xl w-full mx-auto">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Módulo Financiero</h1>
        <p className="text-sm text-zinc-400">Control de ingresos recurrentes, suscripciones activas e historial transaccional.</p>
      </div>

      {/* Grid de Métricas Avanzadas (DL Semántico) */}
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Tarjeta 1: Suscripciones */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 shadow-xl flex items-center justify-between group hover:border-zinc-700 transition-all">
          <div className="space-y-1">
            <dt className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Suscripciones Activas</dt>
            <dd className="text-3xl font-bold tracking-tight text-emerald-400 transition-transform group-hover:scale-[1.02]">
              {summary?.activeSubscriptions || 0}
            </dd>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950 border border-zinc-800/80 text-zinc-500 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all shadow-inner">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-emerald-500/5 blur-2xl" />
        </div>

        {/* Tarjeta 2: MRR */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 shadow-xl flex items-center justify-between group hover:border-zinc-700 transition-all">
          <div className="space-y-1">
            <dt className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Ingreso Mensual Recurrente</dt>
            <dd className="text-3xl font-bold tracking-tight text-white transition-transform group-hover:scale-[1.02]">
              ${summary?.monthlyRecurringRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })} <span className="text-xs text-zinc-500 font-medium text-zinc-400">MXN</span>
            </dd>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950 border border-zinc-800/80 text-zinc-500 group-hover:text-white group-hover:border-zinc-700 transition-all shadow-inner">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-1.971-.659-.544-.455-.544-1.191 0-1.646 1.172-.879 3.07-.879 4.242 0M14 6h1.5a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5H14m-4 0H8.5A1.5 1.5 0 0 1 7 18.5v-11A1.5 1.5 0 0 1 8.5 6H10" />
            </svg>
          </div>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-zinc-500/5 blur-2xl" />
        </div>

        {/* Tarjeta 3: Acumulado Histórico */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 shadow-xl flex items-center justify-between group hover:border-zinc-700 transition-all">
          <div className="space-y-1">
            <dt className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Facturación Total Histórica</dt>
            <dd className="text-3xl font-bold tracking-tight text-white transition-transform group-hover:scale-[1.02]">
              ${summary?.totalRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })} <span className="text-xs text-zinc-500 font-medium text-zinc-400">MXN</span>
            </dd>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950 border border-zinc-800/80 text-zinc-500 group-hover:text-white group-hover:border-zinc-700 transition-all shadow-inner">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5c.621 0 1.125.504 1.125 1.125v12.75c0 .621-.504 1.125-1.125 1.125H3.75M3.75 4.5a1.125 1.125 0 00-1.125 1.125V18.75m1.125-14.25v14.25m6-10.5h6m-6 3h6m-6 3h1.5m11.25-3h.008v.008H21V12zm0 3h.008v.008H21v-.008z" />
            </svg>
          </div>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-zinc-500/5 blur-2xl" />
        </div>
      </dl>

      {/* Tabla de Historial Transaccional */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 overflow-hidden shadow-xl">
        <div className="border-b border-zinc-800 bg-zinc-900/60 px-6 py-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase">Historial de Transacciones Recientes</h2>
          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 bg-zinc-950/50 font-medium select-none">
                <th className="px-6 py-4 font-semibold">ID Transacción</th>
                <th className="px-6 py-4 font-semibold">Monto</th>
                <th className="px-6 py-4 font-semibold">Método</th>
                <th className="px-6 py-4 font-semibold">Fecha de Cobro</th>
                <th className="px-6 py-4 font-semibold text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40 text-zinc-300">
              {summary?.recentPayments && summary.recentPayments.length > 0 ? (
                summary.recentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500 tracking-tight">
                      {payment.transactionId || payment.id.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-xs tracking-wider uppercase text-zinc-400">
                      {payment.paymentMethod}
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {new Date(payment.billingDate).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        payment.status === 'SUCCESS' 
                          ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' 
                          : payment.status === 'PENDING'
                          ? 'bg-amber-500/10 text-amber-400 ring-amber-500/20'
                          : 'bg-red-500/10 text-red-400 ring-red-500/20'
                      }`}>
                        {payment.status === 'SUCCESS' ? 'Completado' : payment.status === 'PENDING' ? 'Pendiente' : 'Fallido'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-zinc-500 font-medium">
                    <div className="flex flex-col items-center justify-center space-y-2 select-none">
                      <svg className="h-8 w-8 text-zinc-600 mb-1" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                      </svg>
                      <p className="text-sm">No se registran transacciones de pago en el sistema.</p>
                      <p className="text-xs text-zinc-600 font-normal">Asigna un plan a un cliente desde el directorio para ver reflejados los flujos.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
