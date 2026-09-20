'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/services/api';
import ClientModal from '@/components/ui/ClientModal';
import SubscriptionModal from './SubscriptionModal';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
}

interface PaginationMeta {
  total: number;
  page: number;
  lastPage: number;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [selectedClientForSub, setSelectedClientForSub] = useState<{ id: string; name: string } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const handleOpenSubscription = (id: string, name: string) => {
    setSelectedClientForSub({ id, name });
    setIsSubModalOpen(true);
  };

  const handleSubscriptionSuccess = () => {
    setNotification('¡Suscripción actualizada y procesada exitosamente!');
    fetchClients(); // Refresca los datos del listado si es necesario

    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const fetchClients = async () => {
    try {
      setLoading(true);
      // Consume el endpoint GET /api/clients?page=X&limit=5
      const data = await apiFetch(`/clients?page=${page}&limit=5`);
      setClients(data.clients);
      setMeta(data.meta);
    } catch (error) {
      console.error('Error al cargar los clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [page]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Encabezado de la Sección */}
      <header className="border-b border-zinc-900 bg-zinc-900/30 px-6 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/dashboard" className="hover:text-zinc-300 transition">Dashboard</Link>
            <span>/</span>
            <span className="text-zinc-400">Clientes</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Directorio de Clientes</h2>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white cursor-pointer hover:bg-zinc-200 text-black font-semibold px-4 py-2 rounded-xl text-sm transition active:scale-[0.98]"
        >
          + Agregar Cliente
        </button>
      </header>

      {/* Contenido */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-sm text-zinc-500">Cargando directorio de clientes...</div>
          ) : clients.length === 0 ? (
            <div className="p-12 text-center text-sm text-zinc-500">No hay clientes registrados en el sistema.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/40 text-zinc-400 font-medium select-none">
                    <th className="p-4">Nombre</th>
                    <th className="p-4">Correo Electrónico</th>
                    <th className="p-4">Teléfono</th>
                    <th className="p-4">Fecha de Registro</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-zinc-800/20 transition-colors">
                      <td className="p-4 font-medium text-zinc-200">{client.name}</td>
                      <td className="p-4 text-zinc-400">{client.email}</td>
                      <td className="p-4 text-zinc-400">{client.phone || '—'}</td>
                      <td className="p-4 text-zinc-500">
                        {new Date(client.createdAt).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleOpenSubscription(client.id, client.name)}
                          className="inline-flex cursor-pointer items-center text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1.5 rounded-lg transition-all"
                        >
                          Gestionar Plan
                        </button>
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
                    <span className="font-semibold text-zinc-400">{meta.lastPage}</span> ({meta.total} clientes en total)
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
      </main>

      {/* Modal Altas de Clientes */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onClientCreated={fetchClients}
      />

      {/* Modal Asignación de Suscripciones Financieras */}
      {selectedClientForSub && (
        <SubscriptionModal
          isOpen={isSubModalOpen}
          onClose={() => {
            setIsSubModalOpen(false);
            setSelectedClientForSub(null);
          }}
          clientId={selectedClientForSub.id}
          clientName={selectedClientForSub.name}
          onSuccess={handleSubscriptionSuccess}
        />
      )}

      {/* BANNER DE NOTIFICACIÓN FLOTANTE */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl border border-emerald-800 bg-zinc-900 p-4 shadow-2xl shadow-emerald-950/20 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-start gap-3">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-white">Operación Exitosa</p>
              <p className="mt-1 text-xs text-zinc-400">{notification}</p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
