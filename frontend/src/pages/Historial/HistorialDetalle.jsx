import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppShell from "../../components/AppShell/AppShell.jsx";
import { getEvaluacionById } from "../../services/api.js";

const HistorialDetalle = () => {
  const { id } = useParams();
  const [ev, setEv] = useState(null);

  useEffect(() => {
    getEvaluacionById(id).then(setEv);
  }, [id]);

  if (!ev) return <AppShell title="Historial"><p>Cargando...</p></AppShell>;

  const r = ev.resultadoRiesgo || ev;
  return (
    <AppShell title={`Evaluación #${ev.id}`}>
      <p><strong>Fecha:</strong> {ev.fechaEvaluacion}</p>
      <p><strong>Bebé:</strong> {ev.nombreBebe}</p>
      <p><strong>Clasificación final:</strong> {r.clasificacionFinal}</p>
      <p><strong>Materno:</strong> {r.clasificacionMaterna} · <strong>Neonatal:</strong> {r.clasificacionNeonatal}</p>
      <p>{r.recomendacionSeguimiento}</p>
      <Link to="/historial">← Volver al historial</Link>
    </AppShell>
  );
};

export default HistorialDetalle;
