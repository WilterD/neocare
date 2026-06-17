import React from "react";
import { useNavigate } from "react-router-dom";
import "./EducacionTriaje.css";

import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import SidebarNeoCare from "../../components/SidebarNeoCare/SidebarNeoCare.jsx";

import inicioImage from "../../assets/Inicio.png";
import evaluacionImage from "../../assets/Evaluacion.png";
import educacionImage from "../../assets/Educacion.png";
import historialImage from "../../assets/H.png";
import perfilImage from "../../assets/Perfil.png";

import datosBebeImage from "../../assets/DatosBebe.png";
import qsImage from "../../assets/QS.png";
import saImage from "../../assets/SA.png";
import ramaImage from "../../assets/RAMA.png";
import flechImage from "../../assets/FLECH.png";
import gorroImage from "../../assets/GORRO.png";
import bloqueBlancoImage from "../../assets/BLOQUEBLANCO.png";
import duvidaImage from "../../assets/DUDA.png";
import evaluacionEvaImage from "../../assets/Eva.png";

const SIGNOS_CATALOGO = [
  { id: "convulsiones", label: "Convulsiones", points: 3, category: "alto" },
  { id: "dificultadRespiratoria", label: "Dificultad respiratoria", points: 3, category: "alto" },
  { id: "coloracionAzulada", label: "Coloración azulada de labios o piel", points: 3, category: "alto" },
  { id: "fiebreHipotermia", label: "Fiebre o hipotermia", points: 3, category: "alto" },
  { id: "rechazoAlimentacion", label: "Rechazo completo de la alimentación", points: 3, category: "alto" },
  { id: "disminucionConciencia", label: "Disminución importante del estado de conciencia", points: 3, category: "alto" },
  { id: "vomitosRepetitivos", label: "Vómitos repetitivos", points: 2, category: "medio" },
  { id: "ictericiaProgresiva", label: "Ictericia progresiva", points: 2, category: "medio" },
  { id: "disminucionActividad", label: "Disminución de la actividad habitual", points: 2, category: "medio" },
  { id: "llantoPersistente", label: "Llanto persistente o inconsolable", points: 2, category: "medio" },
  { id: "alteracionesSueno", label: "Alteraciones leves del sueño", points: 1, category: "bajo" },
  { id: "disminucionApetito", label: "Disminución leve del apetito", points: 1, category: "bajo" },
  { id: "irritabilidadOcasional", label: "Irritabilidad ocasional", points: 1, category: "bajo" },
];

const RANGOS = [
  {
    level: "Bajo",
    color: "#6fa04f",
    rango: "0–2 puntos",
    descripcion:
      "No se identifican condiciones importantes de alarma. Mantén los cuidados generales en casa y observa al recién nacido.",
    accion: "Cuidados generales en casa",
  },
  {
    level: "Moderado",
    color: "#e0a64a",
    rango: "3–5 puntos",
    descripcion:
      "Hay señales de riesgo moderado. Activa el seguimiento diario y consulta a un profesional de salud si las señales persisten o aumentan.",
    accion: "Seguimiento reforzado",
  },
  {
    level: "Alto",
    color: "#c64a4a",
    rango: "≥ 6 puntos o cualquier signo de alto riesgo",
    descripcion:
      "Condiciones de alto riesgo. Acude de inmediato al centro de salud más cercano. NeoCare no reemplaza la atención médica profesional.",
    accion: "Atención médica inmediata",
  },
];

const EducacionTriaje = () => {
  const navigate = useNavigate();

  return (
    <main className="edu-triaje-page-wrapper">
      <Header2 />

      <section className="edu-triaje-desktop">
        <SidebarNeoCare className="edu-triaje" activePath="/educacion" />

        <section className="edu-triaje-main-panel">
          <header className="edu-triaje-topbar">
            <button
              type="button"
              className="edu-triaje-back-button"
              onClick={() => navigate("/educacion")}
            >
              <img src={flechImage} alt="Volver" className="flip" />
              Volver a Educación
            </button>
          </header>

          <section className="edu-triaje-hero">
            <div className="edu-triaje-hero-text">
              <span className="edu-triaje-hero-label">Módulo educativo</span>
              <h1>Sistema de triaje neonatal</h1>
              <p>
                NeoCare clasifica la condición del recién nacido en tres
                niveles de riesgo: <strong>verde (bajo)</strong>,{" "}
                <strong>amarillo (moderado)</strong> y{" "}
                <strong>rojo (alto)</strong>. Conoce cómo se calculan y qué
                hacer en cada caso.
              </p>
              <div className="edu-triaje-hero-tags">
                <span className="edu-triaje-tag">Triaje</span>
                <span className="edu-triaje-tag">Signos de alarma</span>
                <span className="edu-triaje-tag">Riesgo neonatal</span>
              </div>
            </div>
            <div className="edu-triaje-hero-image-box">
              <img src={qsImage} alt="Sistema de triaje neonatal" />
            </div>
          </section>

          <section className="edu-triaje-intro-card">
            <h3>¿Cómo funciona el triaje de NeoCare?</h3>
            <p>
              El triaje neonatal es una evaluación rápida y sistemática que
              permite identificar qué bebés necesitan atención inmediata y
              cuáles pueden seguir siendo cuidados en casa. Se basa en la
              observación clínica de <strong>13 signos de alarma</strong>{" "}
              estandarizados según las recomendaciones de la OMS/OPS.
            </p>
            <p>
              Cada signo tiene un puntaje: <strong>3 puntos</strong> para los
              signos de alto riesgo, <strong>2 puntos</strong> para los de
              riesgo medio y <strong>1 punto</strong> para los de riesgo bajo.
              La suma de los puntos determina el nivel final.
            </p>
          </section>

          <section className="edu-triaje-rangos-card">
            <h3>Los tres niveles de riesgo</h3>
            <div className="edu-triaje-rangos-grid">
              {RANGOS.map((r) => (
                <div
                  key={r.level}
                  className="edu-triaje-rango"
                  style={{ borderColor: r.color }}
                >
                  <span
                    className="edu-triaje-rango-pill"
                    style={{ background: r.color }}
                  >
                    {r.level}
                  </span>
                  <strong style={{ color: r.color }}>{r.rango}</strong>
                  <p className="edu-triaje-rango-accion">{r.accion}</p>
                  <p className="edu-triaje-rango-desc">{r.descripcion}</p>
                </div>
              ))}
            </div>
            <p className="edu-triaje-rangos-nota">
              <strong>Regla crítica:</strong> si el bebé presenta{" "}
              <em>cualquier</em> signo de alto riesgo (3 puntos), el resultado
              se clasifica automáticamente como <strong>Alto</strong>,
              independientemente del puntaje acumulado.
            </p>
          </section>

          <section className="edu-triaje-signos-card">
            <div className="edu-triaje-section-title">
              <img src={saImage} alt="Signos" />
              <h3>Catálogo de signos evaluados</h3>
            </div>
            <p className="edu-triaje-subtitle">
              Estos son los 13 signos que NeoCare considera al evaluar al
              recién nacido. Aprende a reconocerlos.
            </p>
            <div className="edu-triaje-signos-grid">
              {SIGNOS_CATALOGO.map((s) => (
                <div
                  key={s.id}
                  className={`edu-triaje-signo-card ${s.category}`}
                >
                  <div className="edu-triaje-signo-puntos">
                    {s.points} pt{s.points > 1 ? "s" : ""}
                  </div>
                  <div className="edu-triaje-signo-label">{s.label}</div>
                  <div className={`edu-triaje-signo-cat ${s.category}`}>
                    {s.category === "alto"
                      ? "Riesgo alto"
                      : s.category === "medio"
                      ? "Riesgo medio"
                      : "Riesgo bajo"}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="edu-triaje-quehacer-card">
            <div className="edu-triaje-section-title">
              <img src={gorroImage} alt="Qué hacer" />
              <h3>¿Qué hacer según el resultado?</h3>
            </div>
            <div className="edu-triaje-quehacer-grid">
              <article className="edu-triaje-quehacer bajo">
                <header>
                  <span className="dot" style={{ background: "#6fa04f" }} />
                  <h4>Riesgo bajo</h4>
                </header>
                <ul>
                  <li>Mantén los cuidados generales del recién nacido.</li>
                  <li>
                    Observa alimentación, temperatura, respiración y
                    coloración de la piel.
                  </li>
                  <li>
                    Consulta el contenido educativo para reforzar las pautas
                    de cuidado.
                  </li>
                  <li>
                    Realiza una nueva evaluación si aparece algún cambio o
                    señal de alarma.
                  </li>
                </ul>
              </article>

              <article className="edu-triaje-quehacer moderado">
                <header>
                  <span className="dot" style={{ background: "#e0a64a" }} />
                  <h4>Riesgo medio</h4>
                </header>
                <ul>
                  <li>
                    Activa el seguimiento diario para registrar la evolución
                    del bebé.
                  </li>
                  <li>
                    Consulta a un profesional de salud en menos de 24 horas
                    si las señales persisten.
                  </li>
                  <li>
                    Observa de cerca: alimentación, temperatura, respiración
                    y color de la piel.
                  </li>
                  <li>
                    Busca atención inmediata si aparece cualquier signo de
                    alto riesgo.
                  </li>
                </ul>
              </article>

              <article className="edu-triaje-quehacer alto">
                <header>
                  <span className="dot" style={{ background: "#c64a4a" }} />
                  <h4>Riesgo alto</h4>
                </header>
                <ul>
                  <li>Acude de inmediato al centro de salud más cercano.</li>
                  <li>
                    No esperes a que los síntomas desaparezcan por sí solos.
                  </li>
                  <li>
                    No uses este resultado como sustituto de una valoración
                    médica profesional.
                  </li>
                  <li>
                    Prioridad máxima: dificultad respiratoria, convulsiones,
                    color azul, fiebre/hipotermia o rechazo alimentario.
                  </li>
                </ul>
              </article>
            </div>
          </section>

          <section className="edu-triaje-recordatorio-card">
            <img src={duvidaImage} alt="Recordatorio" />
            <div>
              <h3>Importante</h3>
              <p>
                NeoCare es una herramienta de <strong>orientación</strong>{" "}
                basada en señales observables. No sustituye el criterio
                clínico profesional. Si tienes dudas, siempre es mejor
                consultar con un profesional de salud.
              </p>
              <button
                type="button"
                className="edu-triaje-recordatorio-button"
                onClick={() => navigate("/evaluacion")}
              >
                Realizar una evaluación
                <span>›</span>
              </button>
            </div>
          </section>
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default EducacionTriaje;
