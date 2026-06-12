const API_URL = "http://localhost:4000/api";

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