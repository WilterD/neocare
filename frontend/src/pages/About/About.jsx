import React from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";

import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import aboutHeroImage from "../../assets/MADRE.png";
import whatImage from "../../assets/QUES.png";
import whyImage from "../../assets/PQSURGE.png";
import comenzarEImage from "../../assets/ComenzarE.png";

import shieldIcon from "../../assets/ORI.png";
import handsIcon from "../../assets/CORA.png";
import bellIcon from "../../assets/PRE.png";
import lockIcon from "../../assets/CONF.png";
import leafIcon from "../../assets/CALI.png";

const guideItems = [
  {
    icon: shieldIcon,
    title: "Orientación confiable",
    text: "Información clara para apoyar el cuidado neonatal en casa.",
  },
  {
    icon: handsIcon,
    title: "Acompañamiento",
    text: "Apoyo cercano para madres primerizas y cuidadoras.",
  },
  {
    icon: bellIcon,
    title: "Prevención",
    text: "Identificación temprana de posibles signos de alarma.",
  },
  {
    icon: lockIcon,
    title: "Confidencialidad",
    text: "Protección de los datos personales y de salud registrados.",
  },
  {
    icon: leafIcon,
    title: "Calidez",
    text: "Una experiencia visual sencilla, humana y alejada del entorno hospitalario.",
  },
];

const teamMembers = [
  {
    name: "Díaz, Wilter",
    role: "Investigación y desarrollo",
  },
  {
    name: "García, Elimar",
    role: "Diseño y documentación",
  },
  {
    name: "Lara, Andrés",
    role: "Backend y base de datos",
  },
  {
    name: "Montaño, Vicente",
    role: "Frontend y producto",
  },
];

const About = () => {
  const navigate = useNavigate();

  const handleStartEvaluation = () => {
    navigate("/registro");
  };

  return (
    <main className="about-page-wrapper">
      <Header />

      <section className="about-page">
        <section className="about-hero-section">
          <article className="about-hero-text">
            <p className="about-eyebrow">SALUD DIGITAL · NEOCARE</p>

            <h1>
              Un proyecto creado para acompañar el cuidado neonatal en casa
            </h1>

            <p>
              NeoCare es una plataforma digital orientada a madres primerizas y
              cuidadoras de recién nacidos de 0 a 28 días. Su propósito es
              brindar orientación inicial, organizar información importante del
              bebé y apoyar la identificación temprana de signos de alarma
              durante el seguimiento domiciliario.
            </p>
          </article>

          <div className="about-hero-image-box">
            <img
              src={aboutHeroImage}
              alt="Madre alzando a su bebé recién nacido"
              className="about-hero-image"
            />
          </div>
        </section>

        <section className="about-info-grid">
          <article className="about-info-card">
            <div className="about-card-icon green">
              <img src={whatImage} alt="Qué es NeoCare" />
            </div>

            <div>
              <h2>¿Qué es NeoCare?</h2>

              <p>
                NeoCare es una herramienta de apoyo al cuidado neonatal
                domiciliario. Permite registrar información relevante de la madre
                o cuidadora, del recién nacido y de sus antecedentes clínicos
                para orientar el nivel de seguimiento requerido.
              </p>

              <p>
                La plataforma no emite diagnósticos médicos ni sustituye la
                atención profesional. Su función es acompañar, informar y apoyar
                una toma de decisiones más oportuna ante posibles señales de
                riesgo.
              </p>
            </div>
          </article>

          <article className="about-info-card">
            <div className="about-card-icon coral">
              <img src={whyImage} alt="Por qué surge el proyecto" />
            </div>

            <div>
              <h2>¿Por qué surge este proyecto?</h2>

              <p>
                Durante los primeros 28 días de vida, el recién nacido atraviesa
                una etapa de alta vulnerabilidad. En este periodo pueden
                presentarse señales como fiebre, hipotermia, ictericia,
                dificultad respiratoria, rechazo alimentario o somnolencia
                excesiva.
              </p>

              <p>
                NeoCare surge ante la necesidad de ofrecer una guía clara y
                accesible para madres primerizas o cuidadoras que no siempre
                cuentan con experiencia previa, información confiable o
                acompañamiento continuo en el hogar.
              </p>
            </div>
          </article>
        </section>

        <section className="about-guide-section">
          <h2>Lo que nos guía</h2>

          <div className="about-guide-card">
            {guideItems.map((item) => (
              <article className="about-guide-item" key={item.title}>
                <img src={item.icon} alt={item.title} />

                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-team-section">
          <article className="about-team-content">
            <h2>Equipo del proyecto</h2>

            <p>
              NeoCare fue desarrollado como proyecto académico de Salud Digital
              por estudiantes de Ingeniería Informática de la Universidad
              Católica Andrés Bello, Extensión Guayana, en la cátedra
              Investigación de Operaciones.
            </p>

            <div className="about-team-list">
              {teamMembers.map((member) => (
                <div className="about-team-member" key={member.name}>
                  <span className="about-team-user-icon"></span>

                  <div>
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>
                  </div>
                </div>
              ))}

              <div className="about-team-member professor">
                <span className="about-team-user-icon professor-icon"></span>

                <div>
                  <h3>
                    Profesora: <span>Medina, Luz</span>
                  </h3>
                </div>
              </div>
            </div>
          </article>
        </section>

        <section className="about-cta-section">
          <div className="about-cta-content">
            <h2>Comienza tu acompañamiento</h2>

            <p>
              Cada duda durante los primeros días del recién nacido es
              importante. Da el primer paso para llevar un seguimiento más claro
              del cuidado neonatal, registrar la información necesaria y recibir
              una orientación.
            </p>

            <button
              type="button"
              className="about-cta-button"
              onClick={handleStartEvaluation}
            >
              <span className="about-cta-icon-box">
                <img
                  src={comenzarEImage}
                  alt="Iniciar evaluación"
                  className="about-cta-button-icon"
                />
              </span>

              <span className="about-cta-button-label">
                Iniciar evaluación
              </span>

              <strong>→</strong>
            </button>
          </div>
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default About;