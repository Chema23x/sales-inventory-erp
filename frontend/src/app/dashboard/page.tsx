'use client';

// 💡 Eliminamos 'React' completo. Solo importamos lo que se usa.
import { useAuth } from '../../context/AuthContext';

export default function DashboardPage() {
  const { user, logoutGlobal, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 text-sm">
        Cargando panel de control...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Barra de Navegación Superior */}
      <header className="border-b border-zinc-900 bg-zinc-900/50 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">SmartStock ERP</h1>
          <p className="text-xs text-zinc-400 mt-0.5">Panel de administración global</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-semibold text-zinc-200">{user?.name || 'Administrador'}</p>
            <p className="text-[10px] text-zinc-500">{user?.email}</p>
          </div>
          <button
            onClick={logoutGlobal}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition active:scale-[0.97]"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Tarjeta de Bienvenida */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white">¡Bienvenido de vuelta, {user?.name}! 👋</h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Tu entorno Fullstack está completamente conectado. Desde este panel podrás gestionar tus clientes, suscripciones fijas e historial de facturación sincronizado en tiempo real con tu base de datos PostgreSQL.
          </p>
        </div>

        {/* Rejilla de Métricas en Blanco */}
        <dl className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5" role="presentation">
                <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Clientes Activos</dt>
                <dd className="text-2xl font-bold text-white mt-1">--</dd>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5" role="presentation">
                <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Ingresos Mensuales</dt>
                <dd className="text-2xl font-bold text-white mt-1">$0.00 MXN</dd>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5" role="presentation">
                <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Cobros Pendientes</dt>
                <dd className="text-2xl font-bold text-white mt-1">--</dd>
            </div>
        </dl>
      </main>
    </div>
  );
}
