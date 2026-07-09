import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Result.css";

import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import userImage from "../../assets/USER.png";

import inicioImage from "../../assets/Inicio.png";
import evaluacionImage from "../../assets/Evaluacion.png";
import educacionImage from "../../assets/Educacion.png";
import historialImage from "../../assets/H.png";
import perfilImage from "../../assets/Perfil.png";

import TARImage from "../../assets/TAR.png";
import TRRImage from "../../assets/TRR.png";
import TVRImage from "../../assets/TVR.png";

import FAImage from "../../assets/FA.png";
import FRImage from "../../assets/FR.png";
import FVImage from "../../assets/FV.png";

import CARImage from "../../assets/CAR.png";
import CRRImage from "../../assets/CRR.png";
import CVRImage from "../../assets/CVR.png";

import RRImage from "../../assets/RR.png";
import SRImage from "../../assets/SR.png";
import actImage from "../../assets/Act.png";
import evaImage from "../../assets/Eva.png";
import informacionSeguraImage from "../../assets/InformacionSegura.png";
import libretaImage from "../../assets/Libreta.png";
import verImage from "../../assets/Ver.png";

const sidebarItems = [
  {
    image: inicioImage,
    label: "Inicio",
    path: "/inicio",
  },
  {
    image: evaluacionImage,
    label: "Evaluación",
    path: "/nueva-evaluacion",
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

const riskSignsCatalog = {
  convulsiones: {
    id: "convulsiones",
    key: "convulsiones",
    label: "Convulsiones",
    points: 3,
    puntos: 3,
    category: "alto",
    categoria: "Alto riesgo",
  },
  dificultadRespiratoria: {
    id: "dificultadRespiratoria",
    key: "dificultadRespiratoria",
    label: "Dificultad respiratoria",
    points: 3,
    puntos: 3,
    category: "alto",
    categoria: "Alto riesgo",
  },
  coloracionAzulada: {
    id: "coloracionAzulada",
    key: "coloracionAzulada",
    label: "Coloración azulada de labios o piel",
    points: 3,
    puntos: 3,
    category: "alto",
    categoria: "Alto riesgo",
  },
  fiebreHipotermia: {
    id: "fiebreHipotermia",
    key: "fiebreHipotermia",
    label: "Fiebre o hipotermia",
    points: 3,
    puntos: 3,
    category: "alto",
    categoria: "Alto riesgo",
  },
  rechazoAlimentacion: {
    id: "rechazoAlimentacion",
    key: "rechazoAlimentacion",
    label: "Rechazo completo de la alimentación",
    points: 3,
    puntos: 3,
    category: "alto",
    categoria: "Alto riesgo",
  },
  disminucionConciencia: {
    id: "disminucionConciencia",
    key: "disminucionConciencia",
    label: "Disminución importante del estado de conciencia",
    points: 3,
    puntos: 3,
    category: "alto",
    categoria: "Alto riesgo",
  },
  vomitosRepetitivos: {
    id: "vomitosRepetitivos",
    key: "vomitosRepetitivos",
    label: "Vómitos repetitivos",
    points: 2,
    puntos: 2,
    category: "medio",
    categoria: "Riesgo moderado",
  },
  ictericiaProgresiva: {
    id: "ictericiaProgresiva",
    key: "ictericiaProgresiva",
    label: "Ictericia progresiva",
    points: 2,
    puntos: 2,
    category: "medio",
    categoria: "Riesgo moderado",
  },
  disminucionActividad: {
    id: "disminucionActividad",
    key: "disminucionActividad",
    label: "Disminución de la actividad habitual",
    points: 2,
    puntos: 2,
    category: "medio",
    categoria: "Riesgo moderado",
  },
  llantoPersistente: {
    id: "llantoPersistente",
    key: "llantoPersistente",
    label: "Llanto persistente o inconsolable",
    points: 2,
    puntos: 2,
    category: "medio",
    categoria: "Riesgo moderado",
  },
  alteracionesSueno: {
    id: "alteracionesSueno",
    key: "alteracionesSueno",
    label: "Alteraciones leves del sueño",
    points: 1,
    puntos: 1,
    category: "bajo",
    categoria: "Bajo riesgo",
  },
  disminucionApetito: {
    id: "disminucionApetito",
    key: "disminucionApetito",
    label: "Disminución leve del apetito",
    points: 1,
    puntos: 1,
    category: "bajo",
    categoria: "Bajo riesgo",
  },
  irritabilidadOcasional: {
    id: "irritabilidadOcasional",
    key: "irritabilidadOcasional",
    label: "Irritabilidad ocasional",
    points: 1,
    puntos: 1,
    category: "bajo",
    categoria: "Bajo riesgo",
  },
};

const normalizarTexto = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const riskSignsByLabel = Object.values(riskSignsCatalog).reduce(
  (acc, sign) => {
    acc[normalizarTexto(sign.label)] = sign;
    return acc;
  },
  {}
);

const getTodayLabel = () => {
  return new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getDateLabel = (value) => {
  if (!value) return getTodayLabel();

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return getTodayLabel();

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getRiskLabel = (riskLevel) => {
  const labels = {
    bajo: "Bajo",
    medio: "Moderado",
    alto: "Alto",
  };

  return labels[riskLevel] || "Bajo";
};

const getRiskLevelFromText = (value) => {
  const text = normalizarTexto(value);

  if (!text) return "";

  if (text.includes("alto")) return "alto";
  if (text.includes("medio") || text.includes("moderado")) return "medio";
  if (text.includes("bajo")) return "bajo";

  return "";
};

const getValidRiskLevel = (riskLevel, fallback = "bajo") => {
  return getRiskLevelFromText(riskLevel) || fallback;
};

const getRiskLevelFromScore = (score) => {
  const numericScore = Number(score) || 0;

  if (numericScore >= 6) {
    return "alto";
  }

  if (numericScore >= 3) {
    return "medio";
  }

  return "bajo";
};

const getNumberFromValues = (...values) => {
  for (const value of values) {
    if (value === undefined || value === null) continue;

    if (typeof value === "number" && !Number.isNaN(value)) {
      return value;
    }

    const text = String(value).trim();

    if (!text) continue;

    const match = text.match(/-?\d+(\.\d+)?/);

    if (match) {
      const number = Number(match[0]);

      if (!Number.isNaN(number)) return number;
    }
  }

  return 0;
};

const normalizeRecommendation = (recommendation, fallbackText = "") => {
  if (!recommendation && !fallbackText) return null;

  if (typeof recommendation === "string") {
    return {
      title: "",
      text: recommendation,
    };
  }

  if (typeof recommendation === "object" && recommendation !== null) {
    return {
      title:
        recommendation.title ||
        recommendation.titulo ||
        recommendation.actionTitle ||
        "",
      text:
        recommendation.text ||
        recommendation.description ||
        recommendation.descripcion ||
        recommendation.recommendation ||
        recommendation.recomendacion ||
        fallbackText ||
        "",
    };
  }

  return {
    title: "",
    text: fallbackText,
  };
};

const normalizeSignItem = (item) => {
  if (!item) return null;

  if (typeof item === "string") {
    const text = item.trim();

    if (!text) return null;

    const byId = riskSignsCatalog[text];
    const byLabel = riskSignsByLabel[normalizarTexto(text)];

    if (byId) return byId;
    if (byLabel) return byLabel;

    return {
      id: normalizarTexto(text).replace(/\s+/g, "_"),
      key: normalizarTexto(text).replace(/\s+/g, "_"),
      label: text,
      points: 0,
      puntos: 0,
      category: "",
      categoria: "",
    };
  }

  if (typeof item === "object") {
    const id = item.id || item.key || item.codigo || "";
    const label =
      item.label || item.nombre || item.descripcion || item.signo || "";

    const byId = riskSignsCatalog[id];
    const byLabel = riskSignsByLabel[normalizarTexto(label)];

    const base = byId || byLabel || {};

    const points = getNumberFromValues(
      item.points,
      item.puntos,
      item.score,
      item.puntaje,
      base.points
    );

    const category =
      getRiskLevelFromText(item.category || item.categoria || base.category) ||
      base.category ||
      "";

    return {
      ...base,
      ...item,
      id: id || base.id || normalizarTexto(label).replace(/\s+/g, "_"),
      key: id || base.key || normalizarTexto(label).replace(/\s+/g, "_"),
      label: label || base.label || "Factor registrado",
      points,
      puntos: points,
      category,
      categoria:
        item.categoria ||
        base.categoria ||
        (category === "alto"
          ? "Alto riesgo"
          : category === "medio"
          ? "Riesgo moderado"
          : category === "bajo"
          ? "Bajo riesgo"
          : ""),
    };
  }

  return null;
};

const uniqueItems = (items = []) => {
  const map = new Map();

  items.filter(Boolean).forEach((item, index) => {
    const key = item.id || item.key || item.label || `item-${index}`;

    if (!map.has(key)) {
      map.set(key, item);
    }
  });

  return Array.from(map.values());
};

const getPointsFromItems = (items = []) => {
  if (!Array.isArray(items)) return 0;

  return items.reduce((sum, item) => {
    const normalized = normalizeSignItem(item);
    const points = Number(normalized?.points ?? normalized?.puntos ?? 0);

    return sum + (Number.isNaN(points) ? 0 : points);
  }, 0);
};

const getSignsFromIds = (selectedSignIds = []) => {
  if (!Array.isArray(selectedSignIds)) return [];

  return selectedSignIds
    .filter((id) => id !== "sinSignosRegistrados" && riskSignsCatalog[id])
    .map((id) => riskSignsCatalog[id]);
};

const extractSignsFromPayload = (payload = {}) => {
  const signsFromIds = getSignsFromIds(
    Array.isArray(payload.selectedSignIds)
      ? payload.selectedSignIds
      : Array.isArray(payload.selected_sign_ids)
      ? payload.selected_sign_ids
      : []
  );

  const selectedSigns = Array.isArray(payload.selectedSigns)
    ? payload.selectedSigns.map(normalizeSignItem).filter(Boolean)
    : [];

  const signosActivos = Array.isArray(payload.signosActivos)
    ? payload.signosActivos.map(normalizeSignItem).filter(Boolean)
    : [];

  const detalleSignos = Array.isArray(payload.detalleSignos)
    ? payload.detalleSignos.map(normalizeSignItem).filter(Boolean)
    : [];

  return uniqueItems([
    ...signsFromIds,
    ...selectedSigns,
    ...signosActivos,
    ...detalleSignos,
  ]);
};

const normalizeFactorItems = (items = []) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index) => {
      if (typeof item === "string") {
        return {
          id: `factor-${index}`,
          label: item,
        };
      }

      if (typeof item === "object" && item !== null) {
        return {
          ...item,
          id: item.id || item.key || `factor-${index}`,
          label:
            item.label ||
            item.nombre ||
            item.descripcion ||
            item.factor ||
            "Factor registrado",
        };
      }

      return null;
    })
    .filter(Boolean);
};

const riskContent = {
  bajo: {
    title: "RIESGO BAJO",
    label: "Bajo",
    className: "low",
    icon: "✓",
    actionTitle: "Cuidados generales en casa",
    description:
      "No se identifican condiciones importantes de alarma en este momento. Continúa observando al recién nacido, mantén los cuidados generales en casa y consulta el contenido educativo disponible en NeoCare.",
    summary:
      "El resultado indica bajo riesgo. Se recomienda mantener la observación habitual, reforzar los cuidados básicos y consultar contenido educativo sobre alimentación, temperatura, sueño, coloración de la piel y signos de alarma.",
    steps: [
      "Mantén los cuidados generales del recién nacido en casa.",
      "Observa alimentación, temperatura, respiración y coloración de la piel.",
      "Consulta el contenido educativo para reforzar las pautas de cuidado.",
      "Realiza una nueva evaluación si aparece algún cambio o señal de alarma.",
    ],
    followTitle: "Cuidados generales en casa",
    followText:
      "El resultado indica bajo riesgo. Mantén los cuidados generales en casa, observa la evolución del recién nacido y consulta el contenido educativo disponible.",
    followButton: "Consultar contenido educativo",
  },
  medio: {
    title: "RIESGO MODERADO",
    label: "Moderado",
    className: "medium",
    icon: "!",
    actionTitle: "Atención recomendada",
    description:
      "Se recomienda vigilancia cercana y seguimiento del estado del recién nacido. Activa el seguimiento diario y consulta a un profesional de salud si las señales persisten, aumentan o generan dudas.",
    summary:
      "Se identificaron condiciones de riesgo moderado que requieren observación y seguimiento cercano. El resultado no indica una emergencia inmediata, pero sí recomienda vigilancia reforzada y consulta médica si la situación continúa o aumenta.",
    steps: [
      "Observa alimentación, temperatura, respiración y coloración de la piel del bebé.",
      "Activa el seguimiento diario para registrar su evolución.",
      "Consulta a un profesional de salud en menos de 24 horas si las señales persisten.",
      "Busca atención inmediata si aparece dificultad respiratoria, convulsiones, coloración azulada, fiebre alta, hipotermia o rechazo total del alimento.",
    ],
    followTitle: "Seguimiento recomendado",
    followText:
      "Se recomienda vigilancia cercana, seguimiento diario y consulta médica en menos de 24 horas si las señales persisten, aumentan o generan dudas.",
    followButton: "Activar seguimiento",
  },
  alto: {
    title: "RIESGO ALTO",
    label: "Alto",
    className: "high",
    icon: "!",
    actionTitle: "Atención inmediata",
    description:
      "Se identificaron condiciones de alto riesgo por acumulación de puntaje. NeoCare no reemplaza la atención médica profesional. Acude de inmediato al centro de salud más cercano o comunícate con el servicio de emergencia correspondiente.",
    summary:
      "El resultado indica alto riesgo. La acumulación de signos o condiciones registradas requiere atención médica inmediata. No se recomienda esperar una nueva evaluación ni usar el seguimiento diario como acción principal.",
    steps: [
      "Acude de inmediato al centro de salud más cercano.",
      "No esperes a que los síntomas desaparezcan por sí solos.",
      "No uses este resultado como sustituto de una valoración médica profesional.",
      "Si hay dificultad respiratoria, convulsiones, coloración azulada, fiebre alta, hipotermia o rechazo total del alimento, busca ayuda urgente.",
    ],
    followTitle: "Atención prioritaria",
    followText:
      "Se identifican condiciones de alto riesgo. Acude de inmediato al centro de salud más cercano o comunícate con el servicio de emergencia correspondiente.",
    followButton: "Buscar atención inmediata",
  },
};

const riskImages = {
  bajo: {
    triage: TVRImage,
    date: FVImage,
    classification: CVRImage,
  },
  medio: {
    triage: TARImage,
    date: FAImage,
    classification: CARImage,
  },
  alto: {
    triage: TRRImage,
    date: FRImage,
    classification: CRRImage,
  },
};

const buildResultFromLegacySigns = (selectedSignIds = []) => {
  const validSignIds = Array.isArray(selectedSignIds)
    ? selectedSignIds.filter(
        (id) => id !== "sinSignosRegistrados" && riskSignsCatalog[id]
      )
    : [];

  const selectedSigns = validSignIds.map((id) => riskSignsCatalog[id]);
  const score = selectedSigns.reduce((sum, sign) => sum + sign.points, 0);
  const riskLevel = getRiskLevelFromScore(score);

  return {
    mode: selectedSigns.length > 0 ? "dangerSigns" : "empty",
    riskLevel,
    finalRisk: riskLevel,
    finalLabel: getRiskLabel(riskLevel),
    totalScore: score,
    selectedSigns,
    selectedSignIds: validSignIds,
    identifiedFactors: selectedSigns,
    recommendation: null,
    fechaEvaluacion: null,
  };
};

const normalizeNewEvaluationPayload = (payload = {}, locationState = {}) => {
  const selectedSigns = extractSignsFromPayload(payload);

  const hasScore =
    payload.totalScore !== undefined ||
    payload.total_score !== undefined ||
    payload.puntuacion !== undefined ||
    payload.puntuacionTotal !== undefined ||
    payload.puntuacion_total !== undefined ||
    payload.puntaje !== undefined ||
    payload.score !== undefined;

  const calculatedScore = getPointsFromItems(selectedSigns);

  const totalScore = hasScore
    ? getNumberFromValues(
        payload.totalScore,
        payload.total_score,
        payload.puntuacion,
        payload.puntuacionTotal,
        payload.puntuacion_total,
        payload.puntaje,
        payload.score
      )
    : calculatedScore;

  const riskLevel = getRiskLevelFromScore(totalScore);

  const selectedSignIds = selectedSigns
    .map((sign) => sign.id || sign.key)
    .filter(Boolean);

  return {
    mode: "dangerSigns",
    riskLevel,
    finalRisk: riskLevel,
    finalLabel: getRiskLabel(riskLevel),
    totalScore,

    selectedSigns,
    selectedSignIds,
    identifiedFactors: selectedSigns,

    maternalScore: 0,
    maternalRisk: "bajo",
    maternalLabel: "Bajo",

    neonatalScore: 0,
    neonatalRisk: "bajo",
    neonatalLabel: "Bajo",

    combinedRisk: riskLevel,
    combinedLabel: getRiskLabel(riskLevel),

    recommendation: normalizeRecommendation(
      payload.recommendation ||
        payload.recomendacion ||
        payload.recomendaciones,
      riskContent[riskLevel]?.followText
    ),

    fechaEvaluacion:
      payload.fechaEvaluacion ||
      payload.fecha_evaluacion ||
      payload.fecha ||
      payload.createdAt ||
      payload.created_at ||
      locationState?.fechaEvaluacion ||
      null,

    observaciones: payload.observaciones || "",
    noPresentaSenales: Boolean(payload.noPresentaSenales),
  };
};

const normalizeInitialRegistrationPayload = (payload = {}) => {
  const maternalScore = getNumberFromValues(
    payload.maternalScore,
    payload.puntajeMaterno,
    payload.puntaje_materno,
    payload.madreScore
  );

  const neonatalScore = getNumberFromValues(
    payload.neonatalScore,
    payload.puntajeNeonatal,
    payload.puntaje_neonatal,
    payload.bebeScore
  );

  const totalScore = getNumberFromValues(
    payload.totalScore,
    payload.total_score,
    payload.puntuacion,
    payload.puntuacionTotal,
    payload.puntuacion_total,
    payload.puntaje,
    payload.score,
    maternalScore + neonatalScore
  );

  const maternalRisk = getValidRiskLevel(
    payload.maternalRisk ||
      payload.riesgoMaterno ||
      payload.clasificacionMaterna ||
      payload.clasificacion_materna,
    "bajo"
  );

  const neonatalRisk = getValidRiskLevel(
    payload.neonatalRisk ||
      payload.riesgoNeonatal ||
      payload.clasificacionNeonatal ||
      payload.clasificacion_neonatal,
    "bajo"
  );

  const combinedRisk = getValidRiskLevel(
    payload.combinedRisk ||
      payload.finalRisk ||
      payload.riskLevel ||
      payload.nivel ||
      payload.nivelRiesgo ||
      payload.nivel_riesgo ||
      payload.clasificacionFinal ||
      payload.clasificacion_final,
    getRiskLevelFromScore(totalScore)
  );

  const identifiedFactors = normalizeFactorItems(
    payload.identifiedFactors ||
      payload.factoresIdentificados ||
      payload.factores_identificados ||
      payload.factors ||
      []
  );

  return {
    mode: "initialRegistration",
    riskLevel: combinedRisk,
    finalRisk: combinedRisk,
    finalLabel:
      payload.finalLabel ||
      payload.combinedLabel ||
      payload.label ||
      getRiskLabel(combinedRisk),

    totalScore,

    selectedSigns: [],
    selectedSignIds: [],
    identifiedFactors,

    maternalScore,
    maternalRisk,
    maternalLabel:
      payload.maternalLabel ||
      payload.etiquetaMaterna ||
      getRiskLabel(maternalRisk),

    neonatalScore,
    neonatalRisk,
    neonatalLabel:
      payload.neonatalLabel ||
      payload.etiquetaNeonatal ||
      getRiskLabel(neonatalRisk),

    combinedRisk,
    combinedLabel:
      payload.combinedLabel ||
      payload.etiquetaFinal ||
      getRiskLabel(combinedRisk),

    recommendation: normalizeRecommendation(
      payload.recommendation ||
        payload.recomendacion ||
        payload.recomendaciones ||
        payload.recomendacionSeguimiento ||
        payload.recomendacion_seguimiento,
      riskContent[combinedRisk]?.followText
    ),

    fechaEvaluacion:
      payload.fechaEvaluacion ||
      payload.fecha_evaluacion ||
      payload.fecha ||
      payload.createdAt ||
      payload.created_at ||
      null,
  };
};

const payloadLooksLikeNewEvaluation = (payload = {}, locationState = {}) => {
  const modeText = normalizarTexto(
    [
      payload.mode,
      payload.tipo,
      payload.tipoEvaluacion,
      payload.tipo_evaluacion,
      locationState?.fromNewEvaluation ? "fromNewEvaluation" : "",
    ]
      .filter(Boolean)
      .join(" ")
  );

  const hasDangerSignArrays =
    Array.isArray(payload.selectedSignIds) ||
    Array.isArray(payload.selected_sign_ids) ||
    Array.isArray(payload.selectedSigns) ||
    Array.isArray(payload.signosActivos) ||
    Array.isArray(payload.detalleSignos);

  return (
    locationState?.fromNewEvaluation ||
    modeText.includes("danger") ||
    modeText.includes("triage") ||
    modeText.includes("signos") ||
    modeText.includes("alarma") ||
    modeText.includes("nueva") ||
    hasDangerSignArrays ||
    payload.noPresentaSenales === true
  );
};

const normalizeEvaluationResult = (locationState) => {
  const evaluationResult = locationState?.evaluationResult || null;
  const evaluation = locationState?.evaluation || null;

  if (evaluationResult) {
    if (payloadLooksLikeNewEvaluation(evaluationResult, locationState)) {
      return normalizeNewEvaluationPayload(evaluationResult, locationState);
    }

    return normalizeInitialRegistrationPayload(evaluationResult);
  }

  if (evaluation) {
    if (payloadLooksLikeNewEvaluation(evaluation, locationState)) {
      return normalizeNewEvaluationPayload(evaluation, locationState);
    }

    return normalizeInitialRegistrationPayload(evaluation);
  }

  return buildResultFromLegacySigns(locationState?.selectedSigns || []);
};

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const usuario = location.state?.user || null;
  const resultData = normalizeEvaluationResult(location.state);

  const riskLevel = getValidRiskLevel(resultData.riskLevel);
  const risk = riskContent[riskLevel] || riskContent.bajo;
  const currentImages = riskImages[riskLevel] || riskImages.bajo;

  const totalScore = Number(resultData.totalScore) || 0;
  const finalLabel = resultData.finalLabel || risk.label;

  const recommendation = resultData.recommendation;
  const followTitle = recommendation?.title || risk.followTitle;
  const followText = recommendation?.text || risk.followText;
  const followButton = risk.followButton;

  const identifiedItems = Array.isArray(resultData.identifiedFactors)
    ? resultData.identifiedFactors
    : [];

  const hasIdentifiedItems = identifiedItems.length > 0;
  const isInitialRegistration = resultData.mode === "initialRegistration";

  const summaryTitle = isInitialRegistration
    ? "Factores identificados:"
    : "Signos identificados:";

  const emptySummaryText = isInitialRegistration
    ? "• Sin factores de riesgo registrados"
    : "• Sin signos de alarma registrados";

  const scoreText = `${totalScore} puntos`;
  const dateText = getDateLabel(resultData.fechaEvaluacion);

  const handleFollowAction = () => {
    if (riskLevel === "bajo") {
      navigate("/educacion");
      return;
    }

    if (riskLevel === "medio") {
      navigate("/historial");
      return;
    }

    navigate("/contacto");
  };

  return (
    <main className="result-page-wrapper">
      <Header2 user={usuario} />

      <section className="result-desktop">
        <aside className="result-sidebar">
          <nav className="result-sidebar-nav">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === "/inicio"}
                className={({ isActive }) =>
                  isActive
                    ? "result-sidebar-item active"
                    : "result-sidebar-item"
                }
              >
                <span className="result-sidebar-icon-box">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="result-sidebar-icon"
                  />
                </span>

                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <section className="result-main-panel">
          <header className="result-title-row">
            <div className="result-title-left">
              <h1>Resultado de la evaluación</h1>
            </div>

            <div className="result-help-tooltip-wrapper">
              <button
                type="button"
                className="result-help-button"
                aria-label="Interpretar resultado"
              >
                ?
              </button>

              <div className="result-help-tooltip">
                <div className="result-help-tooltip-icon">...</div>

                <div className="result-help-tooltip-text">
                  <h3>¿Necesitas ayuda?</h3>
                  <p>Estamos aquí para ayudarte.</p>
                </div>

                <button
                  type="button"
                  className="result-help-tooltip-button"
                  onClick={() => navigate("/contacto")}
                >
                  Contáctanos ›
                </button>
              </div>
            </div>
          </header>

          <section className={`result-risk-card ${risk.className}`}>
            <div className="result-risk-content">
              <div className="result-risk-icon-circle">
                <div className="result-risk-shield">{risk.icon}</div>
              </div>

              <div className="result-risk-text">
                <p className="result-risk-label">Nivel de riesgo</p>
                <h2>{risk.title}</h2>

                <h3>{risk.actionTitle}</h3>
                <p>{risk.description}</p>
              </div>
            </div>

            <div className="result-risk-stats">
              <div className="result-stat-item">
                <span className={`result-stat-icon-box ${riskLevel}`}>
                  <img
                    src={currentImages.triage}
                    alt="Puntaje obtenido"
                    className="result-stat-icon"
                  />
                </span>

                <div>
                  <p>Puntaje obtenido</p>
                  <strong>{scoreText}</strong>
                </div>
              </div>

              <div className="result-stat-item">
                <span className={`result-stat-icon-box ${riskLevel}`}>
                  <img
                    src={currentImages.classification}
                    alt="Clasificación"
                    className="result-stat-icon"
                  />
                </span>

                <div>
                  <p>Clasificación</p>
                  <strong>{finalLabel}</strong>
                </div>
              </div>

              <div className="result-stat-item">
                <span className={`result-stat-icon-box ${riskLevel}`}>
                  <img
                    src={currentImages.date}
                    alt="Fecha de evaluación"
                    className="result-stat-icon"
                  />
                </span>

                <div>
                  <p>Fecha de evaluación</p>
                  <strong>{dateText}</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="result-card result-summary-card">
            <div className="result-card-icon image-icon">
              <img
                src={RRImage}
                alt="Resumen de evaluación"
                className="result-section-image"
              />
            </div>

            <div>
              <h2>Resumen de la evaluación</h2>
              <p>{risk.summary}</p>

              {isInitialRegistration && (
                <div className="result-combined-summary">
                  <span>
                    Riesgo materno:{" "}
                    <strong>{resultData.maternalLabel}</strong>
                  </span>

                  <span>
                    Riesgo neonatal:{" "}
                    <strong>{resultData.neonatalLabel}</strong>
                  </span>
                </div>
              )}

              <h3>{summaryTitle}</h3>

              <div className="result-chip-list">
                {hasIdentifiedItems ? (
                  identifiedItems.map((item, index) => (
                    <span
                      key={item.id || item.key || item.label || index}
                      className={`result-chip ${riskLevel}`}
                    >
                      • {item.label || "Factor registrado"}
                      {item.points || item.puntos
                        ? ` (${item.points || item.puntos} pts)`
                        : ""}
                    </span>
                  ))
                ) : (
                  <span className={`result-chip ${riskLevel}`}>
                    {emptySummaryText}
                  </span>
                )}
              </div>
            </div>
          </section>

          <section className={`result-card result-action-card ${riskLevel}`}>
            <div className="result-action-text">
              <div className="result-action-heading">
                <div className="result-card-icon image-icon">
                  <img
                    src={currentImages.triage}
                    alt="Qué debes hacer ahora"
                    className="result-section-image result-action-risk-image"
                  />
                </div>

                <h2>¿Qué debes hacer ahora?</h2>
              </div>

              <ul>
                {risk.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="result-user-image-box">
              <img
                src={userImage}
                alt="Madre o cuidadora con recién nacido"
                className="result-user-image"
              />
            </div>
          </section>

          <section className={`result-follow-card ${risk.className}`}>
            <div className="result-follow-info">
              <div className="result-card-icon image-icon">
                <img
                  src={SRImage}
                  alt="Seguimiento recomendado"
                  className="result-section-image"
                />
              </div>

              <div>
                <h2>{followTitle}</h2>
                <p>{followText}</p>
              </div>
            </div>

            <button
              type="button"
              className="result-follow-button"
              onClick={handleFollowAction}
            >
              <img
                src={actImage}
                alt=""
                className="result-follow-button-icon"
              />
              {followButton}
            </button>
          </section>

          <section className="result-remember-card">
            <div className="result-remember-icon image-icon">
              <img
                src={informacionSeguraImage}
                alt="Información segura"
                className="result-section-image"
              />
            </div>

            <div>
              <h2>Recuerda</h2>
              <p>
                NeoCare brinda orientación inicial y apoyo educativo, pero no
                reemplaza la atención médica profesional. Ante signos de alarma
                o dudas sobre la salud del recién nacido,{" "}
                <strong>acude al centro de salud más cercano.</strong>
              </p>
            </div>
          </section>

          <section className="result-final-card">
            <h2>¿Qué deseas hacer ahora?</h2>

            <div className="result-final-grid">
              <button
                type="button"
                className="result-final-action green"
                onClick={() => navigate("/nueva-evaluacion")}
              >
                <span className="result-final-icon-box">
                  <img
                    src={evaImage}
                    alt="Realizar nueva evaluación"
                    className="result-final-icon"
                  />
                </span>

                <div>
                  <strong>Realizar nueva evaluación</strong>
                  <p>
                    Actualiza las señales actuales del bebé y genera un nuevo
                    resultado.
                  </p>
                </div>
              </button>

              <button
                type="button"
                className="result-final-action purple"
                onClick={() => navigate("/educacion")}
              >
                <span className="result-final-icon-box">
                  <img
                    src={libretaImage}
                    alt="Consultar contenido educativo"
                    className="result-final-icon"
                  />
                </span>

                <div>
                  <strong>Consultar contenido educativo</strong>
                  <p>Accede a guías y recursos para el cuidado del bebé.</p>
                </div>
              </button>

              <button
                type="button"
                className="result-final-action brown"
                onClick={() => navigate("/historial")}
              >
                <span className="result-final-icon-box">
                  <img
                    src={verImage}
                    alt="Ver historial"
                    className="result-final-icon"
                  />
                </span>

                <div>
                  <strong>Ver historial</strong>
                  <p>Revisa tus evaluaciones anteriores.</p>
                </div>
              </button>
            </div>
          </section>
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default Result;