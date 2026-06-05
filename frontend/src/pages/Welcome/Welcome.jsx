import React from "react";
import "./Welcome.css";

import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import mbImage from "../../assets/MB.png";
import signosAImage from "../../assets/SignosA.png";
import orientacionImage from "../../assets/orientacion.png";
import acompanamientoImage from "../../assets/acompañamiento.png";

const Welcome = () => {
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

          <section className="features-card image-features-card">
            <article className="feature-image-item">
              <img
                src={signosAImage}
                alt="Identifica signos de alarma"
                className="feature-image"
              />
            </article>

            <div className="divider"></div>

            <article className="feature-image-item">
              <img
                src={orientacionImage}
                alt="Recibe orientación confiable"
                className="feature-image"
              />
            </article>

            <div className="divider"></div>

            <article className="feature-image-item">
              <img
                src={acompanamientoImage}
                alt="Acompañamiento para mamá"
                className="feature-image"
              />
            </article>
          </section>
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default Welcome;