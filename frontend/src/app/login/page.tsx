// src/app/login/page.tsx
'use client'; // <-- ¡ESTA LÍNEA DEBE SER LA NÚMERO 1!

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import RegisterAlert from './RegisterAlert';

export default function LoginPage() {
  const router = useRouter();
  const { loginGlobal, user, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirección proactiva si ya hay sesión activa
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Credenciales incorrectas.');
      }

      loginGlobal(data.token, data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 text-sm">
        <p className="animate-pulse">Verificando sesión activa...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
        
        <div className="text-center mb-8 select-none">
          <Link href="/" className="inline-flex items-center gap-2 group focus:outline-none">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              SmartStock <span className="text-zinc-500 font-medium text-xs bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800 group-hover:border-emerald-500/30 transition-colors">ERP</span>
            </h2>
          </Link>
          <p className="text-xs text-zinc-400 mt-2">Ingresa tus credenciales de administrador</p>
        </div>

        <Suspense fallback={<div className="h-10 animate-pulse bg-zinc-950 rounded-xl mb-4" />}>
          <RegisterAlert />
        </Suspense>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/30 border border-red-800 text-red-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@smartstock.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 rounded-xl cursor-pointer bg-white hover:bg-zinc-200 text-black font-bold py-3 text-sm transition tracking-wide active:scale-[0.99] disabled:opacity-50"
          >
            {submitting ? 'Iniciando sesión...' : 'Ingresar al Panel'}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500 mt-6 select-none">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="text-zinc-300 hover:text-white underline underline-offset-4 font-medium transition-colors">
            Regístrate aquí
          </Link>
        </p>

      </div>
    </div>
  );
}
