import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Home.css";

import inicioImage from "../../assets/Inicio.png";
import evaluacionImage from "../../assets/evaluacion.png";
import educacionImage from "../../assets/educacion.png";
import historialImage from "../../assets/h.png";
import perfilImage from "../../assets/perfil.png";

import motherBabyImage from "../../assets/DT.png";
import shieldImage from "../../assets/QS.png";
import seguimientoImage from "../../assets/RealizarE.png";
import controlImage from "../../assets/CONTROL.png";
import vacuImage from "../../assets/VACU.png";

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
    image: seguimientoImage,
    label: "Seguimiento",
    path: "/seguimiento",
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
  risk: "medio",
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

  const handleLogout = () => {
    localStorage.removeItem("neocareUser");
    navigate("/login");
  };

  return (
    <main className="home-page">
      <aside className="home-sidebar">
        <div className="home-logo-box">
          <div className="home-logo-mark">
            <span>♡</span>
          </div>

          <h2>
            Neo<span>Care</span>
          </h2>
        </div>

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

          <button
            type="button"
            className="home-sidebar-item settings"
            onClick={() => navigate("/perfil")}
          >
            <span className="home-sidebar-icon-box home-settings-icon">⚙</span>
            Configuración
          </button>
        </nav>

        <button
          type="button"
          className="home-logout-button"
          onClick={handleLogout}
        >
          <span>↪</span>
          Cerrar sesión
        </button>
      </aside>

      <section className="home-main">
        <header className="home-topbar">
          <div />

          <div className="home-user-box">
            <div className="home-avatar">
              <img src={motherBabyImage} alt="Usuario" />
            </div>

            <strong>Hola, {userName}</strong>

            <button
              type="button"
              className="home-exit-button"
              onClick={handleLogout}
              aria-label="Cerrar sesión"
            >
              ↪
            </button>
          </div>
        </header>

        <section className="home-content">
          <section className="home-hero">
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
                src={motherBabyImage}
                alt="Madre sosteniendo a su recién nacido"
                className="home-hero-image"
              />
            </div>
          </section>

          <section className="home-current-card">
            <div className="home-current-main-icon">
              <img src={shieldImage} alt="Seguimiento actual" />
            </div>

            <div className="home-current-content">
              <h2>Seguimiento actual</h2>

              <div className="home-current-data">
                <article className="home-current-item">
                  <span className="home-current-small-icon">♡</span>

                  <div>
                    <h3>Bebé:</h3>
                    <p>{latestEvaluation.baby}</p>
                  </div>
                </article>

                <article className="home-current-item">
                  <span className="home-current-small-icon">▣</span>

                  <div>
                    <h3>Edad actual:</h3>
                    <p>{latestEvaluation.babyAge}</p>
                  </div>
                </article>

                <article className="home-current-item">
                  <span className="home-current-small-icon">◷</span>

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

            <button
              type="button"
              className="home-primary-button"
              onClick={() => navigate("/resultado")}
            >
              Ver último resultado
              <span>›</span>
            </button>
          </section>

          <section className="home-metrics-grid">
            <article className="home-metric-card blue">
              <span className="home-metric-icon">◷</span>

              <div>
                <h3>Próxima evaluación sugerida</h3>
                <strong>En 24 horas</strong>
              </div>
            </article>

            <article className="home-metric-card purple">
              <span className="home-metric-icon">☑</span>

              <div>
                <h3>Seguimiento activo</h3>
                <strong>1 seguimiento</strong>
              </div>
            </article>

            <article className="home-metric-card red">
              <span className="home-metric-icon">▤</span>

              <div>
                <h3>Evaluaciones realizadas</h3>
                <strong>6 evaluaciones</strong>
              </div>
            </article>
          </section>

          <section className="home-middle-grid">
            <article className="home-next-card">
              <h2>Próxima acción recomendada</h2>

              <div className="home-next-content">
                <div className="home-next-icon">
                  <img src={seguimientoImage} alt="Seguimiento diario" />
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
                  <span className="home-access-icon">▣</span>

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
                  <span className="home-access-icon">▥</span>

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
                  <span className="home-access-icon">◷</span>

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
            <article className="home-activity-card">
              <div className="home-activity-icon">
                <span>▤</span>
              </div>

              <div>
                <h2>Última actividad</h2>
                <p>Evaluación realizada el 20 mayo, 2025 — Riesgo medio.</p>
              </div>

              <button
                type="button"
                className="home-outline-button"
                onClick={() => navigate("/historial")}
              >
                Ver historial completo
                <span>›</span>
              </button>
            </article>

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
    </main>
  );
};

export default Home;