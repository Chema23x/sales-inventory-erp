import Sidebar from '@/components/ui/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-white">
      {/* El menú lateral se queda fijo a la izquierda */}
      <Sidebar />

      {/* El contenido de cada sección (Clientes, Facturación, etc.) se despliega aquí con su propio scroll */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-zinc-950">
        {children}
      </div>
    </div>
  );
}
