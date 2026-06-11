import React, { useEffect, useState } from "react";
import AppShell from "../../components/AppShell/AppShell.jsx";
import { useBebeActivo } from "../../context/BebeActivoContext.jsx";
import { getVacunas, patchVacuna } from "../../services/api.js";
import "../../styles/modulePage.css";

const Vacunas = () => {
  const { bebeActivo } = useBebeActivo();
  const [vacunas, setVacunas] = useState([]);

  const cargar = () => {
    if (bebeActivo) getVacunas(bebeActivo.id).then((d) => setVacunas(d.vacunas || []));
  };

  useEffect(() => { cargar(); }, [bebeActivo]);

  const marcarAplicada = async (v) => {
    await patchVacuna(bebeActivo.id, v.id, { estado: "Aplicada", fechaAplicacion: new Date().toISOString().slice(0, 10) });
    cargar();
  };

  return (
    <AppShell title="Vacunación">
      <div className="module-list">
        {vacunas.map((v) => (
          <article key={v.id} className="module-card">
            <h3>{v.nombre_vacuna} — {v.dosis}</h3>
            <p>Programada: {v.fecha_programada} · Estado: {v.estado}</p>
            {v.estado === "Pendiente" && (
              <button type="button" className="module-btn" onClick={() => marcarAplicada(v)}>Marcar aplicada</button>
            )}
          </article>
        ))}
      </div>
    </AppShell>
  );
};

export default Vacunas;
