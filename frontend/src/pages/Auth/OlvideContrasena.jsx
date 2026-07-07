import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { solicitarResetPassword } from "../../services/api.js";

const OlvideContrasena = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setMsg("");
    try {
      const data = await solicitarResetPassword(email);
      setMsg(data.mensaje);
      if (data.tokenDev) {
        navigate(`/restablecer-contrasena?token=${data.tokenDev}`);
      }
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page-wrapper">
      <Header />
      <section className="login-page">
        <section className="login-card">
          <h1>Recuperar contraseña</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              Correo electrónico
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            {err && <p className="login-error-message">{err}</p>}
            {msg && <p style={{ color: "green" }}>{msg}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>
          <button type="button" onClick={() => navigate("/login")}>
            Volver al login
          </button>
        </section>
      </section>
      <Footer />
    </main>
  );
};

export default OlvideContrasena;
