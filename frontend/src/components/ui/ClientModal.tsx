'use client';

import { useState } from 'react';
import { apiFetch } from '@/services/api';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: () => void;
}

export default function ClientModal({ isOpen, onClose, onClientCreated }: ClientModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!name || !email) {
      setError('El nombre y el correo electrónico son obligatorios.');
      return;
    }

    try {
      setLoading(true);
      // Petición POST al endpoint protegido del backend
      await apiFetch('/clients', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone: phone || null }),
      });

      // Limpiar formulario y refrescar lista
      setName('');
      setEmail('');
      setPhone('');
      onClientCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al registrar al cliente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in" role="dialog" aria-modal="true">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative">
        <h3 className="text-lg font-bold text-white mb-1">Registrar Nuevo Cliente</h3>
        <p className="text-xs text-zinc-400 mb-5">Agrega un nuevo prospecto a tu base de datos de facturación.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="modal-name" className="block text-xs font-medium text-zinc-300 mb-1.5">Nombre Completo</label>
            <input
              id="modal-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Juan Pérez"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
            />
          </div>

          <div>
            <label htmlFor="modal-email" className="block text-xs font-medium text-zinc-300 mb-1.5">Correo Electrónico</label>
            <input
              id="modal-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juan@empresa.com"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
            />
          </div>

          <div>
            <label htmlFor="modal-phone" className="block text-xs font-medium text-zinc-300 mb-1.5">Teléfono (Opcional)</label>
            <input
              id="modal-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej. 3312345678"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-xl text-sm font-medium transition active:scale-[0.98]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-xl text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
