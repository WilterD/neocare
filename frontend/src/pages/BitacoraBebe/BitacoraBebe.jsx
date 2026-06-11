import React, { useEffect, useState } from "react";
import AppShell from "../../components/AppShell/AppShell.jsx";
import { useBebeActivo } from "../../context/BebeActivoContext.jsx";
import { getBitacoraBebe, postBitacoraBebe } from "../../services/api.js";
import "../../styles/modulePage.css";
import "./BitacoraBebe.css";

const TABS = [
  { id: "Alimentacion", label: "Alimentación", placeholder: "Ej: lactancia, 8 tomas, 60 ml fórmula..." },
  { id: "Sueno", label: "Sueño", placeholder: "Ej: 3 h seguidas, sueño tranquilo..." },
  { id: "Panal", label: "Pañal", placeholder: "Ej: 6 cambios, deposición normal..." },
  { id: "Sintomas", label: "Síntomas", placeholder: "Ej: ligera congestión, sin fiebre..." },
];

const BitacoraBebe = () => {
  const { bebeActivo } = useBebeActivo();
  const [tab, setTab] = useState("Alimentacion");
  const [nota, setNota] = useState("");
  const [registros, setRegistros] = useState([]);
  const [error, setError] = useState("");

  const cargar = () => {
    if (!bebeActivo) return;
    getBitacoraBebe(bebeActivo.id).then((d) => setRegistros(d.registros || []));
  };

  useEffect(() => { cargar(); }, [bebeActivo]);

  const guardar = async () => {
    if (!bebeActivo) {
      setError("No hay bebé seleccionado.");
      return;
    }
    if (!nota.trim()) {
      setError("Escribe un detalle antes de guardar.");
      return;
    }
    setError("");
    await postBitacoraBebe({
      bebeId: bebeActivo.id,
      tipoRegistro: tab,
      detalles: { nota: nota.trim(), tipo: tab },
      observaciones: nota.trim(),
    });
    setNota("");
    cargar();
  };

  const tabActual = TABS.find((t) => t.id === tab);

  return (
    <AppShell title="Bitácora del bebé">
      {!bebeActivo ? (
        <p>Registra un bebé para usar la bitácora.</p>
      ) : (
        <>
          <div className="bitacora-tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={tab === t.id ? "bitacora-tab-active" : ""}
                onClick={() => { setTab(t.id); setNota(""); }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="module-form">
            <label>{tabActual?.label}
              <textarea
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                placeholder={tabActual?.placeholder}
              />
            </label>
            {error && <p className="module-error">{error}</p>}
            <button type="button" className="module-btn" onClick={guardar}>Registrar</button>
          </div>
          <div className="module-list" style={{ marginTop: "1.5rem" }}>
            {registros
              .filter((r) => r.tipo_registro === tab)
              .map((r) => (
                <article key={r.id} className="module-card">
                  <strong>{r.tipo_registro}</strong> — {r.fecha_registro}
                  <p>{r.observaciones}</p>
                </article>
              ))}
            {registros.filter((r) => r.tipo_registro === tab).length === 0 && (
              <p>Sin registros en esta categoría.</p>
            )}
          </div>
        </>
      )}
    </AppShell>
  );
};

export default BitacoraBebe;
