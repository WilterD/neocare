import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../components/AppShell/AppShell.jsx";
import { getPerfilMe } from "../../services/api.js";
import "./UserHome.css";

const UserHome = () => {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    getPerfilMe()
      .then(setPerfil)
      .catch(() => {
        const reg = localStorage.getItem("neocareRegisterData");
        if (reg) setPerfil({ registro: JSON.parse(reg) });
      });
  }, []);

  const registro = perfil?.registro || {};
  const riesgo = registro.resultadoRiesgo;
  const bebe = registro.recienNacido || {};
  const nombreBebe = bebe.nombreBebe || perfil?.bebes?.[0]?.nombre_bebe || "No registrado";

  const acciones = [];
  if (riesgo?.clasificacionFinal === "Alto") {
    acciones.push({ t: "Revisar signos de alarma", d: "Consulta el contenido educativo de nivel Alto.", path: "/educacion" });
    acciones.push({ t: "Realizar triaje", d: "Completa el checklist de signos.", path: "/triaje" });
  } else if (riesgo?.clasificacionFinal === "Medio") {
    acciones.push({ t: "Seguimiento diario", d: "Registra la evolución durante 5 días.", path: "/seguimiento" });
  } else {
    acciones.push({ t: "Controles rutinarios", d: "Registra peso y talla en controles.", path: "/controles" });
    acciones.push({ t: "Vacunación", d: "Revisa el calendario de vacunas.", path: "/vacunas" });
  }
  acciones.push({ t: "Diario emocional", d: "Registra cómo te sientes hoy.", path: "/diario-emocional" });

  return (
    <AppShell title="Inicio">
      <section className="user-home-hero-card">
        <h2>Hola, bienvenida a tu espacio NeoCare</h2>
        <p>Seguimiento de <strong>{nombreBebe}</strong></p>
      </section>

      <section className="user-home-current-card">
        <h2>Seguimiento actual</h2>
        <div className="user-home-current-grid">
          <article>
            <span>Última evaluación</span>
            <strong>{perfil?.fechaUltimaEvaluacion || registro.fechaUltimaEvaluacion || (riesgo ? "Completada" : "Pendiente")}</strong>
          </article>
          <article>
            <span>Nivel de seguimiento</span>
            <strong className="user-home-risk-pill">{riesgo?.clasificacionFinal || "Sin clasificar"}</strong>
          </article>
        </div>
        {riesgo && (
          <div className="user-home-current-recommendation">
            <p><strong>Recomendación:</strong> {riesgo.recomendacionSeguimiento}</p>
          </div>
        )}
        <button type="button" className="user-home-result-button" onClick={() => navigate("/resultado")}>
          Ver resultado completo
        </button>
        <button type="button" className="user-home-result-button" onClick={() => navigate("/evaluacion")} style={{ marginLeft: "0.5rem" }}>
          Nueva evaluación
        </button>
      </section>

      <section className="user-home-actions-card">
        <h2>Próximas acciones sugeridas</h2>
        <div className="user-home-actions-grid">
          {acciones.map((a) => (
            <article key={a.path} className="user-home-suggestion-card" onClick={() => navigate(a.path)} role="button" tabIndex={0}>
              <h3>{a.t}</h3>
              <p>{a.d}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
};

export default UserHome;
