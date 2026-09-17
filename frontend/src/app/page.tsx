// src/app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-400">
      
      {/* Barra de Navegación Superior */}
      <header className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 select-none">
            <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981]" />
            <span className="text-lg font-bold tracking-tight text-white">SmartStock <span className="text-zinc-500 font-medium text-xs bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">ERP</span></span>
          </div>
          
          <Link
            href="/login"
            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
          >
            Iniciar Sesión
          </Link>
        </div>
      </header>

      {/* Contenido Principal (Hero Section) */}
      <main className="flex-1 flex items-center justify-center px-6 relative overflow-hidden py-20">
        {/* Efectos de luces de fondo (Glows) */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-zinc-800/20 blur-3xl pointer-events-none" />

        <div className="max-w-3xl text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-xs font-medium text-emerald-400 select-none animate-fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Ecosistema Fullstack Completado • v1.0
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Control inteligente para <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-200 to-white bg-clip-text text-transparent">
              tu inventario y finanzas
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Optimiza la administración de tu negocio. Una plataforma integral diseñada con tipado estricto, persistencia en Postgres y procesamiento transaccional atómico.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto bg-white hover:bg-zinc-200 text-black font-bold px-8 py-3.5 rounded-xl text-sm transition-all active:scale-[0.98] text-center shadow-lg shadow-white/5"
            >
              Acceder al Panel de Control
            </Link>
            <a
              href="https://github.com/Chema23x/sales-inventory-erp"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white px-6 py-3.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] text-center"
            >
              Documentación técnica
            </a>
          </div>
        </div>
      </main>

      {/* Pie de Página */}
      <footer className="border-t border-zinc-900 bg-zinc-950/30 py-6 px-6 select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} SmartStock ERP. Todos los derechos reservados.</p>
          <p className="font-mono text-[10px] bg-zinc-900/50 border border-zinc-900 px-2 py-1 rounded">
            Environment: Localhost • Node.js + Next.js
          </p>
        </div>
      </footer>

    </div>
  );
}
