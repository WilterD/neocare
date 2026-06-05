import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

import mbImage from "../../assets/MB.png";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();
    console.log("Iniciar sesión");
  };

  const handleGoRegister = () => {
    navigate("/registro");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <main className="login-page">
      <section className="login-container">
        <section className="login-card">
          <button
            type="button"
            className="login-back-button"
            onClick={handleGoHome}
            aria-label="Volver a la pantalla de inicio"
          >
            ←
          </button>

          <div className="login-card-content">
            <header className="login-header">
              <h1>¡Bienvenida a NeoCare!</h1>
              <p>
                Inicia sesión para continuar el seguimiento neonatal de tu bebé.
              </p>
            </header>

            <form className="login-form" onSubmit={handleLogin}>
              <label className="login-label">
                Correo electrónico
                <div className="login-input-box">
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    autoComplete="email"
                  />
                </div>
              </label>

              <label className="login-label">
                Contraseña
                <div className="login-input-box password-box">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contraseña"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="eye-button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Mostrar u ocultar contraseña"
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </label>

              <div className="login-options">
                <label className="remember-option">
                  <input type="checkbox" />
                  <span>Recordarme</span>
                </label>

                <button type="button" className="forgot-link">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <button type="submit" className="login-main-button">
                Iniciar sesión
              </button>

              <p className="register-text">
                ¿No tienes cuenta?{" "}
                <button type="button" onClick={handleGoRegister}>
                  Regístrate aquí
                </button>
              </p>
            </form>
          </div>
        </section>

        <section className="login-info-panel">
          <div className="login-info-content">
            <div className="login-illustration-card">
              <img
                src={mbImage}
                alt="Madre sosteniendo a su bebé"
                className="login-mother-image"
              />
            </div>

            <div className="login-info-text">
              <h2>Acompañamiento neonatal desde casa</h2>

              <p>
                Recibe orientación confiable para identificar signos de alarma y
                cuidar a tu bebé durante sus primeros días de vida.
              </p>

              <ul className="benefits-list">
                <li>
                  <span>✓</span>
                  Identificación de signos de alarma
                </li>

                <li>
                  <span>✓</span>
                  Seguimiento del recién nacido
                </li>

                <li>
                  <span>✓</span>
                  Orientación para madres y cuidadoras
                </li>

                <li>
                  <span>✓</span>
                  Historial de evaluaciones
                </li>
              </ul>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Login;