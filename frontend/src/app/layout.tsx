import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // 💡 Importación en su lugar correcto

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartStock ERP",
  description: "Sistema inteligente de gestión de ventas e inventario",
};

// 💡 Cambiamos a la firma estándar de React para garantizar compatibilidad global
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-white">
        {/* 💡 Envolvemos el children para activar el estado de sesión en toda la app */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
