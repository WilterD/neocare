import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

import logoImage from "../../assets/LOGO.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <section className="footer-brand">
          <img
            src={logoImage}
            alt="NeoCare"
            className="footer-logo-image"
          />

          <div className="footer-brand-text">
            <h2>NeoCare</h2>
            <p>Cuidando la salud de tu familia con tecnología y calidez.</p>
          </div>
        </section>

        <section className="footer-section">
          <h3>Navegación</h3>

          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/servicios">Servicios</Link></li>
            <li><Link to="/nosotros">Nosotros</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </section>

        <section className="footer-section">
          <h3>Servicios</h3>

          <ul>
            <li><Link to="/evaluacion">Evaluación de riesgo</Link></li>
            <li><Link to="/educacion">Contenido educativo</Link></li>
            <li><Link to="/seguimiento">Seguimiento neonatal</Link></li>
            <li><Link to="/testimonios">Testimonios</Link></li>
          </ul>
        </section>

        <section className="footer-section">
          <h3>Contacto</h3>

          <ul>
            <li>Soporte NeoCare</li>
            <li>Atención digital</li>
            <li>Información segura</li>
            <li>Cuidado neonatal</li>
          </ul>
        </section>
      </div>

      <div className="footer-bottom">
        <p>© 2026 NeoCare. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;