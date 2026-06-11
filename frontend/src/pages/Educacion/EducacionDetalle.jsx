import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppShell from "../../components/AppShell/AppShell.jsx";
import { getContenidoEducativoPorId } from "../../services/api.js";

const EducacionDetalle = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    getContenidoEducativoPorId(id).then(setItem);
  }, [id]);

  if (!item) return <AppShell title="Educación"><p>Cargando...</p></AppShell>;

  return (
    <AppShell title={item.titulo}>
      <p><strong>Tema:</strong> {item.tema} · <strong>Nivel:</strong> {item.nivelAlerta}</p>
      <p>{item.descripcion}</p>
      <p><strong>Recomendación:</strong> {item.recomendacion}</p>
      {item.urlRecurso && <p><a href={item.urlRecurso} target="_blank" rel="noreferrer">Ver recurso ({item.fuenteReferencia})</a></p>}
      <Link to="/educacion">← Volver al catálogo</Link>
    </AppShell>
  );
};

export default EducacionDetalle;
