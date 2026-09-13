'use client';

import React, { useState } from 'react';
import { apiFetch } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { loginGlobal } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(false);

    if (!email || !password) {
      setError('Por favor llena todos los campos.');
      return;
    }

    try {
      setLoading(true);
      // Petición POST directa a tu backend de Node.js usando tu utilería
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Guardar en el estado global y redirigir
      loginGlobal(data.token, data.user);
    } catch (err: any) {
      setError(err.message || 'Credenciales incorrectas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 select-none">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">SmartStock ERP</h1>
          <p className="text-sm text-zinc-400 mt-1">Ingresa tus credenciales de administrador</p>
        </div>

        {/* Alerta de Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5" aria-label="Inicio de sesión de administrador">
          <div>
            {/* 💡 Sincronizamos htmlFor con el id del input */}
            <label htmlFor="email" className="block text-xs font-medium text-zinc-300 mb-1.5">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@correo.com"
              autoComplete="username" // 💡 Permite a gestores de contraseñas identificar el usuario
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-zinc-300 mb-1.5">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password" // 💡 Estándar de seguridad para inputs de password
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
            />
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-200 text-black font-semibold py-3 px-4 rounded-xl text-sm transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {loading ? 'Validando acceso...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </main>
  );
}
