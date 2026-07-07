import React, { useEffect, useState } from "react";
import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import SidebarNeoCare from "../../components/SidebarNeoCare/SidebarNeoCare.jsx";
import { listarNotificaciones, marcarNotificacionLeida } from "../../services/api.js";

const Notificaciones = () => {
  const [items, setItems] = useState([]);

  const cargar = () =>
    listarNotificaciones().then((d) => setItems(d.notificaciones || []));

  useEffect(() => {
    cargar().catch(console.error);
  }, []);

  const marcar = async (id) => {
    await marcarNotificacionLeida(id);
    await cargar();
  };

  return (
    <main>
      <Header2 />
      <section style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
        <SidebarNeoCare className="bebes" activePath="/notificaciones" />
        <div style={{ flex: 1 }}>
          <h1>Notificaciones</h1>
          {items.length === 0 && <p>No tienes notificaciones.</p>}
          {items.map((n) => (
            <article key={n.id} style={{ padding: "0.75rem", borderBottom: "1px solid #eee", opacity: n.leido ? 0.6 : 1 }}>
              <strong>{n.tipo_alerta}</strong>
              <p>{n.mensaje}</p>
              <small>{n.fecha_envio}</small>
              {!n.leido && (
                <button type="button" onClick={() => marcar(n.id)} style={{ marginLeft: 8 }}>
                  Marcar leída
                </button>
              )}
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Notificaciones;
