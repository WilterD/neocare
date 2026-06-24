import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Home.css";

import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { obtenerTriajeBebe } from "../../services/api.js";

import inicioImage from "../../assets/Inicio.png";
import evaluacionImage from "../../assets/Evaluacion.png";
import educacionImage from "../../assets/Educacion.png";
import historialImage from "../../assets/H.png";
import perfilImage from "../../assets/Perfil.png";

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

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [usuario, setUsuario] = useState(location.state?.user || null);
  const [registro, setRegistro] = useState(location.state?.registro || null);
  const [evaluations, setEvaluations] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchEvaluations = async () => {
      const idBebe =
        usuario?.bebe?.id ||
        registro?.recienNacido?.id ||
        location.state?.bebe?.id;

      if (idBebe) {
        try {
          const triaje = await obtenerTriajeBebe(idBebe);
          const lista =
            triaje && Array.isArray(triaje.evaluaciones)
              ? triaje.evaluaciones
              : [];

          setEvaluations(lista);

          if (lista.length > 0) {
            const sorted = [...lista].sort(
              (a, b) => new Date(b.fecha) - new Date(a.fecha)
            );
            const latest = sorted[0];

            const riskLevel = (latest.nivel || "bajo").toLowerCase();

            // Notification Logic via localStorage
            const today = new Date().toLocaleDateString("en-CA");
            const lastNotified = localStorage.getItem("neocareLastNotif");

            if (lastNotified !== today) {
              if (riskLevel === "alto") {
                setNotification("¡Atención! Se requiere una evaluación de inmediato o acudir a un centro de salud.");
              } else if (riskLevel === "medio") {
                setNotification("Recordatorio: Debes repetir la evaluación clínica en 24 horas.");
              } else {
                setNotification("Recuerda continuar con el seguimiento básico y monitorear los signos vitales del bebé.");
              }
              localStorage.setItem("neocareLastNotif", today);
            }
          }
        } catch (err) {
          console.error("Error al obtener evaluaciones:", err);
        }
      }
    };
    fetchEvaluations();
  }, [usuario, registro, location.state]);

  const userName = useMemo(() => {
    return (
      usuario?.nombre ||
      usuario?.name ||
      usuario?.nombreCompleto?.split(" ")[0] ||
      registro?.datosPersonales?.nombreCompleto?.split(" ")[0] ||
      "Usuario"
    );
  }, [usuario, registro]);

  const recienNacido = registro?.recienNacido || usuario?.recienNacido || {};
  const nombreBebe = recienNacido?.nombreBebe || usuario?.bebe?.nombre || "Sin registro";

  const calcularDiasDesdeNacimiento = () => {
    const fn = recienNacido?.fechaNacimiento;
    if (!fn) return "Sin registro";
    const partes = fn.split("/");
    if (partes.length === 3) {
      const fechaNac = new Date(partes[2], partes[1] - 1, partes[0]);
      const diffMs = new Date() - fechaNac;
      const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      return `${dias} ${dias === 1 ? "día" : "días"}`;
    }
    return fn;
  };

  const sortedEvals = [...evaluations].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const latestEvaluationData = sortedEvals[0] || null;

  const edadBebe = latestEvaluationData?.edad_bebe_evaluacion || recienNacido?.edadActual || calcularDiasDesdeNacimiento();
  
  const riskLabel = latestEvaluationData?.nivel
    ? latestEvaluationData.nivel === "bajo" ? "Riesgo bajo" : latestEvaluationData.nivel === "medio" ? "Riesgo medio" : "Riesgo alto"
    : "Sin clasificar";
  
  const riskClass = latestEvaluationData?.nivel ? latestEvaluationData.nivel.toLowerCase() : "low";

  const nextEvalTime = latestEvaluationData?.nivel === "alto" ? "De inmediato" : latestEvaluationData?.nivel === "medio" ? "En 24 horas" : "Según control";
  
  const activeFollowUps = sortedEvals.filter(e => (e.nivel || "").toLowerCase() !== "bajo").length;

  const hasActiveTracking = evaluations.length > 0;

  const handleActivarSeguimiento = () => {
    navigate("/evaluacion", {
      state: { user: usuario, registro }
    });
  };

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

              {notification && (
                <div style={{ marginTop: "1rem", padding: "10px", backgroundColor: "#ffeedd", borderRadius: "8px", borderLeft: "4px solid #ff9800", color: "#e65100" }}>
                  <strong>Notificación del día:</strong> {notification}
                </div>
              )}
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
                    <p>{nombreBebe}</p>
                  </div>
                </article>

                <article className="home-current-item">
                  <span className="home-current-small-icon">
                    <img src={inicIeImage} alt="Edad actual" />
                  </span>

                  <div>
                    <h3>Edad actual:</h3>
                    <p>{edadBebe}</p>
                  </div>
                </article>

                <article className="home-current-item">
                  <span className="home-current-small-icon">
                    <img src={inicioEvaImage} alt="Última evaluación" />
                  </span>

                  <div>
                    <h3>Última evaluación:</h3>
                    <p>{latestEvaluationData ? latestEvaluationData.fecha : "Sin evaluación previa"}</p>
                  </div>
                </article>

                <article className="home-current-item result">
                  <div>
                    <h3>Resultado más reciente:</h3>

                    <span className={`home-risk-badge ${riskClass}`}>
                      {riskLabel}
                    </span>
                  </div>
                </article>

                <article className="home-current-item recommendation">
                  <div>
                    <h3>Recomendación:</h3>
                    <p>{latestEvaluationData?.recomendacion || "Aún no hay recomendaciones registradas. Realiza una evaluación."}</p>
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
                  <strong>{nextEvalTime}</strong>
                </p>
              </div>
            </article>

            <article className="home-metric-card purple">
              <span className="home-metric-icon image">
                <img src={inicioActImage} alt="Seguimiento activo" />
              </span>

              <div className="home-metric-text">
                <h3>Seguimientos activos</h3>

                <p className="home-metric-value">
                  <strong>{activeFollowUps}</strong> seguimiento(s)
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
                  <strong>{evaluations.length}</strong> evaluaciones
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
                  {hasActiveTracking ? (
                    <>
                      <h3>Seguimiento activo</h3>
                      <p>
                        Tu seguimiento neonatal ya se encuentra activo. Continúa registrando 
                        la evolución de tu bebé de forma periódica y revisa el historial 
                        para estar al tanto.
                      </p>
                      <button
                        type="button"
                        className="home-orange-button"
                        style={{ backgroundColor: "#8c52ff" }}
                        onClick={() => navigate("/historial")}
                      >
                        Ver mi historial
                        <span>›</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <h3>Activa el seguimiento diario</h3>
                      <p>
                        Registra la evolución del bebé para observar
                        alimentación, temperatura, respiración, actividad,
                        coloración de la piel y otros signos vitales.
                      </p>

                      <button
                        type="button"
                        className="home-orange-button"
                        onClick={handleActivarSeguimiento}
                      >
                        Activar seguimiento
                        <span>›</span>
                      </button>
                    </>
                  )}
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