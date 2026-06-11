import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../../components/AppShell/AppShell.jsx";
import { getEvaluaciones } from "../../services/api.js";
import "./Historial.css";

const formatFecha = (fecha) => {
  if (!fecha) return "";
  const d = new Date(fecha);
  return Number.isNaN(d.getTime()) ? fecha : d.toLocaleDateString("es-VE", { day: "2-digit", month: "short", year: "numeric" });
};

const Historial = () => {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getEvaluaciones()
      .then((d) => setEvaluaciones(d.evaluaciones || []))
      .catch(() => {
        const riesgo = localStorage.getItem("neocareResultadoRiesgo");
        if (riesgo) setEvaluaciones([{ id: "local", resultadoRiesgo: JSON.parse(riesgo) }]);
      })
      .finally(() => setCargando(false));
  }, []);

  return (
    <AppShell title="Historial de evaluaciones">
      {cargando && <p>Cargando...</p>}
      {!cargando && evaluaciones.length === 0 && <p>Aún no tienes evaluaciones.</p>}
      {evaluaciones.map((ev) => {
        const r = ev.resultadoRiesgo || ev;
        const content = (
          <article className="historial-item">
            <h3>Evaluación {ev.id === "local" ? "inicial" : `#${ev.id}`}{ev.nombreBebe ? ` — ${ev.nombreBebe}` : ""}</h3>
            {ev.fechaEvaluacion && <p className="historial-fecha">{formatFecha(ev.fechaEvaluacion)}</p>}
            <p><strong>Clasificación:</strong> {r.clasificacionFinal}</p>
            <p className="historial-rec">{r.recomendacionSeguimiento}</p>
          </article>
        );
        return ev.id !== "local" ? (
          <Link key={ev.id} to={`/historial/${ev.id}`} style={{ textDecoration: "none", color: "inherit" }}>{content}</Link>
        ) : <div key="local">{content}</div>;
      })}
    </AppShell>
  );
};

export default Historial;
