import React from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";

import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import mbImage from "../../assets/MB.png";

const Welcome = () => {
  const navigate = useNavigate();

  const handleStartRegister = () => {
    navigate("/registro");
  };

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <main className="welcome-page-wrapper">
      <Header />

      <section className="welcome-page">
        <section className="phone-screen">
          <div className="decor cloud cloud-left"></div>
          <div className="decor cloud cloud-right"></div>

          <span className="heart heart-one">♥</span>
          <span className="heart heart-two">♥</span>
          <span className="heart heart-three">♥</span>
          <span className="heart heart-four">♥</span>

          <header className="welcome-header">
            <h1>NeoCare</h1>

            <p>
              Tu apoyo en cada etapa
              <br />
              del cuidado neonatal.
            </p>

            <div className="small-heart">♥</div>
          </header>

          <section className="hero-section">
            <img
              src={mbImage}
              alt="Madre sosteniendo a su bebé recién nacido"
              className="welcome-mb-image"
            />
          </section>

          <section className="features-card">
            <article className="feature-item">
              <div className="feature-icon green-icon">♡</div>
              <p>Identifica signos de alarma</p>
            </article>

            <div className="divider"></div>

            <article className="feature-item">
              <div className="feature-icon yellow-icon">▭</div>
              <p>Recibe orientación confiable</p>
            </article>

            <div className="divider"></div>

            <article className="feature-item">
              <div className="feature-icon purple-icon">♧</div>
              <p>Acompañamiento para mamá</p>
            </article>
          </section>

          <button
            type="button"
            className="primary-button"
            onClick={handleStartRegister}
          >
            <span className="button-icon">▣</span>
            Iniciar registro
            <span className="arrow">→</span>
          </button>

          <p className="login-text">
            ¿Ya tienes una cuenta?{" "}
            <button type="button" onClick={handleLogin}>
              Iniciar sesión
            </button>
          </p>
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default Welcome;