import React from "react";
import { NavLink } from "react-router-dom";

import inicioImage from "../../assets/Inicio.png";
import evaluacionImage from "../../assets/Evaluacion.png";
import educacionImage from "../../assets/Educacion.png";
import historialImage from "../../assets/H.png";
import perfilImage from "../../assets/Perfil.png";

const sidebarItems = [
  { image: inicioImage, label: "Inicio", path: "/inicio" },
  { image: evaluacionImage, label: "Evaluación", path: "/evaluacion" },
  { image: educacionImage, label: "Educación", path: "/educacion" },
  { image: historialImage, label: "Historial", path: "/historial" },
  { image: perfilImage, label: "Perfil", path: "/perfil" },
];

const SidebarNeoCare = ({ className = "", activePath = "" }) => {
  return (
    <aside className={`${className}-sidebar`}>
      <nav className={`${className}-sidebar-nav`}>
        {sidebarItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => {
              const isCurrent =
                isActive || (activePath && item.path === activePath);

              return isCurrent
                ? `${className}-sidebar-item active`
                : `${className}-sidebar-item`;
            }}
          >
            <span className={`${className}-sidebar-icon-box`}>
              <img
                src={item.image}
                alt={item.label}
                className={`${className}-sidebar-icon`}
              />
            </span>

            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default SidebarNeoCare;