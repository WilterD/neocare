const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const getToken = () =>
  localStorage.getItem("neocareToken") || sessionStorage.getItem("neocareToken");

export const authHeaders = (extra = {}) => {
  const headers = { ...extra };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const handleFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detalle = data.error ? `: ${data.error}` : "";
    throw new Error((data.mensaje || "Error en la petición") + detalle);
  }
  return data;
};

// Auth
export const crearRegistro = (datosRegistro) =>
  handleFetch(`${API_URL}/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosRegistro),
  });

export const loginUsuario = (email, password) =>
  handleFetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: String(email || "").trim().toLowerCase(),
      password,
    }),
  });

export const solicitarResetPassword = (email) =>
  handleFetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

export const restablecerPassword = (token, contrasenaNueva) =>
  handleFetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, contrasenaNueva }),
  });

// Bebés
export const listarBebes = () =>
  handleFetch(`${API_URL}/bebes`, { headers: authHeaders() });

export const crearBebe = (datos) =>
  handleFetch(`${API_URL}/bebes/nuevo`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(datos),
  });

export const obtenerBebeDetalle = (id) =>
  handleFetch(`${API_URL}/bebes/${id}`, { headers: authHeaders() });

export const obtenerModuloEducativo = (id) =>
  handleFetch(`${API_URL}/bebes/${id}/modulo-educativo`, {
    headers: authHeaders(),
  });

export const obtenerTriajeBebe = (id) =>
  handleFetch(`${API_URL}/bebes/${id}/triaje`, { headers: authHeaders() });

export const obtenerSeguimientoBebe = (id) =>
  handleFetch(`${API_URL}/bebes/${id}/seguimiento`, {
    headers: authHeaders(),
  });

export const obtenerVacunasControlesBebe = (id) =>
  handleFetch(`${API_URL}/bebes/${id}/vacunas-controles`, {
    headers: authHeaders(),
  });

export const guardarTriajeBebe = (bebeId, signos) =>
  handleFetch(`${API_URL}/bebes/${bebeId}/triaje`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ signos }),
  });

export const guardarSeguimientoBebe = (bebeId, payload) =>
  handleFetch(`${API_URL}/bebes/${bebeId}/seguimiento`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

export const guardarControlBebe = (bebeId, datos) =>
  handleFetch(`${API_URL}/bebes/${bebeId}/controles`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(datos),
  });

export const actualizarVacunaBebe = (bebeId, datos) =>
  handleFetch(`${API_URL}/bebes/${bebeId}/vacunas`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(datos),
  });

export const listarBitacoraBebe = (bebeId) =>
  handleFetch(`${API_URL}/bebes/${bebeId}/bitacora`, {
    headers: authHeaders(),
  });

export const crearBitacoraBebe = (bebeId, datos) =>
  handleFetch(`${API_URL}/bebes/${bebeId}/bitacora`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(datos),
  });

// Evaluaciones
export const listarMisEvaluaciones = () =>
  handleFetch(`${API_URL}/evaluaciones/mis`, { headers: authHeaders() });

export const crearEvaluacion = (payload) =>
  handleFetch(`${API_URL}/evaluaciones`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

// Perfil
export const obtenerPerfil = () =>
  handleFetch(`${API_URL}/perfil/me`, { headers: authHeaders() });

export const actualizarPerfil = (datos) =>
  handleFetch(`${API_URL}/perfil/me`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(datos),
  });

export const cambiarContrasena = (contrasenaActual, contrasenaNueva) =>
  handleFetch(`${API_URL}/perfil/contrasena`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ contrasenaActual, contrasenaNueva }),
  });

// Contacto
export const enviarContacto = (datos) =>
  handleFetch(`${API_URL}/contacto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

// Educación
export const listarContenidoEducativo = () =>
  handleFetch(`${API_URL}/educacion`);

export const obtenerContenidoEducativo = (id) =>
  handleFetch(`${API_URL}/educacion/${id}`);

export const obtenerMetaTriaje = () =>
  handleFetch(`${API_URL}/educacion/meta/triaje`);

export const obtenerMetaSeguimiento = () =>
  handleFetch(`${API_URL}/educacion/meta/seguimiento`);

export const obtenerMetaVacunas = () =>
  handleFetch(`${API_URL}/educacion/meta/vacunas`);

// Testimonios
export const listarTestimonios = () =>
  handleFetch(`${API_URL}/testimonios`);

// Emocional
export const listarDiarioEmocional = () =>
  handleFetch(`${API_URL}/emocional/diario`, { headers: authHeaders() });

export const crearDiarioEmocional = (datos) =>
  handleFetch(`${API_URL}/emocional/diario`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(datos),
  });

export const listarEpds = () =>
  handleFetch(`${API_URL}/emocional/epds`, { headers: authHeaders() });

export const crearEpds = (respuestas) =>
  handleFetch(`${API_URL}/emocional/epds`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ respuestas }),
  });

// Notificaciones
export const listarNotificaciones = () =>
  handleFetch(`${API_URL}/notificaciones`, { headers: authHeaders() });

export const marcarNotificacionLeida = (id) =>
  handleFetch(`${API_URL}/notificaciones/${id}/leida`, {
    method: "PUT",
    headers: authHeaders(),
  });
