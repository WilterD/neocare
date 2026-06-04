import React from "react";
import "./Welcome.css";

const Welcome = () => {
  const handleStartRegister = () => {
    console.log("Ir a pantalla de registro");
    // Luego aquí navegamos a /registro
  };

  const handleLogin = () => {
    console.log("Ir a iniciar sesión");
    // Luego aquí navegamos a /login
  };

  return (
    <main className="welcome-page">
      <section className="phone-screen">
        <div className="status-bar">
          <span>9:41</span>
          <div className="status-icons">
            <span>▮▮▮</span>
            <span>⌁</span>
            <span className="battery"></span>
          </div>
        </div>

        <div className="decor cloud cloud-left"></div>
        <div className="decor cloud cloud-right"></div>
        <span className="heart heart-one">♥</span>
        <span className="heart heart-two">♥</span>
        <span className="heart heart-three">♥</span>
        <span className="heart heart-four">♥</span>

        <header className="welcome-header">
          <div className="brand-icon">
            <div className="person person-green"></div>
            <div className="person person-pink"></div>
            <span className="mini-heart">♥</span>
          </div>

          <h1>
            <span>Neo</span>Care
          </h1>

          <p>
            Tu apoyo en cada etapa
            <br />
            del cuidado neonatal.
          </p>

          <div className="small-heart">♥</div>
        </header>

        <section className="hero-section">
          <div className="soft-heart-bg"></div>

          <div className="mom-baby-illustration">
            <div className="hair"></div>
            <div className="face mom-face"></div>
            <div className="body mom-body"></div>

            <div className="baby-wrap"></div>
            <div className="baby-face"></div>
            <div className="baby-hat"></div>
          </div>

          <div className="leaf leaf-left"></div>
          <div className="leaf leaf-right"></div>
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

        <button className="primary-button" onClick={handleStartRegister}>
          <span className="button-icon">▣</span>
          Iniciar registro
          <span className="arrow">→</span>
        </button>

        <p className="login-text">
          ¿Ya tienes una cuenta?{" "}
          <button onClick={handleLogin}>Iniciar sesión</button>
        </p>

        <div className="bottom-decoration">
          <div className="hill hill-one"></div>
          <div className="hill hill-two"></div>
          <div className="bottom-leaf left"></div>
          <div className="bottom-leaf right"></div>
        </div>

        <div className="home-indicator"></div>
      </section>
    </main>
  );
};

export default Welcome;