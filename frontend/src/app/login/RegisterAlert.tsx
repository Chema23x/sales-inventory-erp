// src/app/login/RegisterAlert.tsx
'use client';

import { useSearchParams } from 'next/navigation';

export default function RegisterAlert() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('registered') === 'success';

  if (!isSuccess) return null;

  return (
    <div className="mb-4 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800 text-emerald-400 text-xs font-medium text-center animate-in fade-in duration-300">
      ¡Cuenta de negocio creada con éxito! Inicia sesión para continuar.
    </div>
  );
}
