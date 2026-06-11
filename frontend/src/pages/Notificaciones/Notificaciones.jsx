import React, { useEffect, useState } from "react";
import AppShell from "../../components/AppShell/AppShell.jsx";
import { getNotificaciones, marcarNotificacionLeida } from "../../services/api.js";
import "../../styles/modulePage.css";

const Notificaciones = () => {
  const [items, setItems] = useState([]);

  const cargar = () => getNotificaciones().then((d) => setItems(d.notificaciones || []));

  useEffect(() => { cargar(); }, []);

  const marcar = async (id) => {
    await marcarNotificacionLeida(id);
    cargar();
  };

  return (
    <AppShell title="Notificaciones">
      <div className="module-list">
        {items.length === 0 && <p>No tienes notificaciones.</p>}
        {items.map((n) => (
          <article key={n.id} className="module-card" style={{ opacity: n.leido ? 0.6 : 1 }}>
            <strong>{n.tipo_alerta}</strong>
            <p>{n.mensaje}</p>
            <small>{n.fecha_envio}</small>
            {!n.leido && <button type="button" className="module-btn" onClick={() => marcar(n.id)}>Marcar leída</button>}
          </article>
        ))}
      </div>
    </AppShell>
  );
};

export default Notificaciones;
