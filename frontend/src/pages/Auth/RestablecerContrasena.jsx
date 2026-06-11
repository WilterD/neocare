import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { resetPassword } from "../../services/api.js";

const RestablecerContrasena = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPassword(token, password);
      setMsg(res.mensaje);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!token) return <p>Token inválido. <Link to="/olvide-contrasena">Solicitar nuevo enlace</Link></p>;

  return (
    <main>
      <Header />
      <section style={{ maxWidth: 420, margin: "2rem auto", padding: "1.5rem" }}>
        <h1>Nueva contraseña</h1>
        <form onSubmit={handleSubmit}>
          <label>Nueva contraseña<input type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          <button type="submit">Guardar</button>
        </form>
        {msg && <p style={{ color: "green" }}>{msg}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </section>
      <Footer />
    </main>
  );
};

export default RestablecerContrasena;
