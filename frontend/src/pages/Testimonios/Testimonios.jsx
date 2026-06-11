import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { getTestimonios } from "../../services/api.js";

const Testimonios = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getTestimonios().then((d) => setItems(d.testimonios || []));
  }, []);

  return (
    <main>
      <Header />
      <section style={{ maxWidth: 800, margin: "2rem auto", padding: "1rem" }}>
        <h1>Testimonios Mama Plena</h1>
        {items.map((t) => (
          <article key={t.id} style={{ background: "#f8f6f2", padding: "1rem", borderRadius: 12, marginBottom: "1rem" }}>
            <h3>{t.nombre}</h3>
            <small>{t.etapa}</small>
            <p>{t.contenido}</p>
          </article>
        ))}
      </section>
      <Footer />
    </main>
  );
};

export default Testimonios;
