import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Home.css";

import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import {
  obtenerResumenUserHome,
  listarBebes,
  obtenerTriajeBebe,
} from "../../services/api.js";

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

const leerJSONStorage = (key) => {
  try {
    const value = localStorage.getItem(key) || sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const primerValor = (...values) => {
  return values.find(
    (value) =>
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
  );
};

const normalizarTexto = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const calcularDiasDesdeNacimiento = (fechaNacimiento) => {
  if (!fechaNacimiento) return "Sin registro";

  const raw = String(fechaNacimiento);
  let fecha;

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
    const [dd, mm, yyyy] = raw.split("/");
    fecha = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  } else {
    fecha = new Date(raw);
  }

  if (Number.isNaN(fecha.getTime())) return "Sin registro";

  const hoy = new Date();

  fecha.setHours(0, 0, 0, 0);
  hoy.setHours(0, 0, 0, 0);

  const diffMs = hoy - fecha;
  const dias = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  return `${dias} ${dias === 1 ? "día" : "días"}`;
};

const normalizarNivel = (nivel) => {
  const n = normalizarTexto(nivel);

  if (n.includes("alto")) return "alto";
  if (n.includes("medio") || n.includes("moderado")) return "medio";
  if (n.includes("bajo")) return "bajo";

  return "";
};

const obtenerRiskLabel = (nivel) => {
  const n = normalizarNivel(nivel);

  if (n === "alto") return "Alto";
  if (n === "medio") return "Moderado";
  if (n === "bajo") return "Bajo";

  return "Sin clasificar";
};

const obtenerRiskClass = (nivel) => {
  const n = normalizarNivel(nivel);

  if (n === "alto") return "alto";
  if (n === "medio") return "medio";
  if (n === "bajo") return "bajo";

  return "low";
};

const obtenerProximaEvaluacion = (nivel) => {
  const n = normalizarNivel(nivel);

  if (n === "alto") return "De inmediato";
  if (n === "medio") return "En 24 horas";
  if (n === "bajo") return "Según control";

  return "Según control";
};

const obtenerRecomendacion = (nivel) => {
  const n = normalizarNivel(nivel);

  if (n === "alto") {
    return "El resultado indica un nivel de riesgo alto. Se recomienda acudir de inmediato a un centro de salud o contactar a un profesional médico, sin esperar una nueva evaluación.";
  }

  if (n === "medio") {
    return "El resultado indica un nivel de riesgo moderado. Se recomienda mantener vigilancia cercana, repetir la evaluación en las próximas 24 horas y consultar a un profesional de salud si los signos persisten o aumentan.";
  }

  if (n === "bajo") {
    return "El resultado indica un nivel de riesgo bajo. Se recomienda continuar con los cuidados básicos en casa, mantener la observación diaria y asistir a los controles correspondientes.";
  }

  return "Aún no hay una evaluación registrada. Realiza una evaluación para generar el nivel de riesgo y recibir una recomendación personalizada.";
};

const normalizarUsuario = (data) => {
  if (!data) return null;

  const base = data.usuario || data.user || data.madre || data.cuidador || data;

  const nombre = primerValor(
    base.nombre,
    base.nombreCompleto,
    base.nombre_completo,
    base.nombre_usuario,
    data.nombre,
    data.nombreCompleto,
    data.nombre_completo,
    data.nombre_usuario,
    data.datosPersonales?.nombreCompleto,
    data.datosPersonales?.nombre
  );

  return {
    ...base,
    nombre: nombre || "Usuario",
    nombreCompleto: nombre || "Usuario",
  };
};

const normalizarBebe = (bebe) => {
  if (!bebe) return null;

  const nombreBebe = primerValor(
    bebe.nombreBebe,
    bebe.nombre_bebe,
    bebe.nombre,
    bebe.bebeNombre,
    bebe.bebe_nombre
  );

  const fechaNacimiento = primerValor(
    bebe.fechaNacimiento,
    bebe.fecha_nacimiento,
    bebe.nacimiento
  );

  return {
    ...bebe,
    id: primerValor(bebe.id, bebe.bebeId, bebe.bebe_id),
    madreId: primerValor(bebe.madreId, bebe.madre_id),
    nombreBebe,
    nombre_bebe: nombreBebe,
    fechaNacimiento,
    fecha_nacimiento: fechaNacimiento,
    edadActual:
      primerValor(bebe.edadActual, bebe.edad_actual) ||
      calcularDiasDesdeNacimiento(fechaNacimiento),
    ultimaEvaluacion: bebe.ultimaEvaluacion || bebe.ultima_evaluacion || null,
    madre: bebe.madre || null,
  };
};

const extraerBebes = (data) => {
  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.bebes)) return data.bebes;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.resultados)) return data.resultados;
  if (Array.isArray(data?.data?.bebes)) return data.data.bebes;

  if (data?.ultimoBebe) return [data.ultimoBebe];
  if (data?.bebe) return [data.bebe];

  return [];
};

const extraerEvaluaciones = (data) => {
  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.evaluaciones)) return data.evaluaciones;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.resultados)) return data.resultados;
  if (Array.isArray(data?.data?.evaluaciones)) return data.data.evaluaciones;

  if (data?.ultimaEvaluacion) return [data.ultimaEvaluacion];

  return [];
};

const obtenerUltimoBebe = (data) => {
  const bebes = extraerBebes(data).map(normalizarBebe).filter(Boolean);

  if (bebes.length === 0) return null;

  return [...bebes].sort((a, b) => Number(b.id || 0) - Number(a.id || 0))[0];
};

const obtenerNivelEvaluacion = (evaluacion) => {
  if (!evaluacion) return "";

  const nivel = primerValor(
    evaluacion.nivel,
    evaluacion.nivelRiesgo,
    evaluacion.nivel_riesgo,
    evaluacion.nivelTexto,
    evaluacion.riesgo,
    evaluacion.risk,
    evaluacion.riskLabel
  );

  const n = normalizarTexto(nivel);

  if (n.includes("alto")) return "alto";
  if (n.includes("medio") || n.includes("moderado")) return "medio";
  if (n.includes("bajo")) return "bajo";

  return "";
};

const obtenerFechaEvaluacion = (evaluacion) => {
  if (!evaluacion) return "Sin evaluación previa";

  return (
    evaluacion.fecha ||
    evaluacion.fechaEvaluacion ||
    evaluacion.fecha_evaluacion ||
    evaluacion.createdAt ||
    evaluacion.created_at ||
    "Sin evaluación previa"
  );
};

const ordenarEvaluaciones = (lista) => {
  return [...lista].sort((a, b) => {
    const fechaA = new Date(
      obtenerFechaEvaluacion(a) === "Sin evaluación previa"
        ? 0
        : obtenerFechaEvaluacion(a)
    );

    const fechaB = new Date(
      obtenerFechaEvaluacion(b) === "Sin evaluación previa"
        ? 0
        : obtenerFechaEvaluacion(b)
    );

    const diffFecha = fechaB - fechaA;

    if (diffFecha !== 0) return diffFecha;

    return Number(b.id || 0) - Number(a.id || 0);
  });
};

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [usuario, setUsuario] = useState(() =>
    normalizarUsuario(location.state?.user || leerJSONStorage("neocareUser"))
  );

  const [registro, setRegistro] = useState(() => {
    return (
      location.state?.registro ||
      leerJSONStorage("neocareRegisterData") ||
      leerJSONStorage("neocareRegistro") ||
      null
    );
  });

  const [bebeActual, setBebeActual] = useState(() =>
    normalizarBebe(
      location.state?.bebe ||
        location.state?.user?.bebe ||
        location.state?.registro?.recienNacido ||
        leerJSONStorage("neocareBebe")
    )
  );

  const [evaluations, setEvaluations] = useState([]);
  const [latestEvaluationData, setLatestEvaluationData] = useState(null);
  const [notification, setNotification] = useState(null);

  const [totalBebes, setTotalBebes] = useState(0);
  const [totalEvaluaciones, setTotalEvaluaciones] = useState(0);
  const [seguimientosActivos, setSeguimientosActivos] = useState(0);

  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  useEffect(() => {
    const cargarResumenHome = async () => {
      setCargando(true);
      setErrorCarga("");

      try {
        const dataResumen = await obtenerResumenUserHome();

        console.log("RESPUESTA RESUMEN HOME:", dataResumen);

        const usuarioDB = normalizarUsuario(dataResumen?.usuario);
        const bebeDB = normalizarBebe(dataResumen?.bebe);

        if (usuarioDB) {
          setUsuario(usuarioDB);
          localStorage.setItem("neocareUser", JSON.stringify(usuarioDB));
        }

        if (bebeDB) {
          setBebeActual(bebeDB);
          localStorage.setItem("neocareBebe", JSON.stringify(bebeDB));
        }

        let ultimaEvaluacion =
          dataResumen?.ultimaEvaluacion ||
          dataResumen?.ultima_evaluacion ||
          bebeDB?.ultimaEvaluacion ||
          null;

        let evaluacionesActuales = ultimaEvaluacion ? [ultimaEvaluacion] : [];

        if (bebeDB?.id) {
          try {
            const dataTriaje = await obtenerTriajeBebe(bebeDB.id);

            console.log("RESPUESTA TRIAJE HOME:", dataTriaje);

            const evaluacionesTriaje = extraerEvaluaciones(dataTriaje);
            const ordenadas = ordenarEvaluaciones(evaluacionesTriaje);

            if (ordenadas.length > 0) {
              evaluacionesActuales = ordenadas;
              ultimaEvaluacion = dataTriaje?.ultimaEvaluacion || ordenadas[0];
            }
          } catch (triajeError) {
            console.error("Error consultando triaje desde Home:", triajeError);
          }
        }

        setEvaluations(evaluacionesActuales);
        setLatestEvaluationData(ultimaEvaluacion);

        setTotalBebes(Number(dataResumen?.resumen?.totalBebes || 0));
        setTotalEvaluaciones(
          Number(
            dataResumen?.resumen?.totalEvaluaciones ||
              evaluacionesActuales.length ||
              0
          )
        );
        setSeguimientosActivos(
          Number(dataResumen?.resumen?.seguimientosActivos || 0)
        );
      } catch (error) {
        console.error("Error consultando resumen de Home:", error);
        setErrorCarga(error.message || "No se pudo cargar la información.");

        try {
          const dataBebes = await listarBebes();

          console.log("RESPUESTA BEBES FALLBACK HOME:", dataBebes);

          const listaBebes = extraerBebes(dataBebes);
          const ultimoBebe = obtenerUltimoBebe(dataBebes);

          setTotalBebes(listaBebes.length);
          setSeguimientosActivos(listaBebes.length);

          if (ultimoBebe) {
            setBebeActual(ultimoBebe);
            localStorage.setItem("neocareBebe", JSON.stringify(ultimoBebe));

            if (ultimoBebe.madre?.nombre) {
              const usuarioDesdeBebe = {
                id: ultimoBebe.madre.id || ultimoBebe.madreId,
                nombre: ultimoBebe.madre.nombre,
                nombreCompleto: ultimoBebe.madre.nombre,
                correo: ultimoBebe.madre.correo,
              };

              setUsuario(usuarioDesdeBebe);
              localStorage.setItem(
                "neocareUser",
                JSON.stringify(usuarioDesdeBebe)
              );
            }

            let ultimaFallback = ultimoBebe.ultimaEvaluacion || null;
            let evaluacionesFallback = ultimaFallback ? [ultimaFallback] : [];

            try {
              const dataTriaje = await obtenerTriajeBebe(ultimoBebe.id);

              console.log("RESPUESTA TRIAJE FALLBACK HOME:", dataTriaje);

              const evaluacionesTriaje = extraerEvaluaciones(dataTriaje);
              const ordenadas = ordenarEvaluaciones(evaluacionesTriaje);

              if (ordenadas.length > 0) {
                evaluacionesFallback = ordenadas;
                ultimaFallback = dataTriaje?.ultimaEvaluacion || ordenadas[0];
              }
            } catch (triajeError) {
              console.error("Error consultando triaje fallback:", triajeError);
            }

            setEvaluations(evaluacionesFallback);
            setTotalEvaluaciones(evaluacionesFallback.length);
            setLatestEvaluationData(ultimaFallback);
          }
        } catch (fallbackError) {
          console.error("Error cargando fallback Home:", fallbackError);
        }
      } finally {
        setCargando(false);
      }
    };

    cargarResumenHome();
  }, []);

  useEffect(() => {
    const nivel = obtenerNivelEvaluacion(latestEvaluationData);
    const riskLevel = normalizarNivel(nivel);

    if (!riskLevel) return;

    const today = new Date().toLocaleDateString("en-CA");
    const lastNotified = localStorage.getItem("neocareLastNotif");

    if (lastNotified === today) return;

    if (riskLevel === "alto") {
      setNotification(
        "¡Atención! Se requiere una evaluación de inmediato o acudir a un centro de salud."
      );
    } else if (riskLevel === "medio") {
      setNotification(
        "Recordatorio: debes repetir la evaluación clínica en 24 horas."
      );
    } else {
      setNotification(
        "Recuerda continuar con el seguimiento básico y monitorear los signos vitales del bebé."
      );
    }

    localStorage.setItem("neocareLastNotif", today);
  }, [latestEvaluationData]);

  const userName = useMemo(() => {
    const nombreCompleto =
      usuario?.nombre ||
      usuario?.nombreCompleto ||
      usuario?.nombre_completo ||
      registro?.datosPersonales?.nombreCompleto ||
      registro?.datosPersonales?.nombre ||
      "Usuario";

    return nombreCompleto.trim().split(" ")[0] || "Usuario";
  }, [usuario, registro]);

  const usuarioParaHeader = useMemo(() => {
    return {
      ...(usuario || {}),
      nombre: userName,
      nombreCompleto:
        usuario?.nombreCompleto ||
        usuario?.nombre_completo ||
        usuario?.nombre ||
        userName,
    };
  }, [usuario, userName]);

  const nombreBebe =
    bebeActual?.nombreBebe ||
    bebeActual?.nombre_bebe ||
    bebeActual?.nombre ||
    "Sin registro";

  const edadBebe =
    bebeActual?.edadActual ||
    bebeActual?.edad_actual ||
    calcularDiasDesdeNacimiento(
      bebeActual?.fechaNacimiento || bebeActual?.fecha_nacimiento
    );

  const nivelCrudo = obtenerNivelEvaluacion(latestEvaluationData);

  const riskLabel = latestEvaluationData
    ? obtenerRiskLabel(nivelCrudo)
    : "Sin clasificar";

  const riskClass = obtenerRiskClass(nivelCrudo);

  const nextEvalTime = obtenerProximaEvaluacion(nivelCrudo);

  const fechaUltimaEvaluacion = latestEvaluationData
    ? obtenerFechaEvaluacion(latestEvaluationData)
    : "Sin evaluación previa";

  const recomendacion = obtenerRecomendacion(nivelCrudo);

  const hasActiveTracking = seguimientosActivos > 0 || totalEvaluaciones > 0;

  const handleActivarSeguimiento = () => {
    navigate("/evaluacion", {
      state: {
        user: usuarioParaHeader,
        registro,
        bebe: bebeActual,
      },
    });
  };

  return (
    <main className="home-page-wrapper">
      <Header2
        user={usuarioParaHeader}
        usuario={usuarioParaHeader}
        nombreUsuario={userName}
      />

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

              {cargando && (
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "10px",
                    backgroundColor: "#eef5ff",
                    borderRadius: "8px",
                    borderLeft: "4px solid #2196f3",
                    color: "#0d47a1",
                  }}
                >
                  Cargando datos registrados...
                </div>
              )}

              {!cargando && errorCarga && (
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "10px",
                    backgroundColor: "#fff3e0",
                    borderRadius: "8px",
                    borderLeft: "4px solid #ff9800",
                    color: "#e65100",
                  }}
                >
                  <strong>Aviso:</strong> {errorCarga}
                </div>
              )}

              {notification && (
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "10px",
                    backgroundColor: "#ffeedd",
                    borderRadius: "8px",
                    borderLeft: "4px solid #ff9800",
                    color: "#e65100",
                  }}
                >
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
                    <p>{fechaUltimaEvaluacion}</p>
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
                    <p>{recomendacion}</p>
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
                  <strong>{seguimientosActivos}</strong> seguimiento(s)
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
                  <strong>{totalEvaluaciones}</strong> evaluaciones
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
                        Tu seguimiento neonatal ya se encuentra activo. Continúa
                        registrando la evolución de tu bebé de forma periódica y
                        revisa el historial para estar al tanto.
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