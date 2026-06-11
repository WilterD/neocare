import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../../components/AppShell/AppShell.jsx";
import { getContenidoEducativo } from "../../services/api.js";
import "./Educacion.css";

const nivelClass = (nivel) => {
  if (nivel === "Alto") return "educacion-badge-alto";
  if (nivel === "Medio") return "educacion-badge-medio";
  return "educacion-badge-bajo";
};

const Educacion = () => {
  const [contenido, setContenido] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroNivel, setFiltroNivel] = useState("");

  useEffect(() => {
    const riesgo = localStorage.getItem("neocareResultadoRiesgo");
    const reg = localStorage.getItem("neocareRegisterData");
    if (riesgo) setFiltroNivel(JSON.parse(riesgo).clasificacionFinal || "");
    else if (reg) setFiltroNivel(JSON.parse(reg).resultadoRiesgo?.clasificacionFinal || "");
  }, []);

  useEffect(() => {
    setCargando(true);
    getContenidoEducativo(filtroNivel ? { nivelAlerta: filtroNivel } : {})
      .then((d) => setContenido(d.contenido || []))
      .finally(() => setCargando(false));
  }, [filtroNivel]);

  return (
    <AppShell title="Contenido educativo">
      <div className="educacion-filtros">
        <button type="button" className={!filtroNivel ? "educacion-filtro-active" : ""} onClick={() => setFiltroNivel("")}>Todos</button>
        {["Bajo", "Medio", "Alto"].map((n) => (
          <button key={n} type="button" className={filtroNivel === n ? "educacion-filtro-active" : ""} onClick={() => setFiltroNivel(n)}>{n}</button>
        ))}
      </div>
      {cargando && <p>Cargando...</p>}
      <div className="educacion-grid">
        {contenido.map((item) => (
          <Link key={item.id} to={`/educacion/${item.id}`} className="educacion-card educacion-card-link">
            <div className="educacion-card-header">
              <h3>{item.titulo}</h3>
              <span className={`educacion-badge ${nivelClass(item.nivelAlerta)}`}>{item.nivelAlerta}</span>
            </div>
            <p className="educacion-tema">{item.tema}</p>
            <p>{item.descripcion.slice(0, 120)}...</p>
          </Link>
        ))}
      </div>
    </AppShell>
  );
};

export default Educacion;
