import { useState } from "react";
import CrudTabla from "./components/CrudTabla";

// Definición de cada módulo del negocio: recurso de la API + campos del formulario
const MODULOS = [
  {
    recurso: "productos",
    titulo: "Productos",
    campos: [
      { name: "nombre", label: "Nombre" },
      { name: "categoria", label: "Categoría" },
      { name: "precio", label: "Precio", type: "number", money: true },
      { name: "stock", label: "Stock", type: "number" },
    ],
  },
  {
    recurso: "clientes",
    titulo: "Clientes",
    campos: [
      { name: "nombre", label: "Nombre" },
      { name: "documento", label: "Documento" },
      { name: "telefono", label: "Teléfono", type: "tel" },
      { name: "correo", label: "Correo", type: "email" },
    ],
  },
  {
    recurso: "proveedores",
    titulo: "Proveedores",
    campos: [
      { name: "nombre", label: "Nombre" },
      { name: "nit", label: "NIT" },
      { name: "telefono", label: "Teléfono", type: "tel" },
      { name: "ciudad", label: "Ciudad" },
    ],
  },
  {
    recurso: "compras",
    titulo: "Compras",
    campos: [
      { name: "proveedor", label: "Proveedor" },
      { name: "producto", label: "Producto" },
      { name: "cantidad", label: "Cantidad", type: "number" },
      { name: "total", label: "Total", type: "number", money: true },
      { name: "fecha", label: "Fecha", type: "date" },
    ],
  },
  {
    recurso: "ventas",
    titulo: "Ventas",
    campos: [
      { name: "cliente", label: "Cliente" },
      { name: "producto", label: "Producto" },
      { name: "cantidad", label: "Cantidad", type: "number" },
      { name: "total", label: "Total", type: "number", money: true },
      { name: "fecha", label: "Fecha", type: "date" },
    ],
  },
];

export default function Negocio() {
  const [activo, setActivo] = useState(MODULOS[0].recurso);
  const modulo = MODULOS.find((m) => m.recurso === activo);

  return (
    <>
      <nav className="navbar navbar-dark bg-dark mb-4">
        <div className="container">
          <span className="navbar-brand mb-0 h1">Negocio ULibre</span>
          <span className="navbar-text small">Laboratorio IV · React + json-server</span>
        </div>
      </nav>

      <main className="container pb-5">
        <ul className="nav nav-tabs mb-4">
          {MODULOS.map((m) => (
            <li className="nav-item" key={m.recurso}>
              <button
                className={`nav-link ${m.recurso === activo ? "active" : ""}`}
                onClick={() => setActivo(m.recurso)}
              >
                {m.titulo}
              </button>
            </li>
          ))}
        </ul>

        <CrudTabla key={modulo.recurso} {...modulo} />
      </main>
    </>
  );
}
