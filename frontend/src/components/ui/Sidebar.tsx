// src/components/ui/Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export default function Sidebar() {
  const pathname = usePathname();

  const navigation: NavigationItem[] = [
    {
      name: 'Inicio',
      href: '/dashboard',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
    },
    {
      name: 'Clientes',
      href: '/dashboard/clients',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    // ==========================================
    // NUEVO ENLACE: INTEGRACIÓN DE INVENTARIO
    // ==========================================
    {
      name: 'Inventario',
      href: '/dashboard/inventory',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
    },
    // ==========================================
    // NUEVO ENLACE: INTEGRACIÓN MÓDULO FINANCIERO
    // ==========================================
    {
      name: 'Facturación',
      href: '/dashboard/billing',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5c.621 0 1.125.504 1.125 1.125v12.75c0 .621-.504 1.125-1.125 1.125H3.75M3.75 4.5a1.125 1.125 0 00-1.125 1.125V18.75m1.125-14.25v14.25m6-10.5h6m-6 3h6m-6 3h1.5m11.25-3h.008v.008H21V12zm0 3h.008v.008H21v-.008z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-64 h-screen border-r border-zinc-900 bg-zinc-950 text-white flex flex-col justify-between select-none shrink-0">
      <div className="flex flex-col flex-1 py-6">
        {/* Brand / Logo */}
        <div className="px-6 mb-8">
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            SmartStock <span className="text-zinc-500 font-medium text-xs bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">ERP</span>
          </h1>
        </div>

        {/* Links de Navegación */}
        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-zinc-900 text-white border-l-2 border-emerald-500 pl-3.5'
                    : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
                }`}
              >
                <span className={`${isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'} transition-colors`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer del Sidebar (Cuenta o Perfil del Negocio) */}
      <div className="p-4 border-t border-zinc-900 bg-zinc-900/10">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-300">
            CH
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-medium text-white truncate">Chema Admin</p>
            <p className="text-[10px] text-zinc-500 truncate">September 2026</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
