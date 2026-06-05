import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="app-footer">
      <section className="footer-brand">
        <div className="footer-logo">◎</div>

        <div>
          <h2>NeoCare</h2>
          <p>Cuidando la salud de tu familia con tecnología y calidez.</p>
        </div>
      </section>

      <section className="footer-section">
        <h3>Navegación</h3>
        <p>Inicio</p>
        <p>Servicios</p>
        <p>Nosotros</p>
        <p>Contacto</p>
      </section>

      <section className="footer-section">
        <h3>Plataforma</h3>
        <p>NeoCare · Triage neonatal</p>
        <p>Mamá Plena · Diario emocional</p>
        <p>Educación validada</p>
        <p>Crear cuenta gratis</p>
      </section>

      <section className="footer-section">
        <h3>Contacto</h3>
        <p>✉ info@NeoCare.com</p>
        <p>⌂ UCAB Extensión Guayana — Puerto Ordaz</p>
        <p>□ Escuela de Ingeniería Informática</p>
      </section>

      <div className="footer-line"></div>

      <div className="footer-socials">
        <span>f</span>
        <span>■</span>
        <span>𝕏</span>
      </div>

      <p className="footer-copy">
        © 2026 Salud Digital. Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default Footer;