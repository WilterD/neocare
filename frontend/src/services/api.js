const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const API_BASE = API_URL.replace(/\/api$/, "");

const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.mensaje || data.error || "Error en la solicitud");
  return data;
};

const apiFetch = (path, options = {}) =>
  fetch(`${API_URL}${path}`, options).then(handleResponse);

// Auth
export const login = (email, password) =>
  apiFetch("/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });

export const crearRegistro = (datos) =>
  apiFetch("/registro", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos) });

export const googleAuthUrl = () => `${API_BASE}/api/auth/google`;
export const forgotPassword = (email) =>
  apiFetch("/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
export const resetPassword = (token, password) =>
  apiFetch("/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) });

// Perfil y bebés
export const getPerfilMe = () => apiFetch("/perfil/me", { headers: authHeaders() });
export const updatePerfilMe = (data) =>
  apiFetch("/perfil/me", { method: "PUT", headers: { ...authHeaders(), "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const getBebes = () => apiFetch("/bebes", { headers: authHeaders() });
export const getBebeById = (id) => apiFetch(`/bebes/${id}`, { headers: authHeaders() });
export const crearBebe = (data) =>
  apiFetch("/bebes", { method: "POST", headers: { ...authHeaders(), "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const updateBebe = (id, data) =>
  apiFetch(`/bebes/${id}`, { method: "PUT", headers: { ...authHeaders(), "Content-Type": "application/json" }, body: JSON.stringify(data) });

export const obtenerRegistroPorId = (id) => apiFetch(`/registros/${id}`, { headers: authHeaders() });

// Evaluaciones
export const getEvaluaciones = () => apiFetch("/evaluaciones", { headers: authHeaders() });
export const getEvaluacionById = (id) => apiFetch(`/evaluaciones/${id}`, { headers: authHeaders() });
export const crearEvaluacion = (payload) =>
  apiFetch("/evaluaciones", { method: "POST", headers: { ...authHeaders(), "Content-Type": "application/json" }, body: JSON.stringify(payload) });

// Educación
export const getContenidoEducativo = async (filtros = {}) => {
  const params = new URLSearchParams();
  if (filtros.tema) params.set("tema", filtros.tema);
  if (filtros.nivelAlerta) params.set("nivelAlerta", filtros.nivelAlerta);
  const qs = params.toString();
  return apiFetch(`/contenido-educativo${qs ? `?${qs}` : ""}`);
};
export const getContenidoEducativoPorId = (id) => apiFetch(`/contenido-educativo/${id}`);

// Clínico
export const postTriaje = (data) =>
  apiFetch("/triaje", { method: "POST", headers: { ...authHeaders(), "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const getTriajeHistorial = (bebeId) => apiFetch(`/triaje/bebe/${bebeId}`, { headers: authHeaders() });
export const postSeguimiento = (data) =>
  apiFetch("/seguimiento", { method: "POST", headers: { ...authHeaders(), "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const getSeguimiento = (bebeId, evaluacionRiesgoId) =>
  apiFetch(`/seguimiento/bebe/${bebeId}?evaluacionRiesgoId=${evaluacionRiesgoId}`, { headers: authHeaders() });
export const postBitacoraBebe = (data) =>
  apiFetch("/bitacora-bebe", { method: "POST", headers: { ...authHeaders(), "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const getBitacoraBebe = (bebeId) => apiFetch(`/bitacora-bebe/${bebeId}`, { headers: authHeaders() });
export const getVacunas = (bebeId) => apiFetch(`/vacunas/${bebeId}`, { headers: authHeaders() });
export const patchVacuna = (bebeId, vacunaId, data) =>
  apiFetch(`/vacunas/${bebeId}/${vacunaId}`, { method: "PATCH", headers: { ...authHeaders(), "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const getControles = (bebeId) => apiFetch(`/controles/${bebeId}`, { headers: authHeaders() });
export const postControl = (bebeId, data) =>
  apiFetch(`/controles/${bebeId}`, { method: "POST", headers: { ...authHeaders(), "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const postDatosClinicos = (data) =>
  apiFetch("/datos-clinicos", { method: "POST", headers: { ...authHeaders(), "Content-Type": "application/json" }, body: JSON.stringify(data) });

// Emocional
export const postDiario = (data) =>
  apiFetch("/diario-emocional", { method: "POST", headers: { ...authHeaders(), "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const getDiarioMe = () => apiFetch("/diario-emocional/me", { headers: authHeaders() });
export const getDiarioPromedio = () => apiFetch("/diario-emocional/me/promedio", { headers: authHeaders() });
export const getDiarioEstado = () => apiFetch("/diario-emocional/me/estado", { headers: authHeaders() });
export const postEpds = (data) =>
  apiFetch("/epds", { method: "POST", headers: { ...authHeaders(), "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const getEpdsMe = () => apiFetch("/epds/me", { headers: authHeaders() });
export const getTestimonios = (etapa) => apiFetch(`/testimonios${etapa ? `?etapa=${etapa}` : ""}`);

// Notificaciones y contacto
export const getNotificaciones = () => apiFetch("/notificaciones", { headers: authHeaders() });
export const marcarNotificacionLeida = (id) =>
  apiFetch(`/notificaciones/${id}/leer`, { method: "PATCH", headers: authHeaders() });
export const enviarContacto = (datos) =>
  apiFetch("/contacto", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos) });

export { API_URL, API_BASE };
