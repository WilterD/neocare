import React, { useEffect, useState } from "react";
import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import SidebarNeoCare from "../../components/SidebarNeoCare/SidebarNeoCare.jsx";
import { listarEpds, crearEpds } from "../../services/api.js";
import "../../styles/emocionalPages.css";

const PREGUNTAS = [
  "p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10",
];

const OPCIONES = [
  { value: 0, label: "0 — Nunca" },
  { value: 1, label: "1 — Casi nunca" },
  { value: 2, label: "2 — A veces" },
  { value: 3, label: "3 — Frecuentemente" },
];

const formatFecha = (fecha) => {
  if (!fecha) return "";
  const f = new Date(fecha);
  if (Number.isNaN(f.getTime())) return String(fecha);
  return f.toLocaleDateString("es-VE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const EPDS = () => {
  const [historial, setHistorial] = useState([]);
  const [respuestas, setRespuestas] = useState(
    Object.fromEntries(PREGUNTAS.map((p) => [p, 0]))
  );
  const [resultado, setResultado] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const cargar = () => listarEpds().then((d) => setHistorial(d.evaluaciones || []));

  useEffect(() => {
    cargar().catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setResultado(null);
    try {
      const data = await crearEpds(respuestas);
      setResultado(data);
      await cargar();
    } catch (error) {
      setResultado({ error: error.message });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className="emocional-page-wrapper">
      <Header2 />
      <section className="emocional-desktop">
        <SidebarNeoCare className="emocional" activePath="/epds" />
        <section className="emocional-main-panel">
          <header className="emocional-title-row">
            <h1>Evaluación EPDS</h1>
            <p>
              Escala de Edimburgo para detección de depresión posparto. Cada
              pregunta se responde de 0 a 3. No reemplaza una valoración
              clínica profesional.
            </p>
          </header>

          <article className="emocional-form-card">
            <h2>Cuestionario</h2>
            <form onSubmit={handleSubmit}>
              <div className="emocional-preguntas-grid">
                {PREGUNTAS.map((p, i) => (
                  <div key={p} className="emocional-pregunta-item">
                    <label htmlFor={p}>Pregunta {i + 1}</label>
                    <select
                      id={p}
                      value={respuestas[p]}
                      onChange={(e) =>
                        setRespuestas({
                          ...respuestas,
                          [p]: Number(e.target.value),
                        })
                      }
                    >
                      {OPCIONES.map((op) => (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {resultado && !resultado.error && (
                <div className="emocional-resultado-card">
                  <strong>
                    Resultado: {resultado.puntuacionTotal} puntos —{" "}
                    {resultado.clasificacion}
                  </strong>
                </div>
              )}
              {resultado?.error && (
                <p className="emocional-msg error">{resultado.error}</p>
              )}

              <div className="neo-form-actions" style={{ marginTop: "1rem" }}>
                <button
                  type="submit"
                  className="neo-btn-primary"
                  disabled={guardando}
                >
                  {guardando ? "Enviando..." : "Enviar evaluación"}
                </button>
              </div>
            </form>
          </article>

          <section className="emocional-historial">
            <h2>Historial</h2>
            {historial.length === 0 ? (
              <p className="emocional-historial-empty">
                No hay evaluaciones EPDS previas.
              </p>
            ) : (
              historial.map((h) => (
                <article key={h.id} className="emocional-entrada">
                  <small className="emocional-entrada-fecha">
                    {formatFecha(h.fecha_evaluacion)}
                  </small>
                  <div className="emocional-entrada-stats">
                    <span className="emocional-stat-pill">
                      {h.puntuacion_total} pts
                    </span>
                    <span className="emocional-stat-pill">{h.clasificacion}</span>
                  </div>
                </article>
              ))
            )}
          </section>
        </section>
      </section>
      <Footer />
    </main>
  );
};

export default EPDS;
