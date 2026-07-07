import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Bebes/Bebes.css";
import "../../styles/neoForms.css";

import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import SidebarNeoCare from "../../components/SidebarNeoCare/SidebarNeoCare.jsx";
import { listarBitacoraBebe, crearBitacoraBebe } from "../../services/api.js";

const TIPOS_REGISTRO = [
  { value: "Alimentacion", label: "Alimentación" },
  { value: "Sueno", label: "Sueño" },
  { value: "Panal", label: "Pañal" },
  { value: "Otro", label: "Otro" },
];

const labelTipoRegistro = (tipo) =>
  TIPOS_REGISTRO.find((t) => t.value === tipo)?.label || tipo;

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

const BitacoraBebe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entradas, setEntradas] = useState([]);
  const [form, setForm] = useState({
    tipoRegistro: "Alimentacion",
    observaciones: "",
  });
  const [msg, setMsg] = useState("");
  const [guardando, setGuardando] = useState(false);

  const cargar = () =>
    listarBitacoraBebe(id).then((d) => setEntradas(d.entradas || []));

  useEffect(() => {
    cargar().catch(console.error);
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMsg("");
    try {
      await crearBitacoraBebe(id, form);
      setForm({ tipoRegistro: "Alimentacion", observaciones: "" });
      setMsg("Registro agregado correctamente.");
      await cargar();
    } catch (error) {
      setMsg(error.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className="bebes-page-wrapper">
      <Header2 />
      <section className="bebes-desktop">
        <SidebarNeoCare className="bebes" activePath="/bebes" />
        <section className="bebes-main-panel">
          <header className="bebes-title-row">
            <div>
              <button
                type="button"
                className="neo-btn-secondary neo-btn-sm"
                onClick={() => navigate(`/bebes/${id}`)}
              >
                ← Volver al bebé
              </button>
              <h1>Bitácora de cuidado</h1>
              <p>
                Registra alimentación, sueño, pañales y otras observaciones del
                día a día.
              </p>
            </div>
          </header>

          <form className="neo-form bebes-form-card" onSubmit={handleSubmit}>
            <label className="neo-form-field">
              Tipo de registro
              <select
                value={form.tipoRegistro}
                onChange={(e) =>
                  setForm({ ...form, tipoRegistro: e.target.value })
                }
              >
                {TIPOS_REGISTRO.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="neo-form-field">
              Observaciones
              <textarea
                value={form.observaciones}
                onChange={(e) =>
                  setForm({ ...form, observaciones: e.target.value })
                }
                placeholder="Detalles del cuidado, horarios, cantidad..."
              />
            </label>
            {msg && (
              <p
                className={
                  msg.includes("correctamente")
                    ? "neo-form-success"
                    : "neo-form-error"
                }
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
                {guardando ? "Guardando..." : "Agregar registro"}
              </button>
            </div>
          </form>

          <section className="bebes-list-section">
            <h2>Historial</h2>
            {entradas.length === 0 ? (
              <p className="bebes-empty-msg">
                Aún no hay registros. Agrega el primero arriba.
              </p>
            ) : (
              <ul className="bitacora-historial">
                {entradas.map((entrada) => (
                  <li key={entrada.id} className="bitacora-historial-item">
                    <div className="bitacora-historial-meta">
                      <strong>{labelTipoRegistro(entrada.tipo_registro)}</strong>
                      <span>{formatFecha(entrada.fecha_registro)}</span>
                    </div>
                    {entrada.observaciones && (
                      <p>{entrada.observaciones}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </section>
      </section>
      <Footer />
    </main>
  );
};

export default BitacoraBebe;
