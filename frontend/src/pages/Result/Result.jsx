import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Result.css";

import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import userImage from "../../assets/USER.png";

import inicioImage from "../../assets/Inicio.png";
import evaluacionImage from "../../assets/evaluacion.png";
import educacionImage from "../../assets/educacion.png";
import historialImage from "../../assets/h.png";
import perfilImage from "../../assets/perfil.png";

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

const riskSignsCatalog = {
  convulsiones: {
    id: "convulsiones",
    label: "Convulsiones",
    points: 3,
    category: "alto",
  },
  dificultadRespiratoria: {
    id: "dificultadRespiratoria",
    label: "Dificultad respiratoria",
    points: 3,
    category: "alto",
  },
  coloracionAzulada: {
    id: "coloracionAzulada",
    label: "Coloración azulada de labios o piel",
    points: 3,
    category: "alto",
  },
  fiebreHipotermia: {
    id: "fiebreHipotermia",
    label: "Fiebre o hipotermia",
    points: 3,
    category: "alto",
  },
  rechazoAlimentacion: {
    id: "rechazoAlimentacion",
    label: "Rechazo completo de la alimentación",
    points: 3,
    category: "alto",
  },
  disminucionConciencia: {
    id: "disminucionConciencia",
    label: "Disminución importante del estado de conciencia",
    points: 3,
    category: "alto",
  },
  vomitosRepetitivos: {
    id: "vomitosRepetitivos",
    label: "Vómitos repetitivos",
    points: 2,
    category: "medio",
  },
  ictericiaProgresiva: {
    id: "ictericiaProgresiva",
    label: "Ictericia progresiva",
    points: 2,
    category: "medio",
  },
  disminucionActividad: {
    id: "disminucionActividad",
    label: "Disminución de la actividad habitual",
    points: 2,
    category: "medio",
  },
  llantoPersistente: {
    id: "llantoPersistente",
    label: "Llanto persistente o inconsolable",
    points: 2,
    category: "medio",
  },
  alteracionesSueno: {
    id: "alteracionesSueno",
    label: "Alteraciones leves del sueño",
    points: 1,
    category: "bajo",
  },
  disminucionApetito: {
    id: "disminucionApetito",
    label: "Disminución leve del apetito",
    points: 1,
    category: "bajo",
  },
  irritabilidadOcasional: {
    id: "irritabilidadOcasional",
    label: "Irritabilidad ocasional",
    points: 1,
    category: "bajo",
  },
};

const getTodayLabel = () => {
  return new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getRiskLabel = (riskLevel) => {
  const labels = {
    bajo: "Bajo",
    medio: "Medio",
    alto: "Alto",
  };

  return labels[riskLevel] || "Bajo";
};

const getRiskLevelFromSigns = (score, selectedSigns) => {
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

const getValidRiskLevel = (riskLevel) => {
  if (riskLevel === "bajo" || riskLevel === "medio" || riskLevel === "alto") {
    return riskLevel;
  }

  return "bajo";
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
    title: "RIESGO MEDIO",
    label: "Medio",
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
      "Se identificaron condiciones de alto riesgo. NeoCare no reemplaza la atención médica profesional. Acude de inmediato al centro de salud más cercano o comunícate con el servicio de emergencia correspondiente.",
    summary:
      "El resultado indica alto riesgo. La presencia de condiciones graves o factores acumulados requiere atención médica inmediata. No se recomienda esperar una nueva evaluación ni usar el seguimiento diario como acción principal.",
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
  const validSignIds = selectedSignIds.filter(
    (id) => id !== "sinSignosRegistrados" && riskSignsCatalog[id]
  );

  const selectedSigns = validSignIds.map((id) => riskSignsCatalog[id]);
  const score = selectedSigns.reduce((sum, sign) => sum + sign.points, 0);
  const riskLevel = getRiskLevelFromSigns(score, selectedSigns);

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
  };
};

const normalizeEvaluationResult = (locationState) => {
  const evaluationResult = locationState?.evaluationResult || null;

  if (evaluationResult) {
    const riskLevel = getValidRiskLevel(
      evaluationResult.riskLevel || evaluationResult.finalRisk
    );

    const identifiedFactors =
      Array.isArray(evaluationResult.identifiedFactors) &&
      evaluationResult.identifiedFactors.length > 0
        ? evaluationResult.identifiedFactors
        : Array.isArray(evaluationResult.selectedSigns)
        ? evaluationResult.selectedSigns
        : [];

    const maternalRisk = getValidRiskLevel(evaluationResult.maternalRisk);
    const neonatalRisk = getValidRiskLevel(evaluationResult.neonatalRisk);
    const combinedRisk = getValidRiskLevel(evaluationResult.combinedRisk);

    return {
      mode: evaluationResult.mode || "initialRegistration",

      riskLevel,
      finalRisk: riskLevel,
      finalLabel:
        evaluationResult.finalLabel ||
        evaluationResult.label ||
        getRiskLabel(riskLevel),

      totalScore: Number(evaluationResult.totalScore) || 0,

      selectedSigns: Array.isArray(evaluationResult.selectedSigns)
        ? evaluationResult.selectedSigns
        : [],

      selectedSignIds: Array.isArray(evaluationResult.selectedSignIds)
        ? evaluationResult.selectedSignIds
        : [],

      identifiedFactors,

      maternalScore: Number(evaluationResult.maternalScore) || 0,
      maternalRisk,
      maternalLabel:
        evaluationResult.maternalLabel || getRiskLabel(maternalRisk),

      neonatalScore: Number(evaluationResult.neonatalScore) || 0,
      neonatalRisk,
      neonatalLabel:
        evaluationResult.neonatalLabel || getRiskLabel(neonatalRisk),

      combinedRisk,
      combinedLabel:
        evaluationResult.combinedLabel || getRiskLabel(combinedRisk),

      recommendation: evaluationResult.recommendation || null,
    };
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

  const handleFollowAction = () => {
    if (riskLevel === "bajo") {
      navigate("/educacion");
      return;
    }

    if (riskLevel === "medio") {
      navigate("/seguimiento");
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
                end={item.path === "/"}
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
                  <strong>{getTodayLabel()}</strong>
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
                      key={item.id || item.label || index}
                      className={`result-chip ${riskLevel}`}
                    >
                      • {item.label || "Factor registrado"}
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
                onClick={() => navigate("/evaluacion")}
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
                    Actualiza la información del bebé y genera un nuevo
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