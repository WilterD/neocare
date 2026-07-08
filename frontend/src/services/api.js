export const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:4000/api";

console.log("API_URL usada por NeoCare:", API_URL);

const getStoredToken = (storage) => {
  if (!storage) return null;

  try {
    const directToken =
      storage.getItem("neocareToken") ||
      storage.getItem("token") ||
      storage.getItem("authToken") ||
      storage.getItem("accessToken");

    if (directToken) return directToken;

    const storedUser = storage.getItem("neocareUser");

    if (storedUser) {
      const user = JSON.parse(storedUser);

      return (
        user.token ||
        user.accessToken ||
        user.access_token ||
        user.jwt ||
        user.usuario?.token ||
        user.user?.token ||
        null
      );
    }

    return null;
  } catch {
    return null;
  }
};

export const getToken = () =>
  getStoredToken(localStorage) || getStoredToken(sessionStorage);

export const authHeaders = (extra = {}) => {
  const headers = { ...extra };
  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const parseBodyForLog = (body) => {
  if (!body) return null;

  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
};

const handleFetch = async (url, options = {}) => {
  console.log("Enviando petición al backend:", {
    url,
    method: options.method || "GET",
    headers: options.headers || {},
    body: parseBodyForLog(options.body),
  });

  try {
    const response = await fetch(url, options);
    const text = await response.text();

    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    console.log("Respuesta del backend:", {
      url,
      status: response.status,
      ok: response.ok,
      data,
    });

    if (!response.ok) {
      throw new Error(
        data.mensaje ||
          data.error ||
          data.message ||
          data.raw ||
          `Error HTTP ${response.status}`
      );
    }

    return data;
  } catch (error) {
    console.error("Error real conectando con backend:", {
      url,
      mensaje: error.message,
      error,
    });

    throw error;
  }
};

const guardarSesion = (data) => {
  const token =
    data.token ||
    data.accessToken ||
    data.access_token ||
    data.jwt ||
    data.data?.token ||
    data.data?.accessToken ||
    data.data?.access_token ||
    data.usuario?.token ||
    data.user?.token ||
    null;

  const usuario =
    data.usuario ||
    data.user ||
    data.madre ||
    data.cuidador ||
    data.data?.usuario ||
    data.data?.user ||
    data.data?.madre ||
    data.data?.cuidador ||
    null;

  if (token) {
    localStorage.setItem("neocareToken", token);
    localStorage.setItem("token", token);
  }

  if (usuario) {
    localStorage.setItem(
      "neocareUser",
      JSON.stringify({
        ...usuario,
        token,
      })
    );
  }

  console.log("SESIÓN GUARDADA:", {
    tokenGuardado: Boolean(token),
    usuarioGuardado: usuario,
    respuestaLogin: data,
  });

  return {
    token,
    usuario,
  };
};

// ============================================================================
// AUTH / REGISTRO
// ============================================================================

export const crearRegistro = (datosRegistro) =>
  handleFetch(`${API_URL}/registro`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datosRegistro),
  });

export const loginUsuario = async (emailOrPayload, passwordArg) => {
  const email =
    typeof emailOrPayload === "object"
      ? emailOrPayload.email ||
        emailOrPayload.correo ||
        emailOrPayload.correo_electronico ||
        ""
      : emailOrPayload;

  const password =
    typeof emailOrPayload === "object"
      ? emailOrPayload.password ||
        emailOrPayload.contrasena ||
        emailOrPayload.contraseña ||
        ""
      : passwordArg;

  const data = await handleFetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: String(email || "").trim().toLowerCase(),
      password,
    }),
  });

  guardarSesion(data);

  return data;
};

export const cerrarSesion = () => {
  localStorage.removeItem("neocareToken");
  localStorage.removeItem("token");
  localStorage.removeItem("authToken");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("neocareUser");
  localStorage.removeItem("neocareBebe");

  sessionStorage.removeItem("neocareToken");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("neocareUser");
  sessionStorage.removeItem("neocareBebe");
};

export const solicitarResetPassword = (email) =>
  handleFetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

export const restablecerPassword = (token, contrasenaNueva) =>
  handleFetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, contrasenaNueva }),
  });

// ============================================================================
// BEBÉS
// ============================================================================

export const listarBebes = () =>
  handleFetch(`${API_URL}/bebes`, {
    headers: authHeaders(),
  });

export const obtenerResumenUserHome = () =>
  handleFetch(`${API_URL}/bebes/user-home/resumen`, {
    headers: authHeaders(),
  });

export const crearBebe = (datos) =>
  handleFetch(`${API_URL}/bebes/nuevo`, {
    method: "POST",
    headers: authHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(datos),
  });

export const obtenerBebeDetalle = (id) =>
  handleFetch(`${API_URL}/bebes/${id}`, {
    headers: authHeaders(),
  });

export const obtenerModuloEducativo = (id) =>
  handleFetch(`${API_URL}/bebes/${id}/modulo-educativo`, {
    headers: authHeaders(),
  });

export const obtenerTriajeBebe = (id) =>
  handleFetch(`${API_URL}/bebes/${id}/triaje`, {
    headers: authHeaders(),
  });

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
    headers: authHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({ signos }),
  });

export const guardarSeguimientoBebe = (bebeId, payload) =>
  handleFetch(`${API_URL}/bebes/${bebeId}/seguimiento`, {
    method: "POST",
    headers: authHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

export const guardarControlBebe = (bebeId, datos) =>
  handleFetch(`${API_URL}/bebes/${bebeId}/controles`, {
    method: "POST",
    headers: authHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(datos),
  });

export const actualizarVacunaBebe = (bebeId, datos) =>
  handleFetch(`${API_URL}/bebes/${bebeId}/vacunas`, {
    method: "POST",
    headers: authHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(datos),
  });

export const listarBitacoraBebe = (bebeId) =>
  handleFetch(`${API_URL}/bebes/${bebeId}/bitacora`, {
    headers: authHeaders(),
  });

export const crearBitacoraBebe = (bebeId, datos) =>
  handleFetch(`${API_URL}/bebes/${bebeId}/bitacora`, {
    method: "POST",
    headers: authHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(datos),
  });

// ============================================================================
// EVALUACIONES
// ============================================================================

export const listarMisEvaluaciones = () =>
  handleFetch(`${API_URL}/evaluaciones/mis`, {
    headers: authHeaders(),
  });

export const crearEvaluacion = (payload) =>
  handleFetch(`${API_URL}/evaluaciones`, {
    method: "POST",
    headers: authHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

// ============================================================================
// PERFIL
// ============================================================================

export const obtenerPerfil = () =>
  handleFetch(`${API_URL}/perfil/me`, {
    headers: authHeaders(),
  });

export const actualizarPerfil = (datos) =>
  handleFetch(`${API_URL}/perfil/me`, {
    method: "PUT",
    headers: authHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(datos),
  });

export const cambiarContrasena = (contrasenaActual, contrasenaNueva) =>
  handleFetch(`${API_URL}/perfil/contrasena`, {
    method: "PUT",
    headers: authHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      contrasenaActual,
      contrasenaNueva,
    }),
  });

// ============================================================================
// CONTACTO
// ============================================================================

export const enviarContacto = (datos) =>
  handleFetch(`${API_URL}/contacto`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

// ============================================================================
// EDUCACIÓN
// ============================================================================

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

// ============================================================================
// TESTIMONIOS
// ============================================================================

export const listarTestimonios = () =>
  handleFetch(`${API_URL}/testimonios`);

// ============================================================================
// EMOCIONAL
// ============================================================================

export const listarDiarioEmocional = () =>
  handleFetch(`${API_URL}/emocional/diario`, {
    headers: authHeaders(),
  });

export const crearDiarioEmocional = (datos) =>
  handleFetch(`${API_URL}/emocional/diario`, {
    method: "POST",
    headers: authHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(datos),
  });

export const listarEpds = () =>
  handleFetch(`${API_URL}/emocional/epds`, {
    headers: authHeaders(),
  });

export const crearEpds = (respuestas) =>
  handleFetch(`${API_URL}/emocional/epds`, {
    method: "POST",
    headers: authHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({ respuestas }),
  });

// ============================================================================
// NOTIFICACIONES
// ============================================================================

export const listarNotificaciones = () =>
  handleFetch(`${API_URL}/notificaciones`, {
    headers: authHeaders(),
  });

export const marcarNotificacionLeida = (id) =>
  handleFetch(`${API_URL}/notificaciones/${id}/leida`, {
    method: "PUT",
    headers: authHeaders(),
  });