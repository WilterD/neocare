import React, { useState } from "react";
import AppShell from "../../components/AppShell/AppShell.jsx";
import { postEpds } from "../../services/api.js";
import "../../styles/modulePage.css";

const PREGUNTAS = [
  "He podido reír y ver el lado divertido de las cosas",
  "He mirado el futuro con alegría",
  "Me he culpado innecesariamente cuando las cosas han ido mal",
  "Me he sentido ansiosa o preocupada sin buena razón",
  "Me he sentido asustada o atemorizada sin buena razón",
  "Las cosas se me han echado encima",
  "He sido tan infeliz que he tenido dificultad para dormir",
  "Me he sentido triste o muy infeliz",
  "He sido tan infeliz que he llorado",
  "He pensado en hacerme daño",
];

const EPDS = () => {
  const [respuestas, setRespuestas] = useState({});
  const [resultado, setResultado] = useState(null);

  const enviar = async () => {
    const body = {};
    PREGUNTAS.forEach((_, i) => { body[`p${i + 1}`] = Number(respuestas[i] ?? 0); });
    const r = await postEpds(body);
    setResultado(r);
  };

  return (
    <AppShell title="Escala EPDS (depresión posparto)">
      <p>Responde de 0 (nunca) a 3 (casi siempre) cada ítem.</p>
      {PREGUNTAS.map((p, i) => (
        <label key={i} style={{ display: "block", marginBottom: "0.75rem" }}>
          {i + 1}. {p}
          <select value={respuestas[i] ?? 0} onChange={(e) => setRespuestas((r) => ({ ...r, [i]: e.target.value }))}>
            {[0, 1, 2, 3].map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </label>
      ))}
      <button type="button" className="module-btn" onClick={enviar}>Enviar evaluación</button>
      {resultado && (
        <div className="module-card" style={{ marginTop: "1rem" }}>
          <p>Total: {resultado.puntuacion_total} — Clasificación: {resultado.clasificacion}</p>
          {resultado.clasificacion === "Probable" && <p className="module-error">Consulta con un profesional de salud.</p>}
        </div>
      )}
    </AppShell>
  );
};

export default EPDS;
