// Helper reutilizable para hacer peticiones HTTP con la API Fetch.
// Encapsula headers, timeout (AbortController) y manejo de errores.
// En desarrollo, Vite redirige /api -> json-server (puerto 3000). Funciona local y en Codespaces.
const API_URL = "/api";

export const helpFetch = () => {
  const customFetch = async (endpoint, options = {}) => {
    const defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const controller = new AbortController();
    const config = {
      method: options.method || "GET",
      headers: { ...defaultHeaders, ...(options.headers || {}) },
      signal: controller.signal,
    };
    if (options.body) config.body = JSON.stringify(options.body);

    const timer = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(endpoint, config);
      if (!res.ok) {
        return { err: true, status: res.status, statusText: res.statusText || "Error" };
      }
      return await res.json();
    } catch (error) {
      return {
        err: true,
        status: 0,
        statusText:
          error.name === "AbortError"
            ? "La API no respondió a tiempo"
            : "No se pudo conectar con la API (¿está corriendo json-server en el puerto 3000?)",
      };
    } finally {
      clearTimeout(timer);
    }
  };

  const getAll = (resource) => customFetch(`${API_URL}/${resource}`);
  const create = (resource, body) => customFetch(`${API_URL}/${resource}`, { method: "POST", body });
  const update = (resource, id, body) =>
    customFetch(`${API_URL}/${resource}/${id}`, { method: "PUT", body });
  const remove = (resource, id) => customFetch(`${API_URL}/${resource}/${id}`, { method: "DELETE" });

  return { getAll, create, update, remove };
};
