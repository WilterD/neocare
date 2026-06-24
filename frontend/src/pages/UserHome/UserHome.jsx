import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./UserHome.css";

import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { obtenerTriajeBebe } from "../../services/api.js";

import inicioImage from "../../assets/Inicio.png";
import evaluacionImage from "../../assets/Evaluacion.png";
import educacionImage from "../../assets/Educacion.png";
import historialImage from "../../assets/H.png";
import perfilImage from "../../assets/Perfil.png";

import datosBebeImage from "../../assets/DatosBebe.png";
import edadImage from "../../assets/EdadB.png";
import calendarioImage from "../../assets/Edad.png";
import riesgoImage from "../../assets/AR.png";
import qsImage from "../../assets/USER.png";
import realizarEImage from "../../assets/RealizarE.png";

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

const UserHome = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [usuario, setUsuario] = useState(location.state?.user || null);
  const [registro, setRegistro] = useState(location.state?.registro || null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("neocareUser");
      const storedRegisterData = localStorage.getItem("neocareRegisterData");

      if (storedUser && !usuario) {
        setUsuario(JSON.parse(storedUser));
      }

      if (storedRegisterData && !registro) {
        setRegistro(JSON.parse(storedRegisterData));
      }
    } catch (error) {
      console.error("Error al cargar datos de inicio:", error);
    }
  }, [usuario, registro]);

  const datosPersonales =
    registro?.datosPersonales || usuario?.datosPersonales || {};

  const recienNacido = registro?.recienNacido || usuario?.recienNacido || {};

  const [latestEvaluation, setLatestEvaluation] = useState(null);
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

          if (lista.length > 0) {
            const sorted = lista.sort(
              (a, b) => new Date(b.fecha) - new Date(a.fecha)
            );
            const latest = sorted[0];

            const fechaTxt = latest.fecha || "";
            const [datePart, timePart] = fechaTxt.includes(" ")
              ? fechaTxt.split(" ")
              : [fechaTxt, ""];

            const evalData = {
              date: datePart,
              time: timePart,
              risk: (latest.nivel || "bajo").toLowerCase(),
              riskLabel:
                latest.nivel === "bajo"
                  ? "Riesgo bajo"
                  : latest.nivel === "medio"
                  ? "Riesgo medio"
                  : latest.nivel === "alto"
                  ? "Riesgo alto"
                  : "Sin clasificar",
              recommendation: latest.recomendacion || "Sin recomendación",
              babyAge: latest.edad_bebe_evaluacion || "Sin registro",
            };

            setLatestEvaluation(evalData);

            // Notification Logic via localStorage
            const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
            const lastNotified = localStorage.getItem("neocareLastNotif");

            if (lastNotified !== today) {
              if (evalData.risk === "alto") {
                setNotification("¡Atención! Se requiere una evaluación de inmediato o acudir a un centro de salud.");
              } else if (evalData.risk === "medio") {
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

  const nombreCompleto =
    usuario?.nombre ||
    usuario?.nombreCompleto ||
    datosPersonales?.nombreCompleto ||
    "usuaria";

  const primerNombre = nombreCompleto.trim().split(" ")[0];

  const nombreBebe = recienNacido?.nombreBebe || usuario?.bebe?.nombre || "Sin registro";
  
  // Si tenemos la evaluación, mostramos la edad que tenía al momento de la evaluación.
  // Sino, si recién se registró, calculamos los días desde que nació.
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
  
  const edadBebe = latestEvaluation?.babyAge || recienNacido?.edadActual || calcularDiasDesdeNacimiento();

  const handleContinuarSeguimiento = () => {
    navigate("/evaluacion", {
      state: {
        user: usuario,
        registro,
      },
    });
  };

  return (
    <main className="user-home-page-wrapper">
      <Header2 user={usuario} />

      <section className="user-home-desktop">
        <aside className="user-home-sidebar">
          <nav className="user-home-sidebar-nav">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === "/inicio"}
                className={({ isActive }) =>
                  isActive
                    ? "user-home-sidebar-item active"
                    : "user-home-sidebar-item"
                }
              >
                <span className="user-home-sidebar-icon-box">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="user-home-sidebar-icon"
                  />
                </span>

                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <section className="user-home-main-panel">
          <section className="user-home-hero-card">
            <div className="user-home-hero-text">
              <h2>
                Bienvenida a <span>NeoCare</span>, {primerNombre}
              </h2>

              <h3>Tu espacio de apoyo para el seguimiento neonatal en casa.</h3>

              <p>
                Continúa el cuidado de tu bebé con orientación clara, registro
                organizado y recomendaciones de seguimiento durante sus primeros
                28 días de vida.
              </p>

              {notification && (
                <div className="user-home-notification">
                  <strong>Notificación del día:</strong> {notification}
                </div>
              )}

              <div className="user-home-hero-actions">
                <button
                  type="button"
                  className="user-home-main-button"
                  onClick={handleContinuarSeguimiento}
                >
                  <img
                    src={realizarEImage}
                    alt="Continuar seguimiento"
                    className="user-home-main-button-icon"
                  />
                  <span>Continuar seguimiento</span>
                </button>

                <button
                  type="button"
                  className="user-home-secondary-button"
                  onClick={() => navigate("/educacion")}
                >
                  Ver contenido educativo
                </button>
              </div>
            </div>

            <div className="user-home-hero-image-box">
              <img
                src={qsImage}
                alt="Seguimiento neonatal"
                className="user-home-hero-image"
              />
            </div>
          </section>

          <section className="user-home-current-card">
            <div className="user-home-current-title">
              <span className="user-home-current-title-icon">▥</span>

              <div>
                <h2>Seguimiento actual</h2>
                <p>
                  Consulta el estado más reciente del recién nacido y revisa la
                  recomendación generada por la última evaluación.
                </p>
              </div>
            </div>

            <div className="user-home-current-info">
              <article>
                <img src={datosBebeImage} alt="Bebé" />
                <div>
                  <span>Bebé</span>
                  <strong>{nombreBebe}</strong>
                </div>
              </article>

              <article>
                <img src={edadImage} alt="Edad" />
                <div>
                  <span>Edad</span>
                  <strong>{edadBebe}</strong>
                </div>
              </article>

              <article>
                <img src={calendarioImage} alt="Última evaluación" />
                <div>
                  <span>Última evaluación</span>
                  <strong>{latestEvaluation ? `${latestEvaluation.date} ${latestEvaluation.time}` : "Sin evaluación previa"}</strong>
                </div>
              </article>

              <article>
                <img src={riesgoImage} alt="Nivel de seguimiento" />
                <div>
                  <span>Nivel de seguimiento</span>
                  <strong className={`user-home-risk-pill ${latestEvaluation?.risk || 'low'}`}>
                    {latestEvaluation?.riskLabel || "Sin clasificar"}
                  </strong>
                </div>
              </article>
            </div>

            <div className="user-home-current-recommendation">
              <span>⚠</span>
              <p>
                <strong>Recomendación:</strong> {latestEvaluation?.recommendation || "Aún no hay recomendaciones registradas. Te invitamos a realizar una evaluación."}
              </p>
            </div>

            <button
              type="button"
              className="user-home-result-button"
              onClick={() => navigate("/evaluacion")}
            >
              Ver resultado completo
            </button>
          </section>

          <section className="user-home-actions-card">
            <div className="user-home-actions-header">
              <h2>Próximas acciones sugeridas</h2>
              <p>
                Estas recomendaciones se generan según el último seguimiento
                registrado.
              </p>
            </div>

            <div className="user-home-actions-grid">
              <article className="user-home-suggestion-card">
                <h3>Repetir evaluación en 3 días</h3>
                <p>
                  Actualiza la información del bebé para mantener un seguimiento
                  oportuno.
                </p>
              </article>

              <article className="user-home-suggestion-card">
                <h3>Vigilar signos de alarma</h3>
                <p>
                  Observa fiebre, hipotermia, dificultad respiratoria, ictericia
                  o rechazo alimentario.
                </p>
              </article>

              <article className="user-home-suggestion-card">
                <h3>Mantener cuidados básicos</h3>
                <p>
                  Revisa alimentación, temperatura, higiene y comportamiento
                  general del recién nacido.
                </p>
              </article>

              <article className="user-home-suggestion-card">
                <h3>Acudir a un centro de salud si hay cambios</h3>
                <p>
                  Si notas señales de alarma o tienes dudas, solicita atención
                  médica profesional.
                </p>
              </article>
            </div>
          </section>

          <section className="user-home-reminder-card">
            <h2>Recuerda</h2>
            <p>
              NeoCare brinda orientación inicial y apoyo educativo, pero no
              reemplaza la atención médica profesional. Si observas signos de
              alarma o tienes dudas sobre la salud del recién nacido, acude a un
              centro de salud.
            </p>
          </section>
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default UserHome;