import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import SidebarNeoCare from "../../components/SidebarNeoCare/SidebarNeoCare.jsx";
import { obtenerContenidoEducativo } from "../../services/api.js";
import { imagenPorTema } from "../../utils/educacionHelpers.js";
import flechImage from "../../assets/FLECH.png";
import "./TopicDetail.css";

const TopicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState(location.state?.user || null);
  const [contenido, setContenido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    try {
      const storedUser = localStorage.getItem("neocareUser");
      if (storedUser && !usuario) setUsuario(JSON.parse(storedUser));
    } catch (e) {
      console.error(e);
    }
  }, [usuario]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    obtenerContenidoEducativo(id)
      .then((d) => setContenido(d.contenido))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const renderShell = (children) => (
    <main className="topic-detail-page">
      <Header2 user={usuario} />
      <section className="topic-detail-desktop">
        <SidebarNeoCare className="topic-detail" activePath="/educacion" />
        <div className="topic-detail-main-panel">{children}</div>
      </section>
      <Footer />
    </main>
  );

  if (loading) {
    return renderShell(
      <div className="topic-detail-container topic-loading">
        <p>Cargando contenido educativo...</p>
      </div>
    );
  }

  if (error || !contenido) {
    return renderShell(
      <div className="topic-detail-container error-state">
        <h2>Tema no encontrado</h2>
        <p>{error || "No se pudo cargar este tema."}</p>
        <button type="button" className="neo-btn-primary" onClick={() => navigate("/educacion")}>
          Ir a contenido educativo
        </button>
      </div>
    );
  }

  const image = imagenPorTema(contenido.tema);
  const nivelAlerta = String(contenido.nivel_alerta || "").toLowerCase();

  return renderShell(
    <div className="topic-detail-container">
      <article className="topic-content-card">
        <button
          type="button"
          className="topic-back-button"
          onClick={() => navigate("/educacion")}
        >
          <img src={flechImage} alt="" className="topic-back-icon" aria-hidden="true" />
          Volver al contenido
        </button>

        <header className="topic-header">
          <div className="topic-header-text">
            <span className="topic-category-pill">{contenido.tema}</span>
            <h1>{contenido.titulo}</h1>
            <p>{contenido.descripcion}</p>
            {contenido.nivel_alerta && (
              <span className={`topic-alert-badge ${nivelAlerta}`}>
                Nivel: {contenido.nivel_alerta}
              </span>
            )}
            {contenido.fuente_referencia && (
              <p className="topic-source">
                <span className="source-label">Fuente:</span>{" "}
                {contenido.fuente_referencia}
              </p>
            )}
          </div>

          <div className="topic-header-image-box">
            <img
              src={image}
              alt={contenido.titulo}
              className="topic-header-image"
            />
          </div>
        </header>

        <div className="topic-body">
          {contenido.recomendacion && (
            <section className="topic-alert-box">
              <div className="topic-alert-icon">!</div>
              <div className="topic-alert-content">
                <h4>Recomendación</h4>
                <p>{contenido.recomendacion}</p>
              </div>
            </section>
          )}

          {contenido.url_recurso && (
            <a
              href={contenido.url_recurso}
              target="_blank"
              rel="noreferrer"
              className="topic-external-link"
            >
              Ver recurso externo →
            </a>
          )}
        </div>
      </article>
    </div>
  );
};

export default TopicDetail;
