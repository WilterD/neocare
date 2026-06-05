import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Evaluation.css";

import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import mbImage from "../../assets/MB.png";

import amImage from "../../assets/AM.png";
import heImage from "../../assets/HE.png";
import rImage from "../../assets/RP.png";
import erImage from "../../assets/ER.png";
import ocImage from "../../assets/OC.png";
import rpImage from "../../assets/RP.png";
import avImage from "../../assets/AV.png";
import saImage from "../../assets/SA.png";

const summaryData = [
  {
    image: amImage,
    label: "Madre o cuidadora",
    value: "María Fernanda López",
  },
  {
    image: heImage,
    label: "Edad",
    value: "24 años",
  },
  {
    image: rImage,
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
    image: rpImage,
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
    icon: "⌂",
    label: "Inicio",
    path: "/",
  },
  {
    icon: "♡",
    label: "Evaluación",
    path: "/evaluacion",
  },
  {
    icon: "▤",
    label: "Educación",
    path: "/educacion",
  },
  {
    icon: "↺",
    label: "Historial",
    path: "/historial",
  },
  {
    icon: "♙",
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
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="evaluation-sidebar-image-box">
            <span className="side-heart side-heart-one">♡</span>
            <span className="side-heart side-heart-two">♡</span>

            <img
              src={mbImage}
              alt="Madre sosteniendo a su bebé"
              className="evaluation-sidebar-image"
            />
          </div>
        </aside>

        <section className="evaluation-main-panel">
          <header className="evaluation-title-row">
            <button
              type="button"
              className="evaluation-back-button"
              onClick={handleGoBack}
              aria-label="Volver al registro"
            >
              ←
            </button>

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
            <div className="evaluation-hero-icon">▣</div>

            <div className="evaluation-hero-text">
              <h2>¡Casi terminamos!</h2>
              <p>
                Revisemos la información para evaluar el nivel de riesgo de tu
                bebé y brindarte recomendaciones.
              </p>
            </div>

            <div className="evaluation-hero-illustration">
              <div className="clipboard">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="leaf leaf-one"></div>
              <div className="leaf leaf-two"></div>
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
                <div className="evaluation-next-icon">◇</div>

                <div>
                  <h2>¿Qué sucede ahora?</h2>
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
                <span>▤</span>
                Realizar evaluación
                <strong>→</strong>
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