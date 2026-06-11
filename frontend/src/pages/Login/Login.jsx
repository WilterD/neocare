import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Login.css";

import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import googleImage from "../../assets/Google.png";
import { login, googleAuthUrl } from "../../services/api.js";
import { persistSession } from "../../utils/mapRegistroPayload.js";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("error") === "oauth") {
      setLoginError("No se pudo iniciar sesión con Google. Verifica la configuración OAuth del servidor.");
    }
  }, [searchParams]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setLoginError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setLoginError("");

    try {
      const data = await login(formData.email.trim(), formData.password);

      persistSession({
        token: data.token,
        usuario: data.usuario,
        registro: data.registro,
      });
      if (!formData.remember) {
        sessionStorage.setItem("token", data.token);
        localStorage.removeItem("token");
      }

      navigate("/inicio", {
        state: {
          user: data.usuario,
          registro: data.registro,
        },
      });
    } catch (err) {
      setLoginError(err.message || "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
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
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) => setFormData((p) => ({ ...p, remember: e.target.checked }))}
                />
                Recordarme
              </label>

              <button type="button" className="login-forgot-button" onClick={() => navigate("/olvide-contrasena")}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button type="submit" className="login-submit-button" disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar sesión"}
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
              <button
                type="button"
                className="login-social-button"
                onClick={() => { window.location.href = googleAuthUrl(); }}
              >
                <img src={googleImage} alt="Google" className="login-social-icon google-social-icon" />
                Google
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
