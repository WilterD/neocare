import saImage from "../assets/SA.png";
import datosBebeImage from "../assets/DatosBebe.png";
import cuidadosBasicosImage from "../assets/CUIDADOSBASICOS.png";
import sepsisImage from "../assets/sepsis.png";
import lacLogoImage from "../assets/LACLOGO.png";
import hipoImage from "../assets/HIPO.png";
import temLogoImage from "../assets/TEMLOGO.png";
import controlImage from "../assets/CONTROL.png";
import vacuImage from "../assets/VACU.png";
import qsImage from "../assets/QS.png";
import realizarEImage from "../assets/RealizarE.png";

const normalize = (v) =>
  String(v || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const temaToCategory = (tema) => {
  const t = normalize(tema);
  if (t.includes("signo") || t.includes("alarma")) return "signos";
  if (t.includes("lactancia")) return "lactancia";
  if (t.includes("cuidado")) return "cuidados";
  if (t.includes("temperatura")) return "temperatura";
  if (t.includes("ictericia")) return "ictericia";
  if (t.includes("sepsis")) return "sepsis";
  if (t.includes("hipotermia")) return "hipotermia";
  if (t.includes("vacuna")) return "vacunas";
  if (t.includes("control")) return "controles";
  if (t.includes("triaje")) return "triaje";
  if (t.includes("seguimiento")) return "seguimiento";
  return "todos";
};

export const formatEdadDias = (dias) => {
  if (dias === 0) return "Al nacer";
  if (dias === 7) return "A los 7 días";
  if (dias === 30) return "Al mes de vida";
  if (dias === 60) return "A los 2 meses";
  if (dias === 120) return "A los 4 meses";
  if (dias === 180) return "A los 6 meses";
  if (dias === 270) return "A los 9 meses";
  if (dias === 365) return "Al año de edad";
  if (dias < 30) return `A los ${dias} días`;
  const meses = Math.round(dias / 30);
  return `A los ${meses} meses`;
};

export const imagenPorTema = (tema) => {
  const cat = temaToCategory(tema);
  const map = {
    signos: saImage,
    ictericia: datosBebeImage,
    cuidados: cuidadosBasicosImage,
    sepsis: sepsisImage,
    lactancia: lacLogoImage,
    hipotermia: hipoImage,
    temperatura: temLogoImage,
    controles: controlImage,
    vacunas: vacuImage,
    triaje: qsImage,
    seguimiento: realizarEImage,
  };
  return map[cat] || saImage;
};

export const mapContenidoToTopic = (c) => ({
  id: c.id,
  title: c.titulo,
  description: c.descripcion,
  category: temaToCategory(c.tema),
  image: imagenPorTema(c.tema),
  nivelAlerta: c.nivel_alerta,
  recomendacion: c.recomendacion,
  fuente: c.fuente_referencia,
  urlRecurso: c.url_recurso,
});
