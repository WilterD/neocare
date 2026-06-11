import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppShell from "../../components/AppShell/AppShell.jsx";
import "./Resultado.css";

const nivelColor = {
  Bajo: "#7BB54A",
  Medio: "#EFB05A",
  Alto: "#E8B0B8",
};

const Resultado = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [resultado, setResultado] = useState(location.state?.resultadoRiesgo || null);

  useEffect(() => {
    if (resultado) return;
    const storedRiesgo = localStorage.getItem("neocareResultadoRiesgo");
    const registro = localStorage.getItem("neocareRegisterData");
    if (storedRiesgo) setResultado(JSON.parse(storedRiesgo));
    else if (registro) {
      const p = JSON.parse(registro);
      if (p.resultadoRiesgo) setResultado(p.resultadoRiesgo);
    }
  }, [resultado]);

  if (!resultado) {
    return (
      <AppShell title="Resultado">
        <p>No hay evaluación disponible.</p>
        <button type="button" onClick={() => navigate("/evaluacion")}>Ir a evaluación</button>
      </AppShell>
    );
  }

  const color = nivelColor[resultado.clasificacionFinal] || "#AAB7E8";

  return (
    <AppShell title="Resultado de tu evaluación">
      <section className="resultado-card" style={{ boxShadow: "none", padding: 0 }}>
        <div className="resultado-badge" style={{ borderColor: color }}>
          <span className="resultado-nivel" style={{ color }}>{resultado.clasificacionFinal}</span>
          <span className="resultado-label">Nivel de seguimiento</span>
        </div>
        <div className="resultado-grid">
          <article><h3>Riesgo materno</h3><p>{resultado.clasificacionMaterna} ({resultado.puntajeMaterno} pts)</p></article>
          <article><h3>Riesgo neonatal</h3><p>{resultado.clasificacionNeonatal} ({resultado.puntajeNeonatal} pts)</p></article>
        </div>
        <div className="resultado-recomendacion">
          <h3>Recomendación</h3>
          <p>{resultado.recomendacionSeguimiento}</p>
        </div>
        <div className="resultado-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate("/inicio")}>Ir al inicio</button>
          <button type="button" className="btn-primary" onClick={() => navigate("/educacion")}>Ver educación</button>
        </div>
      </section>
    </AppShell>
  );
};

export default Resultado;
