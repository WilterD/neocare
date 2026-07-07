export const formatFechaNacimiento = (value) => {
  const soloNumeros = String(value || "").replace(/\D/g, "").slice(0, 8);
  if (soloNumeros.length <= 2) return soloNumeros;
  if (soloNumeros.length <= 4) {
    return `${soloNumeros.slice(0, 2)}/${soloNumeros.slice(2)}`;
  }
  return `${soloNumeros.slice(0, 2)}/${soloNumeros.slice(2, 4)}/${soloNumeros.slice(4)}`;
};

export const parseFechaDdMmYyyy = (fechaStr) => {
  if (!fechaStr || !String(fechaStr).includes("/")) return null;
  const partes = String(fechaStr).split("/");
  if (partes.length !== 3) return null;
  const [dia, mes, anio] = partes.map((p) => Number(p));
  if (!dia || !mes || !anio || anio < 1900) return null;
  const fecha = new Date(anio, mes - 1, dia);
  if (
    fecha.getFullYear() !== anio ||
    fecha.getMonth() !== mes - 1 ||
    fecha.getDate() !== dia
  ) {
    return null;
  }
  fecha.setHours(0, 0, 0, 0);
  return fecha;
};

export const validarFechaNacimiento = (fechaStr) => {
  const fecha = parseFechaDdMmYyyy(fechaStr);
  if (!fecha) {
    return "Debes ingresar una fecha válida en formato dd/mm/aaaa.";
  }
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (fecha > hoy) {
    return "La fecha de nacimiento no puede ser futura.";
  }
  return "";
};
