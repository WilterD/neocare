import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { restablecerPassword } from "../../services/api.js";

const RestablecerContrasena = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [token, setToken] = useState(params.get("token") || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setErr("Las contraseñas no coinciden.");
      return;
    }
    try {
      const data = await restablecerPassword(token, password);
      setMsg(data.mensaje);
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <main className="login-page-wrapper">
      <Header />
      <section className="login-page">
        <section className="login-card">
          <h1>Nueva contraseña</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              Token
              <input value={token} onChange={(e) => setToken(e.target.value)} required />
            </label>
            <label>
              Nueva contraseña
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <label>
              Confirmar
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </label>
            {err && <p className="login-error-message">{err}</p>}
            {msg && <p style={{ color: "green" }}>{msg}</p>}
            <button type="submit">Guardar</button>
          </form>
        </section>
      </section>
      <Footer />
    </main>
  );
};

export default RestablecerContrasena;
