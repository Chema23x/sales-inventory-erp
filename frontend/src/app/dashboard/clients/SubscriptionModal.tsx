// src/app/dashboard/clients/SubscriptionModal.tsx
'use client';

import React, { useState } from 'react';
import { billingService } from '@/services/billingService';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  onSuccess: () => void;
}

const PRESET_PLANS = [
  { name: 'Plan Emprendedor', price: 499 },
  { name: 'Plan Negocio Pro', price: 1299 },
  { name: 'Plan Enterprise', price: 2999 },
];

export default function SubscriptionModal({ isOpen, onClose, clientId, clientName, onSuccess }: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState(PRESET_PLANS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Llamada al servicio que creamos en la fase anterior
      await billingService.activateSubscription(clientId, selectedPlan.name, selectedPlan.price);
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al procesar la suscripción.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Gestionar Suscripción</h3>
          <p className="text-sm text-zinc-400">Asignar o actualizar el plan activo para <span className="text-zinc-200 font-medium">{clientName}</span>.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/30 border border-red-800 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Seleccionar Plan Corporativo
            </label>
            <div className="space-y-2">
              {PRESET_PLANS.map((plan) => (
                <button
                  key={plan.name}
                  type="button"
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border text-sm transition-all text-left ${
                    selectedPlan.name === plan.name
                      ? 'border-emerald-500 bg-emerald-500/10 text-white'
                      : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <span className="font-medium">{plan.name}</span>
                  <span className={selectedPlan.name === plan.name ? 'text-emerald-400 font-semibold' : 'text-zinc-400'}>
                    ${plan.price.toLocaleString('es-MX')}/mes
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors shadow-md shadow-emerald-900/20 disabled:opacity-50"
            >
              {loading ? 'Procesando...' : 'Activar Suscripción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
