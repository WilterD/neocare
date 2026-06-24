const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const crearRegistro = async (datosRegistro) => {
  try {
    const response = await fetch(`${API_URL}/registro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosRegistro),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.mensaje || "Error al crear el registro");
    }

    return data;
  } catch (error) {
    console.error("Error en crearRegistro:", error.message);
    throw error;
  }
};

export const obtenerRegistros = async () => {
  try {
    const response = await fetch(`${API_URL}/registros`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.mensaje || "Error al obtener los registros");
    }

    return data;
  } catch (error) {
    console.error("Error en obtenerRegistros:", error.message);
    throw error;
  }
};

export const obtenerRegistroPorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}/registros/${id}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.mensaje || "Error al obtener el registro");
    }

    return data;
  } catch (error) {
    console.error("Error en obtenerRegistroPorId:", error.message);
    throw error;
  }
};

// =================== BEBÉS Y MÓDULOS EDUCATIVOS ===================

const handleFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.mensaje || "Error en la petición");
  }
  return data;
};

export const listarBebes = async () => {
  return handleFetch(`${API_URL}/bebes`);
};

export const obtenerBebeDetalle = async (id) => {
  return handleFetch(`${API_URL}/bebes/${id}`);
};

export const obtenerModuloEducativo = async (id) => {
  return handleFetch(`${API_URL}/bebes/${id}/modulo-educativo`);
};

export const obtenerTriajeBebe = async (id) => {
  return handleFetch(`${API_URL}/bebes/${id}/triaje`);
};

export const obtenerSeguimientoBebe = async (id) => {
  return handleFetch(`${API_URL}/bebes/${id}/seguimiento`);
};

export const obtenerVacunasControlesBebe = async (id) => {
  return handleFetch(`${API_URL}/bebes/${id}/vacunas-controles`);
};

export const loginUsuario = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.mensaje || "Error al iniciar sesión");
    }

    return data;
  } catch (error) {
    console.error("Error en loginUsuario:", error.message);
    throw error;
  }
};

export const guardarTriajeBebe = async (id, payload) => {
  return handleFetch(`${API_URL}/bebes/${id}/triaje`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const guardarSeguimientoBebe = async (id, payload) => {
  return handleFetch(`${API_URL}/bebes/${id}/seguimiento`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const guardarControlBebe = async (id, payload) => {
  return handleFetch(`${API_URL}/bebes/${id}/controles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const actualizarEstadoVacuna = async (id, payload) => {
  return handleFetch(`${API_URL}/bebes/${id}/vacunas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};
