// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { productService } from '@/services/productService'; 
import { analyticsService, DashboardAnalytics } from '@/services/analyticsService';
import { LowStockAlert } from '@/types/inventory'; 

export default function DashboardPage() {
  const { user, logoutGlobal, loading: authLoading } = useAuth();
  
  // Estados para el módulo de inventario y alertas
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(true);

  // 1. Cargar las alertas desde el endpoint del Backend
  useEffect(() => {
    async function loadAlerts() {
      try {
        setLoadingAlerts(true);
        const alerts = await productService.getLowStockAlerts();
        setLowStockAlerts(alerts);
      } catch (error) {
        console.error('Error al cargar alertas de inventario:', error);
      } finally {
        setLoadingAlerts(false);
      }
    }
    if (user) loadAlerts();
  }, [user]);

  // 2. Cargar Métricas Consolidadas Reales del Servidor
  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoadingAnalytics(true);
        const data = await analyticsService.getDashboardAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Error al cargar métricas globales:', error);
      } finally {
        setLoadingAnalytics(false);
      }
    }
    if (user) loadAnalytics();
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 text-sm">
        <p className="animate-pulse">Cargando panel de control...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col p-6 max-w-7xl w-full mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Barra de Perfil / Control Superior */}
      <header className="flex items-center justify-between border-b border-zinc-900 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Panel de Control</h1>
          <p className="text-sm text-zinc-400 mt-1">Vista general y accesos rápidos al sistema corporativo.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right select-none">
            <p className="text-xs font-semibold text-zinc-200">{user?.name || 'Administrador'}</p>
            <p className="text-[10px] text-zinc-500 font-mono">{user?.email}</p>
          </div>
          <button
            onClick={logoutGlobal}
            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-medium transition active:scale-[0.97]"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="space-y-8">
        
        {/* Tarjeta de Bienvenida */}
        <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-900/40 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-white">¡Bienvenido de vuelta, {user?.name}! 👋</h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              Tu entorno Fullstack está completamente conectado. Desde este panel podrás gestionar tus clientes, controlar el catálogo de almacén y monitorear la facturación sincronizada en tiempo real.
            </p>
          </div>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-emerald-500/5 blur-3xl" />
        </div>

        {/* Rejilla de Accesos Directos */}
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Módulos Disponibles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              href="/dashboard/clients" 
              className="flex items-start gap-4 p-5 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-white group-hover:border-zinc-700 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">Directorio de Clientes</h4>
                <p className="mt-1 text-xs text-zinc-400">Da de alta cuentas, filtra registros y administra suscripciones individuales de forma interactiva.</p>
              </div>
            </Link>

            <Link 
              href="/dashboard/inventory" 
              className="flex items-start gap-4 p-5 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-white group-hover:border-zinc-700 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">Control de Almacén</h4>
                <p className="mt-1 text-xs text-zinc-400">Supervisa existencias en tiempo real, actualiza SKUs, precios y gestiona umbrales mínimos de stock.</p>
              </div>
            </Link>
          </div>
        </div>

               {/* NUEVA SECCIÓN: LISTADO RÁPIDO DE ALERTAS DE STOCK BAJO */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Alertas Críticas de Reabastecimiento</h3>
            {!loadingAlerts && lowStockAlerts.length > 0 && (
              <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400 ring-1 ring-inset ring-amber-500/20 animate-pulse">
                {lowStockAlerts.length} productos en riesgo
              </span>
            )}
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-4 overflow-hidden">
            {loadingAlerts ? (
              <div className="py-6 text-center text-xs text-zinc-500 animate-pulse">Analizando niveles de inventario...</div>
            ) : lowStockAlerts.length === 0 ? (
              <div className="py-6 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Todo en orden. Todos los artículos del almacén cuentan con niveles óptimos.
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/50">
                {lowStockAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between py-3 first:pt-1 last:pb-1">
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{alert.name}</p>
                      <p className="text-xs text-zinc-500 font-mono tracking-tight mt-0.5">SKU: {alert.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-amber-400">{alert.stock} <span className="text-xs font-normal text-zinc-500">en existencia</span></p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Mínimo: {alert.minStock} uds</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rejilla de Métricas Semántica Vivas (DL Conectado con la API) */}
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Métricas Globales</h3>
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 shadow-sm">
              <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Clientes Registrados</dt>
              <dd className="text-2xl font-bold text-white mt-1">
                {loadingAnalytics ? <span className="text-zinc-600 animate-pulse">...</span> : analytics?.totalClients || 0}
              </dd>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 shadow-sm">
              <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wider">MRR (Suscripciones Activas)</dt>
              <dd className="text-2xl font-bold text-emerald-400 mt-1">
                {loadingAnalytics ? (
                  <span className="text-zinc-600 animate-pulse">...</span>
                ) : (
                  `$${(analytics?.monthlyRecurringRevenue || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`
                )}
              </dd>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 shadow-sm">
              <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Facturación Pendiente</dt>
              <dd className={`text-2xl font-bold mt-1 ${analytics?.pendingPaymentsCount && analytics.pendingPaymentsCount > 0 ? 'text-amber-400' : 'text-white'}`}>
                {loadingAnalytics ? <span className="text-zinc-600 animate-pulse">...</span> : `${analytics?.pendingPaymentsCount || 0} recibos`}
              </dd>
            </div>
          </dl>
          
          {/* Tarjeta de Ingresos Globales Consolidados */}
          <div className="mt-5 bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 flex items-center justify-between select-none">
            <div>
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">Ingresos Globales Consolidados</span>
              <span className="text-xs text-zinc-500 block mt-0.5">Sumatoria de caja POS + pagos históricos de suscripciones.</span>
            </div>
            <span className="text-2xl font-black text-white">
              {loadingAnalytics ? (
                <span className="text-zinc-600 animate-pulse">...</span>
              ) : (
                `$${(analytics?.consolidatedTotalRevenue || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
              )}
            </span>
          </div>
        </div>

      </main>
    </div>
  );
}
