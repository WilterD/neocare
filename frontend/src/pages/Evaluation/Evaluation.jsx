import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Evaluation.css";

import Header from "../../components/Header/Header.jsx";
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

const summaryData = [
  {
    image: amImage,
    label: "Madre o cuidadora",
    value: "María Fernanda López",
  },
  {
    image: edadImage,
    label: "Edad",
    value: "24 años",
  },
  {
    image: residenciaImage,
    label: "Residencia",
    value: "Quito, Pichincha",
  },
  {
    image: erImage,
    label: "Apoyo familiar",
    value: "Sí",
    pill: true,
  },
  {
    image: ocImage,
    label: "Acceso a servicios de salud",
    value: "Centro de salud público",
  },
  {
    image: datosBebeImage,
    label: "Recién nacido",
    value: "Niño",
  },
  {
    image: heImage,
    label: "Edad del bebé",
    value: "12 días",
  },
  {
    image: avImage,
    label: "Peso al nacer",
    value: "3.100 kg",
  },
  {
    image: saImage,
    label: "Antecedentes relevantes",
    value: "Ninguno",
  },
];

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

const Evaluation = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/registro");
  };

  const handleRunEvaluation = () => {
    console.log("Realizar evaluación");
    // Cuando creemos la pantalla de resultado, se conecta aquí:
    // navigate("/resultado");
  };

  return (
    <main className="evaluation-page-wrapper">
      <Header />

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