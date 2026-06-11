import React, { useState } from "react";
import AppShell from "../../components/AppShell/AppShell.jsx";
import { useBebeActivo } from "../../context/BebeActivoContext.jsx";
import { postTriaje } from "../../services/api.js";
import "../../styles/modulePage.css";

const SIGNOS = [
  { key: "convulsiones", label: "Convulsiones" },
  { key: "dificultad_respiratoria", label: "Dificultad respiratoria" },
  { key: "coloracion_azulada", label: "Coloración azulada" },
  { key: "fiebre_hipotermia", label: "Fiebre o hipotermia" },
  { key: "rechazo_alimentacion", label: "Rechazo alimentación" },
  { key: "disminucion_conciencia", label: "Disminución conciencia" },
  { key: "vomitos_repetitivos", label: "Vómitos repetitivos" },
  { key: "ictericia_progresiva", label: "Ictericia progresiva" },
  { key: "disminucion_actividad", label: "Disminución actividad" },
  { key: "llanto_persistente", label: "Llanto persistente" },
  { key: "alteraciones_sueno", label: "Alteraciones sueño" },
  { key: "disminucion_apetito", label: "Disminución apetito" },
  { key: "irritabilidad_ocasional", label: "Irritabilidad ocasional" },
];

const Triaje = () => {
  const { bebeActivo } = useBebeActivo();
  const [signos, setSignos] = useState({});
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  const toggle = (key) => setSignos((p) => ({ ...p, [key]: !p[key] }));

  const enviar = async () => {
    if (!bebeActivo) return setError("Selecciona un bebé.");
    try {
      const r = await postTriaje({ bebeId: bebeActivo.id, signos });
      setResultado(r);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <AppShell title="Triaje por signos">
      {!bebeActivo && <p>Registra un bebé para realizar el triaje.</p>}
      <div className="module-checklist">
        {SIGNOS.map((s) => (
          <label key={s.key}>
            <input type="checkbox" checked={!!signos[s.key]} onChange={() => toggle(s.key)} />
            {s.label}
          </label>
        ))}
      </div>
      <button type="button" className="module-btn" onClick={enviar} style={{ marginTop: "1rem" }}>Evaluar triaje</button>
      {error && <p className="module-error">{error}</p>}
      {resultado && (
        <div className="module-card" style={{ marginTop: "1rem" }}>
          <p><strong>Nivel:</strong> {resultado.nivel_riesgo}</p>
          <p><strong>Puntaje:</strong> {resultado.puntuacion_total}</p>
        </div>
      )}
    </AppShell>
  );
};

export default Triaje;
