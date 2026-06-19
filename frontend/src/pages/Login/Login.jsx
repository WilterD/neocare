import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import googleImage from "../../assets/Google.png";
import faceImage from "../../assets/Face.png";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setLoginError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const storedUser = localStorage.getItem("neocareUser");
    const storedRegisterData = localStorage.getItem("neocareRegisterData");

    if (!storedUser) {
      setLoginError(
        "No se encontró un usuario registrado. Primero debes completar el registro."
      );
      return;
    }

    const usuario = JSON.parse(storedUser);
    const registro = storedRegisterData ? JSON.parse(storedRegisterData) : usuario;

    const correoRegistrado =
      usuario?.correo ||
      usuario?.datosPersonales?.correo ||
      registro?.correo ||
      registro?.datosPersonales?.correo ||
      "";

    if (
      correoRegistrado.trim().toLowerCase() !==
      formData.email.trim().toLowerCase()
    ) {
      setLoginError("El correo ingresado no coincide con un usuario registrado.");
      return;
    }

    localStorage.setItem("neocareUser", JSON.stringify(usuario));
    localStorage.setItem("neocareRegisterData", JSON.stringify(registro));

    navigate("/educacion", {
      state: {
        user: usuario,
        registro,
      },
    });
  };

  return (
    <main className="login-page-wrapper">
      <Header />

      <section className="login-page">
        <section className="login-card">
          <div className="login-card-header">
            <h1>Iniciar sesión</h1>
            <p>
              Accede a NeoCare para continuar con el seguimiento neonatal de tu
              bebé.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Ej. correo@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Ingresa tu contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {loginError && <p className="login-error-message">{loginError}</p>}

            <div className="login-options">
              <label className="login-remember">
                <input type="checkbox" />
                Recordarme
              </label>

              <button type="button" className="login-forgot-button">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button type="submit" className="login-submit-button">
              Iniciar sesión
            </button>
          </form>

          <div className="login-register-text">
            <p>
              ¿Aún no tienes una cuenta?{" "}
              <button type="button" onClick={() => navigate("/registro")}>
                Regístrate
              </button>
            </p>
          </div>

          <div className="login-social-section">
            <div className="login-divider">
              <span></span>
              <p>o continúa con</p>
              <span></span>
            </div>

            <div className="login-social-buttons">
              <button type="button" className="login-social-button">
                <img
                  src={googleImage}
                  alt="Google"
                  className="login-social-icon google-social-icon"
                />
                Google
              </button>

              <button type="button" className="login-social-button">
                <img
                  src={faceImage}
                  alt="Facebook"
                  className="login-social-icon face-social-icon"
                />
                Facebook
              </button>
            </div>
          </div>
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default Login;