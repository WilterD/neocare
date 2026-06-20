import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header2.css";

import logoImage from "../../assets/LOGO.png";
import avatarImage from "../../assets/Avatar.png";
import cierreImage from "../../assets/Cierre.png";
import settingsImage from "../../assets/Cierre.png";

const Header2 = ({ user }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const userName =
    user?.nombre ||
    user?.name ||
    user?.nombreCompleto ||
    user?.nombre_completo ||
    user?.fullName ||
    user?.madreCuidadora ||
    user?.cuidadoraNombre ||
    user?.nombreMadre ||
    user?.nombreCuidadora ||
    user?.nombreRepresentante ||
    user?.datosPersonales?.nombre ||
    user?.datosPersonales?.nombreCompleto ||
    user?.datosPersonales?.madreCuidadora ||
    user?.usuario?.nombre ||
    user?.usuario?.name ||
    user?.usuario?.nombreCompleto ||
    user?.user?.nombre ||
    user?.user?.name ||
    user?.user?.nombreCompleto ||
    "";

  const firstName = userName ? userName.trim().split(" ")[0] : "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("neocareUser");
    localStorage.removeItem("neocareRegisterData");
    localStorage.removeItem("user");

    navigate("/");
  };

  const toggleSidebarMenu = () => {
    document.body.classList.toggle("sidebar-open");
  };

  useEffect(() => {
    const handleLinkClick = (e) => {
      // If clicking a link inside any element ending with '-sidebar', or clicking the overlay
      if (
        (e.target.closest("a") && e.target.closest("aside[class$='-sidebar'], aside.home-sidebar, aside.education-sidebar, aside.evaluation-sidebar, aside.history-sidebar, aside.profile-sidebar, aside.bebes-sidebar, aside.all-evaluations-sidebar")) ||
        e.target === document.body // clicking the pseudo-element overlay registers as clicking body
      ) {
        document.body.classList.remove("sidebar-open");
      }
    };
    document.addEventListener("click", handleLinkClick);
    return () => document.removeEventListener("click", handleLinkClick);
  }, []);

  return (
    <header className="header2">
      <div className="header2-container">
        <div className="header2-brand">
          <button type="button" className="header2-burger-btn" onClick={toggleSidebarMenu} aria-label="Menú">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="burger-icon">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <img src={logoImage} alt="NeoCare" className="header2-logo" />
          <span>NeoCare</span>
        </div>

        <div className="header2-user-area">
          <button type="button" className="header2-user-button">
            <img src={avatarImage} alt="Usuario" className="header2-avatar" />

            <span>{firstName ? `Hola, ${firstName}` : "Hola"}</span>
          </button>

          <div className="header2-settings-wrapper">
            <button
              type="button"
              className="header2-settings-button"
              aria-label="Ajustes"
              onClick={toggleDropdown}
            >
              <img
                src={settingsImage}
                alt="Ajustes"
                className="header2-settings-icon"
              />
            </button>

            {dropdownOpen && (
              <div className="header2-dropdown">
                <button
                  type="button"
                  className="header2-dropdown-item logout"
                  onClick={handleLogout}
                >
                  <img
                    src={cierreImage}
                    alt=""
                    className="header2-dropdown-icon"
                  />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header2;