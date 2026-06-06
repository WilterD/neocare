import React from "react";
import { useNavigate } from "react-router-dom";
import "./Services.css";

import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import mbImage from "../../assets/SV.png";

import rpImage from "../../assets/RP.png";
import arImage from "../../assets/AR.png";
import signosAImage from "../../assets/SA.png";
import ocImage from "../../assets/OC.png";
import ceImage from "../../assets/CE.png";
import edadBImage from "../../assets/EdadB.png";
import alertasImage from "../../assets/SSA.png";
import apmImage from "../../assets/APM.png";

const services = [
  {
    image: rpImage,
    title: "Registro por pasos",
    description:
      "Completa los datos de la madre/cuidadora, recién nacido y condiciones de cuidado.",
  },
  {
    image: arImage,
    title: "Evaluación de riesgo",
    description:
      "Clasifica el riesgo materno-neonatal como bajo, medio o alto.",
  },
  {
    image: signosAImage,
    title: "Signos de alarma",
    description:
      "Identifica fiebre, hipotermia, dificultad respiratoria, ictericia o rechazo alimentario.",
  },
  {
    image: ocImage,
    title: "Orientación confiable",
    description:
      "Recibe recomendaciones claras sin sustituir la atención médica profesional.",
  },
  {
    image: ceImage,
    title: "Contenido educativo",
    description:
      "Aprende sobre lactancia, higiene, temperatura, sepsis, ictericia e hipotermia.",
  },
  {
    image: edadBImage,
    title: "Historial de evaluaciones",
    description:
      "Consulta evaluaciones anteriores y observa cambios en el seguimiento.",
  },
  {
    image: alertasImage,
    title: "Alertas visuales",
    description:
      "Usa colores para comprender rápidamente el nivel de riesgo.",
  },
  {
    image: apmImage,
    title: "Acompañamiento para mamá",
    description:
      "Apoyo cercano para reducir dudas durante los primeros 28 días del bebé.",
  },
];

const Services = () => {
  const navigate = useNavigate();

  const handleStartEvaluation = () => {
    navigate("/registro");
  };

  const handleEducationalContent = () => {
    console.log("Ir a contenido educativo");
  };

  return (
    <main className="services-page-wrapper">
      <Header />

      <section className="services-page">
        <section className="services-hero">
          <div className="services-hero-text">
            <h1>
              Servicios de <span>NeoCare</span>
            </h1>

            <p>
              Orientación digital para acompañar a madres y cuidadoras durante el
              seguimiento neonatal en casa.
            </p>

            <div className="services-hero-actions">
              <button
                type="button"
                className="services-primary-btn"
                onClick={handleStartEvaluation}
              >
                <span>♡</span>
                Comenzar evaluación
              </button>

              <button
                type="button"
                className="services-secondary-btn"
                onClick={handleEducationalContent}
              >
                <span>▤</span>
                Ver contenido educativo
              </button>
            </div>

            <div className="services-safe-note">
              <span>▣</span>
              Información segura, confiable y basada en evidencia.
            </div>
          </div>

          <div className="services-hero-image-area">
            <div className="hero-soft-shape"></div>

            <img
              src={mbImage}
              alt="Madre sosteniendo a su bebé"
              className="services-hero-image"
            />

            <span className="hero-floating-heart heart-a">♡</span>
            <span className="hero-floating-heart heart-b">♥</span>
            <span className="hero-floating-dot dot-a"></span>
            <span className="hero-floating-dot dot-b"></span>
          </div>
        </section>

        <section className="services-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <div className="service-image-box">
                <img
                  src={service.image}
                  alt={service.title}
                  className="service-card-image"
                />
              </div>

              <div className="service-card-text">
                <h2>{service.title}</h2>
                <p>{service.description}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="services-trust-bar">
          <article>
            <span>▣</span>
            <div>
              <h3>Tus datos están protegidos</h3>
              <p>Confidencialidad y seguridad garantizadas.</p>
            </div>
          </article>

          <article>
            <span>◇</span>
            <div>
              <h3>Información basada en evidencia</h3>
              <p>Contenido validado para apoyar el cuidado neonatal.</p>
            </div>
          </article>

          <article>
            <span>♡</span>
            <div>
              <h3>Hecho con amor para cuidar</h3>
              <p>Tu tranquilidad y la de tu bebé son importantes.</p>
            </div>
          </article>
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default Services;