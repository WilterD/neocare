import React, { useState } from "react";
import "./Contact.css";

import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { enviarContacto } from "../../services/api.js";

const ASUNTO_LABELS = {
  registro: "Duda sobre el registro",
  login: "Problema para iniciar sesión",
  riesgo: "Consulta sobre evaluación de riesgo",
  contenido: "Consulta sobre contenido educativo",
  proyecto: "Información sobre el proyecto",
  otro: "Otro",
};

const Contact = () => {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setEnviando(true);
    setExito(null);
    setError(null);

    try {
      const asuntoTexto = ASUNTO_LABELS[form.asunto] || form.asunto;
      const res = await enviarContacto({
        nombre: form.nombre,
        correo: form.correo,
        telefono: form.telefono,
        asunto: asuntoTexto,
        mensaje: form.mensaje,
      });
      setExito(res.mensaje);
      setForm({ nombre: "", correo: "", telefono: "", asunto: "", mensaje: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="contact-page-wrapper">
      <Header />

      <section className="contact-page">
        <section className="contact-hero">
          <p className="contact-eyebrow">SALUD DIGITAL · CONTACTO</p>

          <h1>¿Tienes alguna pregunta?</h1>

          <div className="contact-heart">♥</div>

          <p className="contact-subtitle">
            Estamos aquí para ayudarte con dudas sobre NeoCare, el registro, el
            acceso a la plataforma y el uso del contenido educativo.
          </p>

          <p className="contact-note">
            NeoCare brinda orientación inicial para el seguimiento neonatal en
            casa, pero no reemplaza la atención médica profesional.
          </p>
        </section>

        <section className="contact-main-grid">
          <article className="contact-card contact-form-card">
            <h2>Envíanos un mensaje</h2>

            <p className="contact-card-subtitle">
              Completa el formulario y nos pondremos en contacto contigo.
            </p>

            {exito && <p className="contact-success">{exito}</p>}
            {error && <p className="contact-error">{error}</p>}

            <form className="contact-form" onSubmit={handleSubmit}>
              <label>
                Nombre completo <span>*</span>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  required
                />
              </label>

              <label>
                Correo electrónico <span>*</span>
                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  required
                />
              </label>

              <label>
                Teléfono <small>(opcional)</small>
                <input
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="+58 412 1234567"
                />
              </label>

              <label>
                Asunto <span>*</span>
                <select name="asunto" value={form.asunto} onChange={handleChange} required>
                  <option value="" disabled>
                    Selecciona un asunto
                  </option>
                  <option value="registro">Duda sobre el registro</option>
                  <option value="login">Problema para iniciar sesión</option>
                  <option value="riesgo">Consulta sobre evaluación de riesgo</option>
                  <option value="contenido">Consulta sobre contenido educativo</option>
                  <option value="proyecto">Información sobre el proyecto</option>
                  <option value="otro">Otro</option>
                </select>
              </label>

              <label>
                Mensaje <span>*</span>
                <textarea
                  name="mensaje"
                  value={form.mensaje}
                  onChange={handleChange}
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                  required
                />
              </label>

              <button type="submit" className="contact-submit-button" disabled={enviando}>
                <span>✈</span>
                {enviando ? "Enviando..." : "Enviar mensaje"}
              </button>

              <p className="contact-privacy-text">
                Al enviar este formulario aceptas que te contactemos al correo
                proporcionado. Tus datos serán utilizados únicamente para
                responder tu solicitud.
              </p>
            </form>
          </article>

          <article className="contact-card contact-info-card">
            <h2>Información de contacto</h2>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <div className="contact-info-icon">✉</div>

                <div>
                  <h3>Correo electrónico</h3>
                  <p>contacto@neocare.com</p>
                  <p>soporte@neocare.com</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">●</div>

                <div>
                  <h3>Ubicación</h3>
                  <p>Universidad Católica Andrés Bello</p>
                  <p>Extensión Guayana</p>
                  <p>Puerto Ordaz, Venezuela</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">🎓</div>

                <div>
                  <h3>Facultad</h3>
                  <p>Facultad de Ingeniería</p>
                  <p>Escuela de Ingeniería Informática</p>
                  <p>Cátedra: Investigación de Operaciones</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">◷</div>

                <div>
                  <h3>Horario de atención</h3>
                  <p>Lunes a viernes</p>
                  <p>8:00 a. m. — 5:00 p. m.</p>
                </div>
              </div>
            </div>

            <div className="contact-emergency-inside">
              <div className="contact-emergency-small-icon">!</div>

              <div>
                <h3>¿Emergencia neonatal?</h3>

                <p>
                  NeoCare no reemplaza la atención médica profesional. Si el
                  recién nacido presenta fiebre alta, dificultad para respirar,
                  convulsiones, coloración azulada, rechazo total del alimento,
                  somnolencia excesiva o empeoramiento rápido, acude de
                  inmediato al centro de salud más cercano.
                </p>

                <strong>
                  No esperes respuesta por este formulario ante una emergencia.
                </strong>
              </div>
            </div>
          </article>
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default Contact;
