import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Home.css";

import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import inicioImage from "../../assets/Inicio.png";
import evaluacionImage from "../../assets/evaluacion.png";
import educacionImage from "../../assets/educacion.png";
import historialImage from "../../assets/h.png";
import perfilImage from "../../assets/perfil.png";

import dtImage from "../../assets/DT.png";
import seguirImage from "../../assets/SEGUIR.png";
import inicioEvaImage from "../../assets/INICIOEVA.png";
import inicIeImage from "../../assets/INICIE.png";
import inicioUImage from "../../assets/INICIOU.png";
import libretaImage from "../../assets/Libreta.png";
import tvrImage from "../../assets/TVR.png";
import inicioActImage from "../../assets/INICIOACT.png";
import inicioProxiImage from "../../assets/INICIOPROXI.png";
import tablaImage from "../../assets/TABLA.png";
import controlImage from "../../assets/DUDA.png";

const sidebarItems = [
  {
    image: inicioImage,
    label: "Inicio",
    path: "/inicio",
  },
  {
    image: evaluacionImage,
    label: "Evaluación",
    path: "/evaluacion",
  },
  {
    image: educacionImage,
    label: "Educación",
    path: "/educacion",
  },
  {
    image: historialImage,
    label: "Historial",
    path: "/historial",
  },
  {
    image: perfilImage,
    label: "Perfil",
    path: "/perfil",
  },
];

const latestEvaluation = {
  baby: "Mateo",
  babyAge: "12 días",
  lastDate: "20 mayo, 2025",
  riskLabel: "Riesgo medio",
  recommendation: "Mantener vigilancia y repetir evaluación en 24 horas.",
};

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [usuario, setUsuario] = useState(location.state?.user || null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("neocareUser");

      if (storedUser && !usuario) {
        setUsuario(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error al cargar usuario:", error);
    }
  }, [usuario]);

  const userName = useMemo(() => {
    return (
      usuario?.nombre ||
      usuario?.name ||
      usuario?.nombreCompleto?.split(" ")[0] ||
      "Elimar"
    );
  }, [usuario]);

  return (
    <main className="home-page-wrapper">
      <Header2 user={usuario} />

      <section className="home-desktop">
        <aside className="home-sidebar">
          <nav className="home-sidebar-nav">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === "/inicio"}
                className={({ isActive }) =>
                  isActive ? "home-sidebar-item active" : "home-sidebar-item"
                }
              >
                <span className="home-sidebar-icon-box">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="home-sidebar-icon"
                  />
                </span>

                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <section className="home-main-panel">
          <section className="home-hero-section">
            <div className="home-hero-text">
              <h1>¡Bienvenida, {userName}!</h1>

              <h2>Tu espacio de apoyo para el seguimiento neonatal en casa.</h2>

              <p>
                Desde aquí puedes revisar el estado actual del recién nacido,
                continuar una evaluación, activar seguimiento diario y consultar
                contenido educativo para el cuidado durante sus primeros 28 días
                de vida.
              </p>
            </div>

            <div className="home-hero-image-box">
              <img
                src={dtImage}
                alt="Madre con recién nacido"
                className="home-hero-image"
              />
            </div>
          </section>

          <section className="home-current-card">
            <div className="home-current-main-icon">
              <img src={seguirImage} alt="Seguimiento actual" />
            </div>

            <div className="home-current-content">
              <h2>Seguimiento actual</h2>

              <div className="home-current-data">
                <article className="home-current-item">
                  <span className="home-current-small-icon baby">
                    <img src={inicioUImage} alt="Bebé" />
                  </span>

                  <div>
                    <h3>Bebé:</h3>
                    <p>{latestEvaluation.baby}</p>
                  </div>
                </article>

                <article className="home-current-item">
                  <span className="home-current-small-icon">
                    <img src={inicIeImage} alt="Edad actual" />
                  </span>

                  <div>
                    <h3>Edad actual:</h3>
                    <p>{latestEvaluation.babyAge}</p>
                  </div>
                </article>

                <article className="home-current-item">
                  <span className="home-current-small-icon">
                    <img src={inicioEvaImage} alt="Última evaluación" />
                  </span>

                  <div>
                    <h3>Última evaluación:</h3>
                    <p>{latestEvaluation.lastDate}</p>
                  </div>
                </article>

                <article className="home-current-item result">
                  <div>
                    <h3>Resultado más reciente:</h3>

                    <span className="home-risk-badge medium">
                      {latestEvaluation.riskLabel}
                    </span>
                  </div>
                </article>

                <article className="home-current-item recommendation">
                  <div>
                    <h3>Recomendación:</h3>
                    <p>{latestEvaluation.recommendation}</p>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section className="home-metrics-grid">
            <article className="home-metric-card blue">
              <span className="home-metric-icon image proxi">
                <img
                  src={inicioProxiImage}
                  alt="Próxima evaluación sugerida"
                />
              </span>

              <div className="home-metric-text">
                <h3>Próxima evaluación sugerida</h3>

                <p className="home-metric-value">
                  En <strong>24</strong> horas
                </p>
              </div>
            </article>

            <article className="home-metric-card purple">
              <span className="home-metric-icon image">
                <img src={inicioActImage} alt="Seguimiento activo" />
              </span>

              <div className="home-metric-text">
                <h3>Seguimiento activo</h3>

                <p className="home-metric-value">
                  <strong>1</strong> seguimiento
                </p>
              </div>
            </article>

            <article className="home-metric-card red">
              <span className="home-metric-icon image">
                <img src={tablaImage} alt="Evaluaciones realizadas" />
              </span>

              <div className="home-metric-text">
                <h3>Evaluaciones realizadas</h3>

                <p className="home-metric-value">
                  <strong>6</strong> evaluaciones
                </p>
              </div>
            </article>
          </section>

          <section className="home-middle-grid">
            <article className="home-next-card">
              <h2>Próxima acción recomendada</h2>

              <div className="home-next-content">
                <div className="home-next-icon">
                  <img src={inicIeImage} alt="Activar seguimiento diario" />
                </div>

                <div className="home-next-text">
                  <h3>Activa el seguimiento diario</h3>

                  <p>
                    Registra durante 5 días la evolución del bebé para observar
                    alimentación, temperatura, respiración, actividad,
                    coloración de la piel, eliminación y signos de alarma.
                  </p>

                  <button
                    type="button"
                    className="home-orange-button"
                    onClick={() => navigate("/seguimiento")}
                  >
                    Activar seguimiento
                    <span>›</span>
                  </button>
                </div>
              </div>
            </article>

            <article className="home-access-card">
              <h2>Accesos útiles</h2>

              <div className="home-access-grid">
                <button
                  type="button"
                  className="home-access-item green"
                  onClick={() => navigate("/evaluacion")}
                >
                  <span className="home-access-icon image">
                    <img src={tvrImage} alt="Realizar nueva evaluación" />
                  </span>

                  <h3>Realizar nueva evaluación</h3>

                  <p>
                    Actualiza la información del bebé y genera un nuevo
                    resultado.
                  </p>

                  <span className="home-access-arrow">›</span>
                </button>

                <button
                  type="button"
                  className="home-access-item purple"
                  onClick={() => navigate("/educacion")}
                >
                  <span className="home-access-icon image">
                    <img
                      src={libretaImage}
                      alt="Consultar contenido educativo"
                    />
                  </span>

                  <h3>Consultar contenido educativo</h3>

                  <p>
                    Accede a guías sobre signos de alarma, lactancia,
                    temperatura y cuidados básicos.
                  </p>

                  <span className="home-access-arrow">›</span>
                </button>

                <button
                  type="button"
                  className="home-access-item blue"
                  onClick={() => navigate("/historial")}
                >
                  <span className="home-access-icon image history">
                    <img src={inicioProxiImage} alt="Ver historial" />
                  </span>

                  <h3>Ver historial</h3>

                  <p>
                    Revisa evaluaciones anteriores y cambios en el seguimiento.
                  </p>

                  <span className="home-access-arrow">›</span>
                </button>
              </div>
            </article>
          </section>

          <section className="home-bottom-grid">
            <article className="home-reminder-card">
              <div className="home-reminder-image">
                <img src={controlImage} alt="Recuerda" />
              </div>

              <div>
                <h2>Recuerda</h2>

                <p>
                  NeoCare brinda orientación inicial y apoyo educativo, pero no
                  reemplaza la atención médica profesional. Ante signos de
                  alarma o dudas sobre la salud del recién nacido, acude al
                  centro de salud más cercano.
                </p>
              </div>
            </article>
          </section>
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default Home;