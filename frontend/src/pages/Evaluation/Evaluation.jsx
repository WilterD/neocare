import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Evaluation.css";

import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import ctImage from "../../assets/CT.png";
import qsImage from "../../assets/QS.png";
import realizarEImage from "../../assets/RealizarE.png";

import amImage from "../../assets/DatosP.png";
import edadImage from "../../assets/Edad.png";
import heImage from "../../assets/EdadB.png";
import residenciaImage from "../../assets/Residencia.png";
import erImage from "../../assets/AF.png";
import ocImage from "../../assets/DatosClinicos.png";
import datosBebeImage from "../../assets/DatosBebe.png";
import avImage from "../../assets/Peso.png";
import saImage from "../../assets/AR.png";

import inicioImage from "../../assets/Inicio.png";
import evaluacionImage from "../../assets/evaluacion.png";
import educacionImage from "../../assets/educacion.png";
import historialImage from "../../assets/h.png";
import perfilImage from "../../assets/perfil.png";

const sidebarItems = [
  {
    image: inicioImage,
    label: "Inicio",
    path: "/",
  },
  {
    image: evaluacionImage,
    label: "Evaluación",
    path: "/evaluacion",
  },
  {
    image: educacionImage,
    label: "Educación",
    path: "/educacion",
  },
  {
    image: historialImage,
    label: "Historial",
    path: "/historial",
  },
  {
    image: perfilImage,
    label: "Perfil",
    path: "/perfil",
  },
];

/*
  Catálogo de signos de alarma neonatal.

  Alto riesgo: 3 puntos
  Riesgo moderado: 2 puntos
  Bajo riesgo: 1 punto

  Clasificación por signos:
  0–2 puntos: Riesgo bajo
  3–5 puntos: Riesgo medio
  ≥6 puntos: Riesgo alto

  Además, si aparece al menos un signo de alto riesgo,
  el resultado por signos se considera alto.
*/

const dangerSignsCatalog = {
  convulsiones: {
    label: "Convulsiones",
    points: 3,
    category: "alto",
    aliases: ["convulsiones", "convulsion"],
  },
  dificultadRespiratoria: {
    label: "Dificultad respiratoria",
    points: 3,
    category: "alto",
    aliases: [
      "dificultadRespiratoria",
      "dificultad_respiratoria",
      "respiracionDificultosa",
      "problemasRespirar",
      "respiraMal",
      "respiracionRapida",
      "hundimientoCostillas",
    ],
  },
  coloracionAzulada: {
    label: "Coloración azulada de labios o piel",
    points: 3,
    category: "alto",
    aliases: [
      "coloracionAzulada",
      "coloracion_azulada",
      "pielAzulada",
      "labiosAzules",
      "cianosis",
      "pielAzul",
    ],
  },
  fiebreHipotermia: {
    label: "Fiebre o hipotermia",
    points: 3,
    category: "alto",
    aliases: [
      "fiebreHipotermia",
      "fiebre",
      "hipotermia",
      "temperaturaAlterada",
      "temperaturaAlta",
      "temperaturaBaja",
      "frioAlTacto",
    ],
  },
  rechazoAlimentacion: {
    label: "Rechazo completo de la alimentación",
    points: 3,
    category: "alto",
    aliases: [
      "rechazoAlimentacion",
      "rechazo_alimentacion",
      "rechazoCompletoAlimentacion",
      "rechazaAlimento",
      "rechazaPecho",
      "rechazaBiberon",
      "noSeAlimenta",
    ],
  },
  disminucionConciencia: {
    label: "Disminución importante del estado de conciencia",
    points: 3,
    category: "alto",
    aliases: [
      "disminucionConciencia",
      "disminucion_conciencia",
      "letargo",
      "somnolenciaExcesiva",
      "dificilDespertar",
      "noResponde",
      "estadoConciencia",
    ],
  },

  vomitosRepetitivos: {
    label: "Vómitos repetitivos",
    points: 2,
    category: "medio",
    aliases: [
      "vomitosRepetitivos",
      "vomitoRepetitivo",
      "vomitos",
      "vomitoFrecuente",
      "vomitadoRepetidamente",
    ],
  },
  ictericiaProgresiva: {
    label: "Ictericia progresiva",
    points: 2,
    category: "medio",
    aliases: [
      "ictericiaProgresiva",
      "ictericia",
      "pielAmarilla",
      "coloracionAmarilla",
      "amarillo",
    ],
  },
  disminucionActividad: {
    label: "Disminución de la actividad habitual",
    points: 2,
    category: "medio",
    aliases: [
      "disminucionActividad",
      "disminucion_actividad",
      "menosActivo",
      "actividadDisminuida",
      "actividadBaja",
      "estaMasDormido",
    ],
  },
  llantoPersistente: {
    label: "Llanto persistente o inconsolable",
    points: 2,
    category: "medio",
    aliases: [
      "llantoPersistente",
      "llantoInconsolable",
      "llantoExcesivo",
      "lloraMucho",
      "llantoDebil",
    ],
  },

  alteracionesSueno: {
    label: "Alteraciones leves del sueño",
    points: 1,
    category: "bajo",
    aliases: [
      "alteracionesSueno",
      "alteraciones_sueno",
      "suenoAlterado",
      "duermeMal",
      "sueno",
    ],
  },
  disminucionApetito: {
    label: "Disminución leve del apetito",
    points: 1,
    category: "bajo",
    aliases: [
      "disminucionApetito",
      "disminucion_apetito",
      "apetitoBajo",
      "comeMenos",
      "apetito",
    ],
  },
  irritabilidadOcasional: {
    label: "Irritabilidad ocasional",
    points: 1,
    category: "bajo",
    aliases: [
      "irritabilidadOcasional",
      "irritabilidad",
      "inquieto",
      "molesto",
    ],
  },
};

const normalizeText = (value) => {
  if (value === null || value === undefined) return "";

  return String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const getNumberValue = (value) => {
  if (value === null || value === undefined || value === "") return null;

  const cleanValue = String(value).replace(",", ".");
  const numberValue = Number(cleanValue);

  return Number.isNaN(numberValue) ? null : numberValue;
};

const getWeightInKg = (pesoNacer) => {
  const peso = getNumberValue(pesoNacer);

  if (peso === null) return null;

  /*
    Si el valor viene mayor a 20, se asume que está en gramos.
    Ejemplo: 3100 -> 3.1 kg.
    Si viene como 3.1, se asume que ya está en kg.
  */
  if (peso > 20) {
    return peso / 1000;
  }

  return peso;
};

const isYes = (value) => {
  const normalized = normalizeText(value);

  return (
    normalized === "si" ||
    normalized === "sí" ||
    normalized === "true" ||
    normalized === "1" ||
    normalized === "yes" ||
    normalized === "presente" ||
    normalized === "registrado" ||
    normalized === "seleccionado"
  );
};

const isNo = (value) => {
  const normalized = normalizeText(value);

  /*
    Importante:
    "No registrado" NO debe contarse como "No",
    porque eso generaría riesgo falso cuando el campo está vacío.
  */

  return (
    normalized === "no" ||
    normalized === "false" ||
    normalized === "0" ||
    normalized === "ninguno" ||
    normalized === "ninguna"
  );
};

const getRiskLabel = (risk) => {
  const labels = {
    bajo: "Bajo",
    medio: "Medio",
    alto: "Alto",
  };

  return labels[risk] || "Bajo";
};

const classifyDangerSignsRisk = (score, selectedSigns) => {
  const hasHighRiskSign = selectedSigns.some(
    (sign) => sign.category === "alto"
  );

  if (hasHighRiskSign || score >= 6) {
    return "alto";
  }

  if (score >= 3) {
    return "medio";
  }

  return "bajo";
};

const classifyMaternalRisk = (score) => {
  if (score >= 7) {
    return "alto";
  }

  if (score >= 4) {
    return "medio";
  }

  return "bajo";
};

const classifyNeonatalRisk = (score) => {
  if (score >= 6) {
    return "alto";
  }

  if (score >= 3) {
    return "medio";
  }

  return "bajo";
};

const getCombinedRisk = (maternalRisk, neonatalRisk) => {
  if (maternalRisk === "bajo" && neonatalRisk === "bajo") {
    return "bajo";
  }

  if (maternalRisk === "alto" && neonatalRisk === "alto") {
    return "alto";
  }

  if (
    (maternalRisk === "alto" && neonatalRisk === "medio") ||
    (maternalRisk === "medio" && neonatalRisk === "alto")
  ) {
    return "alto";
  }

  if (
    (maternalRisk === "alto" && neonatalRisk === "bajo") ||
    (maternalRisk === "bajo" && neonatalRisk === "alto") ||
    (maternalRisk === "medio" && neonatalRisk === "medio") ||
    (maternalRisk === "medio" && neonatalRisk === "bajo") ||
    (maternalRisk === "bajo" && neonatalRisk === "medio")
  ) {
    return "medio";
  }

  return "bajo";
};

const getFollowRecommendation = (riskLevel) => {
  if (riskLevel === "alto") {
    return {
      title: "Atención prioritaria",
      action: "Prioridad máxima",
      text:
        "Se identifican condiciones de alto riesgo. Acude de inmediato al centro de salud más cercano o comunícate con el servicio de emergencia correspondiente.",
    };
  }

  if (riskLevel === "medio") {
    return {
      title: "Seguimiento recomendado",
      action: "Seguimiento reforzado",
      text:
        "Se recomienda vigilancia cercana, seguimiento diario y consulta médica en menos de 24 horas si las señales persisten, aumentan o generan dudas.",
    };
  }

  return {
    title: "Cuidados generales en casa",
    action: "Seguimiento básico",
    text:
      "El resultado indica bajo riesgo. Mantén los cuidados generales en casa, observa la evolución del recién nacido y consulta el contenido educativo disponible.",
  };
};

const collectPossibleDangerSignSources = (registro, usuario) => {
  return [
    registro?.signosAlarma,
    registro?.signosNeonatales,
    registro?.triajeNeonatal,
    registro?.evaluacionRiesgo,
    registro?.datosClinicos?.signosAlarma,
    registro?.datosClinicos?.signosNeonatales,
    registro?.recienNacido?.signosAlarma,

    usuario?.signosAlarma,
    usuario?.signosNeonatales,
    usuario?.triajeNeonatal,
    usuario?.evaluacionRiesgo,
    usuario?.datosClinicos?.signosAlarma,
    usuario?.datosClinicos?.signosNeonatales,
  ].filter(Boolean);
};

const extractSelectedDangerSigns = (registro, usuario) => {
  const sources = collectPossibleDangerSignSources(registro, usuario);
  const selectedIds = new Set();

  sources.forEach((source) => {
    if (Array.isArray(source)) {
      source.forEach((item) => {
        const normalizedItem = normalizeText(item);

        Object.entries(dangerSignsCatalog).forEach(([signId, sign]) => {
          const matchesId = normalizeText(signId) === normalizedItem;
          const matchesLabel = normalizeText(sign.label) === normalizedItem;
          const matchesAlias = sign.aliases.some(
            (alias) => normalizeText(alias) === normalizedItem
          );

          if (matchesId || matchesLabel || matchesAlias) {
            selectedIds.add(signId);
          }
        });
      });

      return;
    }

    if (typeof source === "object") {
      Object.entries(source).forEach(([key, value]) => {
        if (!isYes(value)) return;

        const normalizedKey = normalizeText(key);

        Object.entries(dangerSignsCatalog).forEach(([signId, sign]) => {
          const matchesId = normalizeText(signId) === normalizedKey;
          const matchesAlias = sign.aliases.some(
            (alias) => normalizeText(alias) === normalizedKey
          );

          if (matchesId || matchesAlias) {
            selectedIds.add(signId);
          }
        });
      });
    }
  });

  return Array.from(selectedIds).map((id) => ({
    id,
    ...dangerSignsCatalog[id],
  }));
};

const calculateDangerSignsRisk = (registro, usuario) => {
  const selectedSigns = extractSelectedDangerSigns(registro, usuario);
  const score = selectedSigns.reduce((sum, sign) => sum + sign.points, 0);
  const risk = classifyDangerSignsRisk(score, selectedSigns);

  return {
    score,
    risk,
    label: getRiskLabel(risk),
    selectedSigns,
    selectedSignIds:
      selectedSigns.length > 0
        ? selectedSigns.map((sign) => sign.id)
        : ["sinSignosRegistrados"],
  };
};

const calculateMaternalRisk = (
  datosPersonales,
  sociodemografica,
  condicionesCuidado
) => {
  let score = 0;
  const factors = [];

  const edad = getNumberValue(datosPersonales?.edad);

  const nivelEducacion = normalizeText(
    sociodemografica?.nivelEducacion ||
      sociodemografica?.nivelEducativo ||
      sociodemografica?.educacion
  );

  const zonaResidencia = normalizeText(
    sociodemografica?.zonaResidencia ||
      sociodemografica?.residencia ||
      sociodemografica?.zona
  );

  const accesoSalud =
    sociodemografica?.accesoCentroSalud ||
    sociodemografica?.accesoSalud ||
    sociodemografica?.serviciosSalud;

  const madreSola =
    condicionesCuidado?.madreSola ||
    condicionesCuidado?.sinApoyoConstante ||
    condicionesCuidado?.cuidadoSola;

  const apoyoFamiliar =
    condicionesCuidado?.apoyoFamiliar ||
    condicionesCuidado?.tieneApoyoFamiliar ||
    condicionesCuidado?.apoyoConstante;

  const numeroHijos = getNumberValue(
    condicionesCuidado?.numeroHijos ||
      condicionesCuidado?.ninosCargo ||
      condicionesCuidado?.hijosCargo
  );

  const situacionEconomica = normalizeText(
    sociodemografica?.situacionEconomica ||
      sociodemografica?.ingreso ||
      sociodemografica?.nivelIngreso
  );

  if (edad !== null && edad < 18) {
    score += 3;
    factors.push({
      id: "RM1",
      label: "Edad materna menor a 18 años",
      points: 3,
      category: "materno",
    });
  }

  if (
    nivelEducacion.includes("basica") ||
    nivelEducacion.includes("primaria") ||
    nivelEducacion.includes("bajo")
  ) {
    score += 1;
    factors.push({
      id: "RM2",
      label: "Nivel educativo básico",
      points: 1,
      category: "materno",
    });
  }

  if (zonaResidencia.includes("rural")) {
    score += 1;
    factors.push({
      id: "RM3",
      label: "Residencia rural",
      points: 1,
      category: "materno",
    });
  }

  if (isNo(accesoSalud)) {
    score += 3;
    factors.push({
      id: "RM4",
      label: "Sin acceso a centro de salud",
      points: 3,
      category: "materno",
    });
  }

  if (isYes(madreSola)) {
    score += 3;
    factors.push({
      id: "RM5",
      label: "Madre o cuidadora sola",
      points: 3,
      category: "materno",
    });
  }

  if (isNo(apoyoFamiliar)) {
    score += 2;
    factors.push({
      id: "RM6",
      label: "Sin apoyo familiar",
      points: 2,
      category: "materno",
    });
  }

  if (numeroHijos !== null && numeroHijos >= 2) {
    score += 2;
    factors.push({
      id: "RM7",
      label: "Dos o más hijos a cargo",
      points: 2,
      category: "materno",
    });
  }

  if (
    situacionEconomica.includes("baja") ||
    situacionEconomica.includes("bajo")
  ) {
    score += 2;
    factors.push({
      id: "RM8",
      label: "Situación económica baja",
      points: 2,
      category: "materno",
    });
  }

  const risk = classifyMaternalRisk(score);

  return {
    score,
    risk,
    label: getRiskLabel(risk),
    factors,
  };
};

const calculateNeonatalRisk = (recienNacido, datosClinicos) => {
  let score = 0;
  const factors = [];

  const edadGestacional = getNumberValue(
    recienNacido?.edadGestacional ||
      recienNacido?.semanasGestacion ||
      recienNacido?.semanas
  );

  const pesoKg = getWeightInKg(
    recienNacido?.pesoNacer ||
      recienNacido?.pesoNacimiento ||
      recienNacido?.peso
  );

  const complicaciones =
    datosClinicos?.complicacionesNacer ||
    datosClinicos?.complicaciones ||
    datosClinicos?.tuvoComplicaciones;

  const hospitalizacion =
    datosClinicos?.hospitalizacionNeonatal ||
    datosClinicos?.hospitalizacion ||
    datosClinicos?.requiereHospitalizacion;

  if (edadGestacional !== null && edadGestacional < 37) {
    score += 3;
    factors.push({
      id: "RN1",
      label: "Prematuridad",
      points: 3,
      category: "neonatal",
    });
  }

  if (pesoKg !== null && pesoKg < 2.5) {
    score += 3;
    factors.push({
      id: "RN2",
      label: "Bajo peso al nacer",
      points: 3,
      category: "neonatal",
    });
  }

  if (isYes(complicaciones)) {
    score += 2;
    factors.push({
      id: "RN3",
      label: "Complicaciones al nacer",
      points: 2,
      category: "neonatal",
    });
  }

  if (isYes(hospitalizacion)) {
    score += 2;
    factors.push({
      id: "RN4",
      label: "Hospitalización neonatal",
      points: 2,
      category: "neonatal",
    });
  }

  const risk = classifyNeonatalRisk(score);

  return {
    score,
    risk,
    label: getRiskLabel(risk),
    factors,
  };
};

const buildEvaluationResult = (registro, usuario) => {
  const datosPersonales =
    registro?.datosPersonales || usuario?.datosPersonales || {};

  const sociodemografica =
    registro?.sociodemografica || usuario?.sociodemografica || {};

  const condicionesCuidado =
    registro?.condicionesCuidado || usuario?.condicionesCuidado || {};

  const recienNacido = registro?.recienNacido || usuario?.recienNacido || {};

  const datosClinicos = registro?.datosClinicos || usuario?.datosClinicos || {};

  const dangerSigns = calculateDangerSignsRisk(registro, usuario);

  const maternal = calculateMaternalRisk(
    datosPersonales,
    sociodemografica,
    condicionesCuidado
  );

  const neonatal = calculateNeonatalRisk(recienNacido, datosClinicos);

  const combinedRisk = getCombinedRisk(maternal.risk, neonatal.risk);

  /*
    Prioridad lógica:
    1. Si existen signos de alarma registrados, se usa el triaje por signos.
    2. Si no existen signos de alarma, se usa la estratificación inicial
       materna + neonatal.
  */

  const hasDangerSigns = dangerSigns.selectedSigns.length > 0;

  const finalRisk = hasDangerSigns ? dangerSigns.risk : combinedRisk;
  const finalScore = hasDangerSigns
    ? dangerSigns.score
    : maternal.score + neonatal.score;

  const recommendation = getFollowRecommendation(finalRisk);

  return {
    mode: hasDangerSigns ? "dangerSigns" : "initialRegistration",

    riskLevel: finalRisk,
    finalRisk,
    finalLabel: getRiskLabel(finalRisk),
    totalScore: finalScore,

    selectedSigns: dangerSigns.selectedSigns,
    selectedSignIds: dangerSigns.selectedSignIds,

    maternalScore: maternal.score,
    maternalRisk: maternal.risk,
    maternalLabel: maternal.label,
    maternalFactors: maternal.factors,

    neonatalScore: neonatal.score,
    neonatalRisk: neonatal.risk,
    neonatalLabel: neonatal.label,
    neonatalFactors: neonatal.factors,

    combinedRisk,
    combinedLabel: getRiskLabel(combinedRisk),

    identifiedFactors: hasDangerSigns
      ? dangerSigns.selectedSigns
      : [...maternal.factors, ...neonatal.factors],

    recommendation,
  };
};

const Evaluation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [usuario, setUsuario] = useState(location.state?.user || null);
  const [registro, setRegistro] = useState(location.state?.registro || null);

  useEffect(() => {
    const cargarDatosRegistro = () => {
      try {
        const storedUser = localStorage.getItem("neocareUser");
        const storedRegisterData = localStorage.getItem("neocareRegisterData");

        if (storedUser && !usuario) {
          setUsuario(JSON.parse(storedUser));
        }

        if (storedRegisterData && !registro) {
          setRegistro(JSON.parse(storedRegisterData));
        }
      } catch (error) {
        console.error("Error al cargar datos guardados:", error);
      }
    };

    cargarDatosRegistro();
  }, [usuario, registro]);

  const datosPersonales =
    registro?.datosPersonales || usuario?.datosPersonales || {};

  const sociodemografica =
    registro?.sociodemografica || usuario?.sociodemografica || {};

  const condicionesCuidado =
    registro?.condicionesCuidado || usuario?.condicionesCuidado || {};

  const recienNacido = registro?.recienNacido || usuario?.recienNacido || {};

  const datosClinicos = registro?.datosClinicos || usuario?.datosClinicos || {};

  const nombreUsuario =
    usuario?.nombre ||
    usuario?.nombreCompleto ||
    datosPersonales?.nombreCompleto ||
    "No registrado";

  const summaryData = [
    {
      image: amImage,
      label: "Madre o cuidadora",
      value: nombreUsuario,
    },
    {
      image: edadImage,
      label: "Edad",
      value: datosPersonales?.edad
        ? `${datosPersonales.edad} años`
        : "No registrada",
    },
    {
      image: residenciaImage,
      label: "Residencia",
      value:
        sociodemografica?.zonaResidencia ||
        sociodemografica?.residencia ||
        "No registrada",
    },
    {
      image: erImage,
      label: "Apoyo familiar",
      value: condicionesCuidado?.apoyoFamiliar || "No registrado",
      pill: true,
    },
    {
      image: ocImage,
      label: "Acceso a servicios de salud",
      value:
        sociodemografica?.accesoCentroSalud ||
        sociodemografica?.accesoSalud ||
        "No registrado",
    },
    {
      image: datosBebeImage,
      label: "Recién nacido",
      value: recienNacido?.sexo || "No registrado",
    },
    {
      image: heImage,
      label: "Edad del bebé",
      value: recienNacido?.edadActual || "No registrada",
    },
    {
      image: avImage,
      label: "Peso al nacer",
      value: recienNacido?.pesoNacer
        ? `${recienNacido.pesoNacer} g`
        : "No registrado",
    },
    {
      image: saImage,
      label: "Antecedentes relevantes",
      value: isYes(datosClinicos?.complicacionesNacer)
        ? datosClinicos?.complicacion || "Complicación registrada"
        : "Ninguno",
    },
  ];

  const handleGoBack = () => {
    navigate("/registro");
  };

  const handleRunEvaluation = () => {
    const evaluationResult = buildEvaluationResult(registro, usuario);

    navigate("/resultado", {
      state: {
        user: usuario,
        registro,
        evaluationResult,

        /*
          Ya no se envían signos quemados.
          Si no hay signos reales, se envía "sinSignosRegistrados"
          para evitar que Result.jsx use signos de prueba.
        */
        selectedSigns: evaluationResult.selectedSignIds,
      },
    });
  };

  return (
    <main className="evaluation-page-wrapper">
      <Header2 user={usuario} />

      <section className="evaluation-desktop">
        <aside className="evaluation-sidebar">
          <nav className="evaluation-sidebar-nav">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  isActive
                    ? "evaluation-sidebar-item active"
                    : "evaluation-sidebar-item"
                }
              >
                <span className="evaluation-sidebar-icon-box">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="evaluation-sidebar-icon"
                  />
                </span>

                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <section className="evaluation-main-panel">
          <header className="evaluation-title-row">
            <h1>Evaluación de riesgo</h1>

            <button
              type="button"
              className="evaluation-help-button"
              aria-label="Ayuda"
            >
              ?
            </button>
          </header>

          <section className="evaluation-hero-card">
            <div className="evaluation-hero-image-box">
              <img
                src={ctImage}
                alt="Casi terminamos"
                className="evaluation-hero-image"
              />
            </div>

            <div className="evaluation-hero-text">
              <h2>¡Casi terminamos!</h2>
              <p>
                Revisemos la información para evaluar el nivel de riesgo de tu
                bebé y brindarte recomendaciones.
              </p>
            </div>
          </section>

          <section className="evaluation-grid-content">
            <section className="evaluation-summary-card">
              <div className="evaluation-summary-header">
                <h2>Resumen de la información</h2>

                <button type="button" onClick={handleGoBack}>
                  ✎ Editar
                </button>
              </div>

              <div className="evaluation-summary-list">
                {summaryData.map((item) => (
                  <article className="evaluation-summary-row" key={item.label}>
                    <div className="evaluation-summary-image-box">
                      <img
                        src={item.image}
                        alt={item.label}
                        className="evaluation-summary-image"
                      />
                    </div>

                    <h3>{item.label}</h3>

                    {item.pill ? (
                      <span className="evaluation-pill">{item.value}</span>
                    ) : (
                      <p>{item.value}</p>
                    )}
                  </article>
                ))}
              </div>
            </section>

            <aside className="evaluation-action-column">
              <section className="evaluation-next-card">
                <h2>¿Qué sucede ahora?</h2>

                <div className="evaluation-next-content">
                  <div className="evaluation-next-image-box">
                    <img
                      src={qsImage}
                      alt="Qué sucede ahora"
                      className="evaluation-next-image"
                    />
                  </div>

                  <p>
                    Con esta información aplicaremos nuestras reglas de
                    clasificación para determinar el nivel de riesgo y el
                    seguimiento recomendado.
                  </p>
                </div>
              </section>

              <button
                type="button"
                className="evaluation-main-button"
                onClick={handleRunEvaluation}
              >
                <img
                  src={realizarEImage}
                  alt="Realizar evaluación"
                  className="evaluation-main-button-icon"
                />

                <span className="evaluation-main-button-text">
                  Realizar evaluación
                </span>

                <span className="evaluation-main-button-space"></span>
              </button>

              <p className="evaluation-secure-note">
                <span>▣</span>
                Tu información está segura y confidencial.
              </p>
            </aside>
          </section>
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default Evaluation;