import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header2.css";

import logoImage from "../../assets/LOGO.png";
import avatarImage from "../../assets/Avatar.png";
import cierreImage from "../../assets/Cierre.png";
import settingsImage from "../../assets/CONF.png";

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

  return (
    <header className="header2">
      <div className="header2-container">
        <div className="header2-brand">
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