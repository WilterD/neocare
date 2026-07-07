import React, { useEffect, useState } from "react";
import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { listarTestimonios } from "../../services/api.js";

const Testimonios = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarTestimonios()
      .then((d) => setItems(d.testimonios || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <Header2 />
      <section style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
        <h1>Testimonios</h1>
        <p>Experiencias de madres y cuidadores en NeoCare.</p>
        {loading && <p>Cargando...</p>}
        {items.map((t) => (
          <article key={t.id} style={{ marginBottom: "1.5rem", padding: "1rem", border: "1px solid #ddd", borderRadius: 8 }}>
            <strong>{t.nombre}</strong>
            <p>{t.contenido}</p>
            <small>{t.etapa}</small>
          </article>
        ))}
      </section>
      <Footer />
    </main>
  );
};

export default Testimonios;
