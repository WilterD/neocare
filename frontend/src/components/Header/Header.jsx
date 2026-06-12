import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";

import logoImage from "../../assets/logo.png";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-brand" onClick={() => navigate("/")}>
          <img src={logoImage} alt="NeoCare" className="header-logo" />
          <span>NeoCare</span>
        </div>

        <nav className="header-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Inicio
          </NavLink>

          <NavLink
            to="/servicios"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Servicios
          </NavLink>

          <NavLink
            to="/nosotros"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Nosotros
          </NavLink>

          <NavLink
            to="/contacto"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Contacto
          </NavLink>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="login-link"
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </button>

          <button
            type="button"
            className="register-link"
            onClick={() => navigate("/registro")}
          >
            Registrarse
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;