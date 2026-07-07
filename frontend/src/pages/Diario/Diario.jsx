import React, { useEffect, useState } from "react";
import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import SidebarNeoCare from "../../components/SidebarNeoCare/SidebarNeoCare.jsx";
import { listarDiarioEmocional, crearDiarioEmocional } from "../../services/api.js";
import "../../styles/emocionalPages.css";

const CAMPOS = [
  { key: "nivelAnimo", label: "Ánimo", hint: "¿Cómo te sientes hoy?" },
  { key: "nivelAnsiedad", label: "Ansiedad", hint: "Nivel de preocupación" },
  { key: "nivelCansancio", label: "Cansancio", hint: "Energía disponible" },
];

const formatFecha = (fecha) => {
  if (!fecha) return "";
  const f = new Date(fecha);
  if (Number.isNaN(f.getTime())) return String(fecha);
  return f.toLocaleString("es-VE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Diario = () => {
  const [entradas, setEntradas] = useState([]);
  const [form, setForm] = useState({
    nivelAnimo: 3,
    nivelAnsiedad: 3,
    nivelCansancio: 3,
    notaDiaria: "",
  });
  const [msg, setMsg] = useState("");
  const [guardando, setGuardando] = useState(false);

  const cargar = () =>
    listarDiarioEmocional().then((d) => setEntradas(d.entradas || []));

  useEffect(() => {
    cargar().catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMsg("");
    try {
      await crearDiarioEmocional({
        ...form,
        nivelAnimo: Number(form.nivelAnimo),
        nivelAnsiedad: Number(form.nivelAnsiedad),
        nivelCansancio: Number(form.nivelCansancio),
      });
      setMsg("Entrada guardada correctamente.");
      setForm({
        nivelAnimo: 3,
        nivelAnsiedad: 3,
        nivelCansancio: 3,
        notaDiaria: "",
      });
      await cargar();
    } catch (error) {
      setMsg(error.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className="emocional-page-wrapper">
      <Header2 />
      <section className="emocional-desktop">
        <SidebarNeoCare className="emocional" activePath="/diario" />
        <section className="emocional-main-panel">
          <header className="emocional-title-row">
            <h1>Diario emocional</h1>
            <p>
              Registra cómo te sientes en el cuidado de tu bebé. Escala del 1
              (bajo) al 5 (alto) para ánimo, ansiedad y cansancio.
            </p>
          </header>

          <article className="emocional-form-card">
            <h2>Nueva entrada</h2>
            <form className="neo-form" onSubmit={handleSubmit}>
              <div className="emocional-sliders">
                {CAMPOS.map(({ key, label, hint }) => (
                  <div key={key} className="emocional-slider-field">
                    <label htmlFor={key}>{label}</label>
                    <span className="emocional-slider-value">{form[key]}</span>
                    <small style={{ color: "#6b6b7c", fontSize: 12 }}>{hint}</small>
                    <input
                      id={key}
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={form[key]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: Number(e.target.value) })
                      }
                    />
                  </div>
                ))}
              </div>

              <label className="neo-form-field">
                Nota del día
                <textarea
                  rows={4}
                  placeholder="¿Cómo fue tu día? Escribe lo que quieras recordar..."
                  value={form.notaDiaria}
                  onChange={(e) =>
                    setForm({ ...form, notaDiaria: e.target.value })
                  }
                />
              </label>

              {msg && (
                <p
                  className={`emocional-msg ${
                    msg.includes("correctamente") ? "" : "error"
                  }`}
                >
                  {msg}
                </p>
              )}

              <div className="neo-form-actions">
                <button
                  type="submit"
                  className="neo-btn-primary"
                  disabled={guardando}
                >
                  {guardando ? "Guardando..." : "Guardar entrada"}
                </button>
              </div>
            </form>
          </article>

          <section className="emocional-historial">
            <h2>Historial</h2>
            {entradas.length === 0 ? (
              <p className="emocional-historial-empty">
                Aún no tienes entradas. Guarda la primera arriba.
              </p>
            ) : (
              entradas.map((e) => (
                <article key={e.id} className="emocional-entrada">
                  <small className="emocional-entrada-fecha">
                    {formatFecha(e.fecha_registro)}
                  </small>
                  <div className="emocional-entrada-stats">
                    <span className="emocional-stat-pill">
                      Ánimo: {e.nivel_animo}
                    </span>
                    <span className="emocional-stat-pill">
                      Ansiedad: {e.nivel_ansiedad}
                    </span>
                    <span className="emocional-stat-pill">
                      Cansancio: {e.nivel_cansancio}
                    </span>
                  </div>
                  {e.nota_diaria && (
                    <p className="emocional-entrada-nota">{e.nota_diaria}</p>
                  )}
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

export default Diario;
