import { useEffect, useState } from "react";
import { helpFetch } from "../helpers/helpFetch";

const api = helpFetch();

// Componente CRUD reutilizable: recibe el recurso de la API y la definición de campos.
export default function CrudTabla({ recurso, titulo, campos }) {
  const formVacio = Object.fromEntries(campos.map((c) => [c.name, ""]));

  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(formVacio);
  const [editandoId, setEditandoId] = useState(null);

  // READ: carga los datos cada vez que cambia el recurso (pestaña)
  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError(null);
    setEditandoId(null);
    setForm(formVacio);

    api.getAll(recurso).then((res) => {
      if (!activo) return;
      if (res.err) {
        setError(res.statusText);
        setDatos([]);
      } else {
        setDatos(res);
      }
      setCargando(false);
    });

    return () => {
      activo = false;
    };
  }, [recurso]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === "number" && value !== "" ? Number(value) : value });
  };

  const limpiar = () => {
    setForm(formVacio);
    setEditandoId(null);
  };

  // CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (editandoId) {
      const res = await api.update(recurso, editandoId, { ...form, id: editandoId });
      if (res.err) return setError(res.statusText);
      setDatos(datos.map((d) => (d.id === editandoId ? res : d)));
    } else {
      const res = await api.create(recurso, form);
      if (res.err) return setError(res.statusText);
      setDatos([...datos, res]);
    }
    limpiar();
  };

  const handleEditar = (item) => {
    setEditandoId(item.id);
    setForm(Object.fromEntries(campos.map((c) => [c.name, item[c.name] ?? ""])));
  };

  // DELETE
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este registro?")) return;
    const res = await api.remove(recurso, id);
    if (res.err) return setError(res.statusText);
    setDatos(datos.filter((d) => d.id !== id));
    if (editandoId === id) limpiar();
  };

  return (
    <div className="row g-4">
      <div className="col-lg-4">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white fw-semibold">
            {editandoId ? `Editar ${titulo}` : `Nuevo registro en ${titulo}`}
          </div>
          <form className="card-body" onSubmit={handleSubmit}>
            {campos.map((c) => (
              <div className="mb-3" key={c.name}>
                <label className="form-label" htmlFor={`${recurso}-${c.name}`}>
                  {c.label}
                </label>
                <input
                  id={`${recurso}-${c.name}`}
                  className="form-control"
                  name={c.name}
                  type={c.type || "text"}
                  value={form[c.name]}
                  onChange={handleChange}
                  min={c.type === "number" ? 0 : undefined}
                  required
                />
              </div>
            ))}
            <div className="d-flex gap-2">
              <button className="btn btn-primary" type="submit">
                {editandoId ? "Guardar cambios" : "Agregar"}
              </button>
              {editandoId && (
                <button className="btn btn-outline-secondary" type="button" onClick={limpiar}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="col-lg-8">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  {campos.map((c) => (
                    <th key={c.name}>{c.label}</th>
                  ))}
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargando && (
                  <tr>
                    <td colSpan={campos.length + 2} className="text-center py-4">
                      <div className="spinner-border spinner-border-sm me-2" /> Cargando…
                    </td>
                  </tr>
                )}
                {!cargando && datos.length === 0 && !error && (
                  <tr>
                    <td colSpan={campos.length + 2} className="text-center text-muted py-4">
                      Aún no hay registros. Agrega el primero con el formulario.
                    </td>
                  </tr>
                )}
                {datos.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    {campos.map((c) => (
                      <td key={c.name}>
                        {c.money ? `$${Number(item[c.name]).toLocaleString("es-CO")}` : item[c.name]}
                      </td>
                    ))}
                    <td className="text-end text-nowrap">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEditar(item)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleEliminar(item.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-footer text-muted small">
            {datos.length} registro{datos.length === 1 ? "" : "s"} en {titulo.toLowerCase()}
          </div>
        </div>
      </div>
    </div>
  );
}
