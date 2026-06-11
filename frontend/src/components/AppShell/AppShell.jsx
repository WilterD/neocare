import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Header2 from "../Header2/Header2.jsx";
import Footer from "../Footer/Footer.jsx";
import { useBebeActivo } from "../../context/BebeActivoContext.jsx";
import { getNotificaciones } from "../../services/api.js";
import "./AppShell.css";

const NAV_ITEMS = [
  { label: "Inicio", path: "/inicio" },
  { label: "Evaluación", path: "/evaluacion" },
  { label: "Triaje", path: "/triaje" },
  { label: "Seguimiento", path: "/seguimiento" },
  { label: "Bitácora bebé", path: "/bitacora-bebe" },
  { label: "Diario", path: "/diario-emocional" },
  { label: "EPDS", path: "/epds" },
  { label: "Educación", path: "/educacion" },
  { label: "Vacunas", path: "/vacunas" },
  { label: "Controles", path: "/controles" },
  { label: "Historial", path: "/historial" },
  { label: "Notificaciones", path: "/notificaciones" },
  { label: "Perfil", path: "/perfil" },
];

const AppShell = ({ children, title }) => {
  const navigate = useNavigate();
  const { bebes, bebeActivo, seleccionarBebe } = useBebeActivo();
  const [usuario, setUsuario] = useState(null);
  const [noLeidas, setNoLeidas] = useState(0);

  useEffect(() => {
    const u = localStorage.getItem("neocareUser");
    if (u) setUsuario(JSON.parse(u));
    getNotificaciones().then((d) => setNoLeidas(d.noLeidas || 0)).catch(() => {});
  }, []);

  return (
    <main className="appshell-wrapper">
      <Header2 user={usuario} badge={noLeidas} />
      <section className="appshell-layout">
        <aside className="appshell-sidebar">
          {bebes.length > 1 && (
            <div className="appshell-bebe-select">
              <label>Bebé activo</label>
              <select
                value={bebeActivo?.id || ""}
                onChange={(e) => seleccionarBebe(e.target.value)}
              >
                {bebes.map((b) => (
                  <option key={b.id} value={b.id}>{b.nombre_bebe}</option>
                ))}
              </select>
            </div>
          )}
          <nav>
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => (isActive ? "active" : "")}>
                {item.label}
                {item.path === "/notificaciones" && noLeidas > 0 && (
                  <span className="appshell-badge">{noLeidas}</span>
                )}
              </NavLink>
            ))}
          </nav>
          {bebes.length === 0 && (
            <button type="button" className="appshell-add-bebe" onClick={() => navigate("/bebes/nuevo")}>
              + Registrar bebé
            </button>
          )}
        </aside>
        <section className="appshell-content">
          {title && <h1 className="appshell-title">{title}</h1>}
          {children}
        </section>
      </section>
      <Footer />
    </main>
  );
};

export default AppShell;
