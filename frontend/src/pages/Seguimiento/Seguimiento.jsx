import React, { useEffect, useState } from "react";
import AppShell from "../../components/AppShell/AppShell.jsx";
import { useBebeActivo } from "../../context/BebeActivoContext.jsx";
import { getTriajeHistorial, getSeguimiento, postSeguimiento } from "../../services/api.js";
import "../../styles/modulePage.css";

const ESCALAS = ["Mejoró", "Igual", "Empeoró", "Sí", "No"];
const CAMPOS = [
  "alimentacion_normal", "alimentacion_rechazo", "temperatura_fiebre", "temperatura_frio",
  "actividad_normal", "actividad_letargo", "respiracion_normal", "respiracion_dificultad",
  "piel_normal", "piel_alteracion", "eliminacion_panales", "eliminacion_deposiciones",
  "llanto_normal", "llanto_alteracion", "alarma_convulsiones", "alarma_vomito", "alarma_empeoramiento",
];

const Seguimiento = () => {
  const { bebeActivo } = useBebeActivo();
  const [triajeId, setTriajeId] = useState(null);
  const [dia, setDia] = useState(1);
  const [respuestas, setRespuestas] = useState({});
  const [progreso, setProgreso] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!bebeActivo) return;
    getTriajeHistorial(bebeActivo.id).then((d) => {
      if (d.historial?.[0]) setTriajeId(d.historial[0].id);
    });
  }, [bebeActivo]);

  useEffect(() => {
    if (bebeActivo && triajeId) {
      getSeguimiento(bebeActivo.id, triajeId).then((d) => setProgreso(d.seguimientos || []));
    }
  }, [bebeActivo, triajeId, msg]);

  const guardar = async () => {
    if (!triajeId) return setMsg("Realiza un triaje primero.");
    const body = { bebeId: bebeActivo.id, evaluacionRiesgoId: triajeId, dia, respuestas };
    try {
      const r = await postSeguimiento(body);
      setMsg(`Día ${r.dia} guardado: ${r.resultado_evolucion}`);
    } catch (e) {
      setMsg(e.message);
    }
  };

  return (
    <AppShell title="Seguimiento 5 días">
      <p>Días completados: {progreso.length}/5</p>
      <label>Día <select value={dia} onChange={(e) => setDia(Number(e.target.value))}>
        {[1, 2, 3, 4, 5].map((d) => <option key={d} value={d}>{d}</option>)}
      </select></label>
      <div className="module-form" style={{ marginTop: "1rem" }}>
        {CAMPOS.map((c) => (
          <label key={c}>{c.replace(/_/g, " ")}
            <select value={respuestas[c] || "Igual"} onChange={(e) => setRespuestas((p) => ({ ...p, [c]: e.target.value }))}>
              {ESCALAS.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </label>
        ))}
      </div>
      <button type="button" className="module-btn" onClick={guardar}>Guardar día</button>
      {msg && <p className="module-success">{msg}</p>}
    </AppShell>
  );
};

export default Seguimiento;
