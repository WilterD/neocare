import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { forgotPassword } from "../../services/api.js";

const OlvideContrasena = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await forgotPassword(email);
      setMsg(res.mensaje + (res.devLink ? ` Enlace dev: ${res.devLink}` : ""));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Header />
      <section style={{ maxWidth: 420, margin: "2rem auto", padding: "1.5rem" }}>
        <h1>Recuperar contraseña</h1>
        <form onSubmit={handleSubmit}>
          <label>Correo electrónico<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <button type="submit" disabled={loading}>{loading ? "Enviando..." : "Enviar enlace"}</button>
        </form>
        {msg && <p style={{ color: "green" }}>{msg}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p><Link to="/login">Volver al login</Link></p>
      </section>
      <Footer />
    </main>
  );
};

export default OlvideContrasena;
