'use client';

import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function DashboardPage() {
  const { user, logoutGlobal, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 text-sm">
        <p className="animate-pulse">Cargando panel de control...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col p-6 max-w-7xl w-full mx-auto space-y-8">
      
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
              Tu entorno Fullstack está completamente conectado. Desde este panel podrás gestionar tus clientes, suscripciones fijas e historial de facturación sincronizado en tiempo real con tu base de datos PostgreSQL.
            </p>
          </div>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-emerald-500/5 blur-3xl" />
        </div>

        {/* REJILLA DE ACCESOS DIRECTOS (NUEVA SECCIÓN) */}
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
              href="/dashboard/billing" 
              className="flex items-start gap-4 p-5 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-white group-hover:border-zinc-700 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5c.621 0 1.125.504 1.125 1.125v12.75c0 .621-.504 1.125-1.125 1.125H3.75M3.75 4.5a1.125 1.125 0 00-1.125 1.125V18.75m1.125-14.25v14.25m6-10.5h6m-6 3h6m-6 3h1.5m11.25-3h.008v.008H21V12zm0 3h.008v.008H21v-.008z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">Módulo Financiero</h4>
                <p className="mt-1 text-xs text-zinc-400">Analiza el MRR (Ingreso Mensual Recurrente), ingresos acumulados e inspecciona transacciones recientes.</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Rejilla de Métricas Semántica */}
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Métricas Globales</h3>
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
              <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Clientes Activos</dt>
              <dd className="text-2xl font-bold text-white mt-1">--</dd>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
              <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Ingresos Mensuales (MRR)</dt>
              <dd className="text-2xl font-bold text-emerald-400 mt-1">$0.00 MXN</dd>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
              <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Cobros Pendientes</dt>
              <dd className="text-2xl font-bold text-white mt-1">--</dd>
            </div>
          </dl>
        </div>
      </main>
    </div>
  );
}
