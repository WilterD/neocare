import React, { useEffect, useState } from "react";
import AppShell from "../../components/AppShell/AppShell.jsx";
import { useBebeActivo } from "../../context/BebeActivoContext.jsx";
import { getControles, postControl } from "../../services/api.js";
import "../../styles/modulePage.css";

const Controles = () => {
  const { bebeActivo } = useBebeActivo();
  const [controles, setControles] = useState([]);
  const [form, setForm] = useState({ fechaControl: "", pesoKg: "", tallaCm: "", perimetroCefalicoCm: "" });

  const cargar = () => {
    if (bebeActivo) getControles(bebeActivo.id).then((d) => setControles(d.controles || []));
  };

  useEffect(() => { cargar(); }, [bebeActivo]);

  const guardar = async (e) => {
    e.preventDefault();
    await postControl(bebeActivo.id, {
      fechaControl: form.fechaControl,
      pesoKg: Number(form.pesoKg),
      tallaCm: Number(form.tallaCm),
      perimetroCefalicoCm: Number(form.perimetroCefalicoCm),
    });
    cargar();
  };

  return (
    <AppShell title="Controles niño sano">
      <form className="module-form" onSubmit={guardar}>
        <label>Fecha<input type="date" value={form.fechaControl} onChange={(e) => setForm((p) => ({ ...p, fechaControl: e.target.value }))} required /></label>
        <label>Peso (kg)<input type="number" step="0.01" value={form.pesoKg} onChange={(e) => setForm((p) => ({ ...p, pesoKg: e.target.value }))} required /></label>
        <label>Talla (cm)<input type="number" step="0.1" value={form.tallaCm} onChange={(e) => setForm((p) => ({ ...p, tallaCm: e.target.value }))} required /></label>
        <label>Perímetro cefálico (cm)<input type="number" step="0.1" value={form.perimetroCefalicoCm} onChange={(e) => setForm((p) => ({ ...p, perimetroCefalicoCm: e.target.value }))} required /></label>
        <button type="submit" className="module-btn">Registrar control</button>
      </form>
      <div className="module-list" style={{ marginTop: "1.5rem" }}>
        {controles.map((c) => (
          <article key={c.id} className="module-card">
            {c.fecha_control}: {c.peso_kg} kg · {c.talla_cm} cm · PC {c.perimetro_cefalico_cm} cm
          </article>
        ))}
      </div>
    </AppShell>
  );
};

export default Controles;
