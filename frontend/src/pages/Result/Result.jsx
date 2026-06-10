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
    label: "Convulsiones",
    points: 3,
    category: "alto",
  },
  dificultadRespiratoria: {
    label: "Dificultad respiratoria",
    points: 3,
    category: "alto",
  },
  coloracionAzulada: {
    label: "Coloración azulada de labios o piel",
    points: 3,
    category: "alto",
  },
  fiebreHipotermia: {
    label: "Fiebre o hipotermia",
    points: 3,
    category: "alto",
  },
  rechazoAlimentacion: {
    label: "Rechazo completo de la alimentación",
    points: 3,
    category: "alto",
  },
  disminucionConciencia: {
    label: "Disminución importante del estado de conciencia",
    points: 3,
    category: "alto",
  },
  vomitosRepetitivos: {
    label: "Vómitos repetitivos",
    points: 2,
    category: "medio",
  },
  ictericiaProgresiva: {
    label: "Ictericia progresiva",
    points: 2,
    category: "medio",
  },
  disminucionActividad: {
    label: "Disminución de la actividad habitual",
    points: 2,
    category: "medio",
  },
  llantoPersistente: {
    label: "Llanto persistente o inconsolable",
    points: 2,
    category: "medio",
  },
  alteracionesSueno: {
    label: "Alteraciones leves del sueño",
    points: 1,
    category: "bajo",
  },
  disminucionApetito: {
    label: "Disminución leve del apetito",
    points: 1,
    category: "bajo",
  },
  irritabilidadOcasional: {
    label: "Irritabilidad ocasional",
    points: 1,
    category: "bajo",
  },
};

const fallbackSelectedSigns = [
  "vomitosRepetitivos",
  "ictericiaProgresiva",
  "irritabilidadOcasional",
];

const getTodayLabel = () => {
  return new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getRiskLevel = (score, selectedSigns) => {
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

const riskContent = {
  bajo: {
    title: "RIESGO BAJO",
    label: "Bajo",
    className: "low",
    icon: "✓",
    actionTitle: "Cuidados generales en casa",
    description:
      "No se identifican signos de alarma importantes en este momento. Continúa observando al recién nacido, mantén los cuidados generales en casa y consulta el contenido educativo disponible en NeoCare.",
    summary:
      "El resultado indica bajo riesgo. Se recomienda mantener la observación habitual del bebé, reforzar los cuidados básicos y consultar contenido educativo sobre alimentación, temperatura, sueño, coloración de la piel y signos de alarma.",
    steps: [
      "Mantén los cuidados generales del recién nacido en casa.",
      "Observa la alimentación, temperatura, respiración y coloración de la piel.",
      "Consulta el contenido educativo para reforzar las pautas de cuidado.",
      "Realiza una nueva evaluación si aparece algún cambio o señal de alarma.",
    ],
    followTitle: "Educación recomendada",
    followText:
      "Revisa las guías educativas sobre cuidados básicos del recién nacido, lactancia, temperatura, ictericia y signos de alarma.",
    followButton: "Consultar contenido educativo",
  },
  medio: {
    title: "RIESGO MEDIO",
    label: "Medio",
    className: "medium",
    icon: "!",
    actionTitle: "Atención recomendada",
    description:
      "Se recomienda vigilancia cercana y seguimiento del estado del recién nacido. Repite la evaluación en 24 horas o activa el seguimiento diario. Si las señales persisten, aumentan o aparece un signo de alarma, acude al centro de salud más cercano.",
    summary:
      "Se identificaron signos de riesgo moderado que requieren observación y seguimiento cercano. El resultado no indica una emergencia inmediata, pero sí recomienda consultar a un profesional de salud si las señales continúan o aumentan.",
    steps: [
      "Observa la alimentación, temperatura, respiración y coloración de la piel del bebé.",
      "Activa el seguimiento diario para registrar su evolución.",
      "Acude a consulta médica en menos de 24 horas si las señales persisten.",
      "Busca atención inmediata si aparece dificultad respiratoria, convulsiones, coloración azulada, fiebre alta, hipotermia o rechazo total del alimento.",
    ],
    followTitle: "Seguimiento recomendado",
    followText:
      "Próxima evaluación sugerida en 24 horas. Activa el seguimiento diario durante 5 días para registrar la evolución del recién nacido y recibir orientación según los cambios observados.",
    followButton: "Activar seguimiento",
  },
  alto: {
    title: "RIESGO ALTO",
    label: "Alto",
    className: "high",
    icon: "!",
    actionTitle: "Atención inmediata",
    description:
      "Se identificaron signos de alarma grave. NeoCare no reemplaza la atención médica profesional. Acude de inmediato al centro de salud más cercano o comunícate con el servicio de emergencia correspondiente.",
    summary:
      "El resultado indica alto riesgo neonatal. La presencia de signos graves requiere atención médica inmediata. No se recomienda esperar una nueva evaluación ni usar el seguimiento diario como acción principal.",
    steps: [
      "Acude de inmediato al centro de salud más cercano.",
      "No esperes a que los síntomas desaparezcan por sí solos.",
      "No uses este resultado como sustituto de una valoración médica profesional.",
      "Si hay dificultad respiratoria, convulsiones, coloración azulada, fiebre alta, hipotermia o rechazo total del alimento, busca ayuda urgente.",
    ],
    followTitle: "Atención prioritaria",
    followText:
      "El seguimiento diario no sustituye la atención médica inmediata. En este nivel de riesgo, la acción principal es acudir al centro de salud más cercano.",
    followButton: "Buscar atención inmediata",
  },
};

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const usuario = location.state?.user || null;

  const selectedSignIds =
    location.state?.selectedSigns && location.state.selectedSigns.length > 0
      ? location.state.selectedSigns
      : fallbackSelectedSigns;

  const selectedSigns = selectedSignIds
    .map((id) => riskSignsCatalog[id])
    .filter(Boolean);

  const totalScore = selectedSigns.reduce((sum, sign) => sum + sign.points, 0);
  const riskLevel = getRiskLevel(totalScore, selectedSigns);
  const risk = riskContent[riskLevel];

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
                <span>▣</span>
                <div>
                  <p>Puntaje obtenido</p>
                  <strong>{totalScore} / 10</strong>
                </div>
              </div>

              <div className="result-stat-item">
                <span>◴</span>
                <div>
                  <p>Clasificación</p>
                  <strong>{risk.label}</strong>
                </div>
              </div>

              <div className="result-stat-item">
                <span>▦</span>
                <div>
                  <p>Fecha de evaluación</p>
                  <strong>{getTodayLabel()}</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="result-card result-summary-card">
            <div className="result-card-icon green">▤</div>

            <div>
              <h2>Resumen de la evaluación</h2>
              <p>{risk.summary}</p>

              <h3>Signos identificados:</h3>

              <div className="result-chip-list">
                {selectedSigns.length > 0 ? (
                  selectedSigns.map((sign) => (
                    <span
                      key={sign.label}
                      className={`result-chip ${riskLevel}`}
                    >
                      • {sign.label}
                    </span>
                  ))
                ) : (
                  <span className={`result-chip ${riskLevel}`}>
                    • Sin signos de alarma registrados
                  </span>
                )}
              </div>
            </div>
          </section>

          <section className="result-card result-action-card">
            <div className="result-action-text">
              <div className="result-action-heading">
                <div className="result-card-icon yellow">▣</div>
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
              <div className="result-card-icon follow">▦</div>

              <div>
                <h2>{risk.followTitle}</h2>
                <p>{risk.followText}</p>
              </div>
            </div>

            <button
              type="button"
              className="result-follow-button"
              onClick={handleFollowAction}
            >
              <span>▦</span>
              {risk.followButton}
            </button>
          </section>

          <section className="result-remember-card">
            <div className="result-remember-icon">✓</div>

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
                <span>↻</span>
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
                <span>▱</span>
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
                <span>◷</span>
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