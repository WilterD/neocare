import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

import logo from "../../assets/logo.png";

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-container">
        <Link to="/" className="header-brand">
          <img src={logo} alt="Logo de NeoCare" className="header-logo" />
          <span>NeoCare</span>
        </Link>

        <nav className="header-nav">
          <Link to="/">Inicio</Link>
          <a href="#servicios">Servicios</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#contacto">Contacto</a>
        </nav>

        <div className="header-actions">
          <Link to="/login" className="login-link">
            Iniciar Sesión
          </Link>

          <Link to="/registro" className="register-link">
            Registrarse
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;