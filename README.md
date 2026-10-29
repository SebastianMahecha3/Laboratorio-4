# Negocio ULibre – CRUD con React y json-server

Laboratorio IV · Programación Web · Universidad Libre (2026-II)

Front-end en **React** que consume una API ficticia con **json-server** para administrar
los datos de un negocio: **productos, clientes, proveedores, compras y ventas**.
Usa **hooks** (`useState`, `useEffect`), un **helper** de Fetch (`helpFetch`) y **Bootstrap 5**.

## Estructura

```
├── db.json                     # Base de datos ficticia (API)
├── index.html                  # Maquetación + Bootstrap
└── src/
    ├── index.jsx               # Punto de entrada, monta <Negocio />
    ├── Negocio.jsx             # Pestañas por módulo del negocio
    ├── components/CrudTabla.jsx# CRUD reutilizable (Create, Read, Update, Delete)
    └── helpers/helpFetch.js    # Helper de peticiones HTTP
```

## Puertos

| Servicio        | Puerto | Comando         |
|-----------------|--------|-----------------|
| Front (público) | 5173   | `npm run dev`   |
| API (privado)   | 3000   | `npm run api`   |

## Ejecución

```bash
npm install
npm start        # levanta API y front al mismo tiempo
```

Abrir http://localhost:5173

## Operaciones CRUD

- **Create:** formulario lateral → `POST /recurso`
- **Read:** `useEffect` + `helpFetch.getAll` → `GET /recurso`
- **Update:** botón *Editar* → `PUT /recurso/:id`
- **Delete:** botón *Eliminar* → `DELETE /recurso/:id`

## GitHub Codespaces

1. En el repositorio: **Code → Codespaces → Create codespace on main**.
2. En la terminal del codespace: `npm install` y luego `npm start`.
3. Abrir la pestaña **Ports** y abrir el puerto **5173** (ícono del globo). El puerto 3000 (API) queda privado y no hace falta abrirlo: el front lo consume por el proxy `/api`.
