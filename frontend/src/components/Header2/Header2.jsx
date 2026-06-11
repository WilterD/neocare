import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header2.css";

import logoImage from "../../assets/LOGO.png";
import avatarImage from "../../assets/Avatar.png";
import cierreImage from "../../assets/Cierre.png";

const Header2 = ({ user, badge = 0 }) => {
  const navigate = useNavigate();

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
    ["token", "neocareUser", "neocareRegisterData", "neocareResultadoRiesgo", "bebeActivoId", "user"].forEach((k) => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
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
          {badge > 0 && (
            <button type="button" className="header2-notif-btn" onClick={() => navigate("/notificaciones")}>
              {badge}
            </button>
          )}
          <button type="button" className="header2-user-button" onClick={() => navigate("/perfil")}>
            <img src={avatarImage} alt="Usuario" className="header2-avatar" />

            <span>{firstName ? `Hola, ${firstName}` : "Hola"}</span>
          </button>

          <button
            type="button"
            className="header2-logout-button"
            aria-label="Cerrar sesión"
            onClick={handleLogout}
          >
            <img
              src={cierreImage}
              alt="Cerrar sesión"
              className="header2-logout-icon"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header2;