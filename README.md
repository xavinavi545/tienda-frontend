# Tienda Web (Svelte + TypeScript + Express + SQLite)

Aplicación web tipo tienda donde:
- Un **vendedor** publica artículos con **stock**.
- Un **cliente** puede **pedir** artículos.
- El **vendedor** puede ver los **pedidos** de sus artículos con los datos del cliente.

Frontend y backend están en **proyectos separados**.  
Frontend esta **publicado** en Vercel.  
Backend se ejecuta en **localhost**.

---

## Tecnologías

### Frontend
- Svelte + TypeScript (Vite)
- Fetch API
- Componentes Svelte (Auth, Cliente, Vendedor)

### Backend
- Node.js + Express
- SQLite (archivo local)
- JWT (autenticación)
- bcryptjs (hash de contraseña)
- CORS

---

## Estructura

tienda-backend/
server.js
.env
data/db.sqlite

tienda-frontend/
src/
components/
pages/
lib/
.env



---

## Requisitos
- Node.js 18+ recomendado
- npm

---

## Configuración y ejecución (LOCAL)

### 1) Backend (localhost)

Ir a la carpeta del backend:

```bash
cd tienda-backend
npm install
```

Crear .env (si no existe) con:
```bash
PORT=4000
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=un_secreto_largo_aqui
```

## Iniciar backend:
```bash
npm run dev
```

### 2) Frontend (Svelte + TS)

Ya esta publicado en vercel:

https://tienda-frontend-hazel.vercel.app/
