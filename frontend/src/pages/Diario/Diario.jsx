import React, { useEffect, useState } from "react";
import AppShell from "../../components/AppShell/AppShell.jsx";
import { getDiarioEstado, getDiarioMe, getDiarioPromedio, postDiario } from "../../services/api.js";
import "../../styles/modulePage.css";

const Diario = () => {
  const [puntaje, setPuntaje] = useState(5);
  const [nota, setNota] = useState("");
  const [estado, setEstado] = useState(null);
  const [promedio, setPromedio] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [msg, setMsg] = useState("");

  const cargar = () => {
    getDiarioEstado().then(setEstado);
    getDiarioPromedio().then(setPromedio);
    getDiarioMe().then((d) => setRegistros(d.registros || []));
  };

  useEffect(() => { cargar(); }, []);

  const guardar = async () => {
    try {
      await postDiario({ puntaje, nota });
      setMsg("Check-in registrado.");
      cargar();
    } catch (e) {
      setMsg(e.message);
    }
  };

  return (
    <AppShell title="Diario emocional">
      {estado?.yaCompletadoHoy ? (
        <p className="module-success">Ya completaste el check-in de hoy.</p>
      ) : (
        <div className="module-form">
          <label>¿Cómo te sientes? (1-10)
            <input type="range" min="1" max="10" value={puntaje} onChange={(e) => setPuntaje(Number(e.target.value))} />
            <span>{puntaje}</span>
          </label>
          <label>Nota<textarea value={nota} onChange={(e) => setNota(e.target.value)} /></label>
          <button type="button" className="module-btn" onClick={guardar}>Registrar</button>
        </div>
      )}
      {promedio && <p>Promedio 7 días: {promedio.promedio} ({promedio.total} registros)</p>}
      {msg && <p>{msg}</p>}
      <div className="module-list" style={{ marginTop: "1rem" }}>
        {registros.map((r) => (
          <article key={r.id} className="module-card">{r.fecha_registro}: {r.puntaje_simple}/10 — {r.nota_diaria}</article>
        ))}
      </div>
    </AppShell>
  );
};

export default Diario;
