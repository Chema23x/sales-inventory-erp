# SmartStock ERP 🚀

**SmartStock ERP** es una plataforma integral Fullstack y SaaS diseñada para la gestión inteligente de ventas, control de existencias en tiempo real y facturación recurrente corporativa. Toda la aplicación ha sido construida bajo una arquitectura de diseño premium dark, tipado estricto y atomicidad transaccional.

## 🛠️ Tecnologías y Stack Utilizado

### Backend (`/backend`)
*   **Runtime:** Node.js + Express + TypeScript ~6.0.0
*   **Base de Datos:** PostgreSQL 18
*   **ORM:** Prisma Client v5.11.0
*   **Autenticación:** JWT (JsonWebToken) + Cifrado Bcrypt

### Frontend (`/frontend`)
*   **Framework:** Next.js 15+ (App Router)
*   **Estilos:** Tailwind CSS v4 (Premium Dark UI)
*   **Compilador:** Turbopack (`--turbo`)
*   **Manejo de Estado:** Context API de React (`AuthProvider`)

---

## 🗺️ Arquitectura de la API (Endpoints Auditados)

### Autenticación (`/api/auth`)
*   `POST /api/auth/register` -> Registro de administradores globales.
*   `POST /api/auth/login` -> Emisión de tokens de sesión seguros (24h).

### Clientes y Facturación (`/api/clients` & `/api/billing`)
*   `GET /api/clients` -> Directorio de clientes con meta-paginación de 5 en 5.
*   `POST /api/billing/subscribe` -> Transacción atómica (`$transaction`) para asociar planes y emitir cobros históricos inmediatos.
*   `GET /api/billing/summary` -> Reporte agregador de MRR (Ingreso Mensual Recurrente).

### Almacén y POS (`/api/products` & `/api/sales`)
*   `GET /api/products` -> Catálogo general con banderas analíticas de *Stock Bajo*.
*   `GET /api/products/alerts/low-stock` -> Despliegue preventivo de desabasto para el Dashboard.
*   `POST /api/sales` -> Terminal POS con descuento de stock automatizado y aislamiento ante sobreventas.

---

## 🚀 Instalación y Despliegue Local

### 1. Clonar el repositorio
```bash
git clone https://github.com
cd sales-inventory-erp
```

### 2. Configurar el Backend
Crea un archivo `.env` dentro de la carpeta `/backend`:
```env
PORT=5000
DATABASE_URL="postgresql://usuario:password@localhost:5432/smartstock_db?schema=public"
JWT_SECRET="tu_clave_secreta_global_jwt"
```
Instala dependencias e inicializa la base de datos PostgreSQL:
```bash
cd backend
npm install
npx prisma db push
npm run dev
```

### 3. Configurar el Frontend
Crea un archivo `.env.local` dentro de la carpeta `/frontend`:
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```
Levanta el entorno con soporte Turbopack:
```bash
cd ../frontend
npm install
npm run dev
```

---

## 📈 Métricas de Desarrollo
*   **Fecha de Finalización:** Septiembre 2026
*   **Estado:** Producción Completa v1.0.0
*   **Desarrollador Principal:** Chema Admin
