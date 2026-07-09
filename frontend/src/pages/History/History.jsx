import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./History.css";

import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import {
  listarBebes,
  obtenerTriajeBebe,
  obtenerResumenUserHome,
} from "../../services/api.js";

import inicioImage from "../../assets/Inicio.png";
import evaluacionImage from "../../assets/Evaluacion.png";
import educacionImage from "../../assets/Educacion.png";
import historialImage from "../../assets/H.png";
import perfilImage from "../../assets/Perfil.png";

import bebeImage from "../../assets/BEBE.png";
import uImage from "../../assets/U.png";
import srImage from "../../assets/SR.png";
import horarioImage from "../../assets/HORARIO.png";
import inicioActImage from "../../assets/INICIOACT.png";
import recienteImage from "../../assets/RECIENTE.png";
import tvrImage from "../../assets/TVR.png";
import inicioProxiImage from "../../assets/INICIOPROXI.png";
import erImage from "../../assets/ER.png";
import tsvImage from "../../assets/TSV.png";
import tsrImage from "../../assets/TSR.png";
import tsaImage from "../../assets/TSA.png";

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

const riskFilters = [
  {
    id: "todos",
    label: "Todos",
  },
  {
    id: "bajo",
    label: "Bajo",
  },
  {
    id: "medio",
    label: "Medio",
  },
  {
    id: "alto",
    label: "Alto",
  },
];

const normalizeText = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const normalizarNivel = (nivel) => {
  const n = normalizeText(nivel);

  if (n.includes("alto")) return "alto";
  if (n.includes("medio") || n.includes("moderado")) return "medio";
  if (n.includes("bajo")) return "bajo";

  return "";
};

const getRiskWeight = (risk) => {
  if (risk === "bajo") return 1;
  if (risk === "medio") return 2;
  if (risk === "alto") return 3;

  return 0;
};

const getRiskClass = (risk) => {
  if (risk === "bajo") return "low";
  if (risk === "medio") return "medium";
  if (risk === "alto") return "high";

  return "medium";
};

const getRiskLabel = (risk) => {
  if (risk === "bajo") return "Riesgo bajo";
  if (risk === "medio") return "Riesgo medio";
  if (risk === "alto") return "Riesgo alto";

  return "Sin registro";
};

const getTrackingImage = (risk) => {
  if (risk === "bajo") return tsvImage;
  if (risk === "medio") return tsaImage;
  if (risk === "alto") return tsrImage;

  return tsaImage;
};

const obtenerRecomendacionPorNivel = (nivel) => {
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

  return "Aún no hay recomendaciones registradas.";
};

const leerJSONStorage = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const parseDateValue = (value) => {
  if (!value) return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  const texto = String(value).trim();

  if (!texto) return null;

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
    const [dia, mes, anio] = texto.split("/");
    return new Date(Number(anio), Number(mes) - 1, Number(dia));
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    const [anio, mes, dia] = texto.split("-");
    return new Date(Number(anio), Number(mes) - 1, Number(dia));
  }

  const fecha = new Date(texto);

  if (Number.isNaN(fecha.getTime())) return null;

  return fecha;
};

const formatDateTime = (value) => {
  const fecha = parseDateValue(value);

  if (!fecha) {
    return {
      date: "Sin registro",
      time: "",
      createdAt: "",
    };
  }

  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();

  const horas = String(fecha.getHours()).padStart(2, "0");
  const minutos = String(fecha.getMinutes()).padStart(2, "0");

  const tieneHora =
    !String(value).match(/^\d{4}-\d{2}-\d{2}$/) &&
    !String(value).match(/^\d{2}\/\d{2}\/\d{4}$/);

  return {
    date: `${dia}/${mes}/${anio}`,
    time: tieneHora ? `${horas}:${minutos}` : "",
    createdAt: fecha.toISOString(),
  };
};

const calcularDiasDesdeNacimiento = (fechaNacimiento) => {
  const fecha = parseDateValue(fechaNacimiento);

  if (!fecha) return "Sin registro";

  const hoy = new Date();

  fecha.setHours(0, 0, 0, 0);
  hoy.setHours(0, 0, 0, 0);

  const diffMs = hoy - fecha;
  const dias = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  return `${dias} ${dias === 1 ? "día" : "días"}`;
};

const normalizarBebe = (bebe) => {
  if (!bebe) return null;

  const id = bebe.id || bebe.bebeId || bebe.bebe_id;

  const nombre =
    bebe.nombreBebe ||
    bebe.nombre_bebe ||
    bebe.nombre ||
    bebe.nombreBebeRegistro ||
    "Tu bebé";

  const fechaNacimiento =
    bebe.fechaNacimiento || bebe.fecha_nacimiento || bebe.fecha;

  const edadActual =
    bebe.edadActual ||
    bebe.edad_actual ||
    calcularDiasDesdeNacimiento(fechaNacimiento);

  return {
    id,
    nombre,
    fechaNacimiento,
    edadActual,
    sexo: bebe.sexo || "",
    pesoAlNacer: bebe.pesoAlNacer || bebe.peso_al_nacer || "",
    edadGestacional: bebe.edadGestacional || bebe.edad_gestacional || "",
    tipoParto: bebe.tipoParto || bebe.tipo_parto || "",
    raw: bebe,
  };
};

const extraerBebes = (respuesta) => {
  if (!respuesta) return [];

  const posibles =
    respuesta.bebes ||
    respuesta.data?.bebes ||
    respuesta.registros ||
    respuesta.data ||
    [];

  if (!Array.isArray(posibles)) return [];

  return posibles.map(normalizarBebe).filter(Boolean);
};

const obtenerFechaEvaluacion = (evaluacion) => {
  return (
    evaluacion?.fechaEvaluacion ||
    evaluacion?.fecha_evaluacion ||
    evaluacion?.fecha ||
    evaluacion?.createdAt ||
    evaluacion?.creado_en ||
    ""
  );
};

const obtenerPuntaje = (evaluacion) => {
  const puntaje =
    evaluacion?.puntuacion ??
    evaluacion?.puntuacionTotal ??
    evaluacion?.puntuacion_total ??
    evaluacion?.puntaje ??
    evaluacion?.puntaje_total ??
    null;

  if (puntaje === null || puntaje === undefined || puntaje === "") {
    return "Sin puntaje";
  }

  return `${puntaje} pts`;
};

const obtenerTipoEvaluacion = (evaluacion, riesgo) => {
  const tipo = normalizeText(evaluacion?.tipo || evaluacion?.tipo_evaluacion);

  if (tipo.includes("registro")) return "Evaluación inicial";

  if (riesgo === "alto") return "Atención prioritaria";
  if (riesgo === "medio") return "Seguimiento clínico";
  if (riesgo === "bajo") return "Seguimiento básico";

  return "Sin registro";
};

const normalizarEvaluacion = (evaluacion, bebeActual) => {
  if (!evaluacion) return null;

  const nivelOriginal =
    evaluacion.nivel ||
    evaluacion.nivelRiesgo ||
    evaluacion.nivel_riesgo ||
    evaluacion.nivelTexto ||
    evaluacion.clasificacion_final ||
    evaluacion.resultado ||
    "";

  const riesgo = normalizarNivel(nivelOriginal);

  const fechaRaw = obtenerFechaEvaluacion(evaluacion);
  const fechaInfo = formatDateTime(fechaRaw);

  const recomendacion =
    evaluacion.recomendacion ||
    evaluacion.recomendaciones ||
    evaluacion.recomendacion_seguimiento ||
    obtenerRecomendacionPorNivel(riesgo);

  const trackingType = obtenerTipoEvaluacion(evaluacion, riesgo);

  const id =
    evaluacion.id ||
    `${trackingType}-${fechaInfo.createdAt || Math.random().toString(36)}`;

  return {
    id,
    original: evaluacion,
    createdAt: fechaInfo.createdAt,
    date: fechaInfo.date,
    time: fechaInfo.time,
    baby: bebeActual?.nombre || "Tu bebé",
    babyAge: bebeActual?.edadActual || "Sin registro",
    score: obtenerPuntaje(evaluacion),
    risk: riesgo || "sin-registro",
    riskLabel: riesgo ? getRiskLabel(riesgo) : "Sin registro",
    trackingType,
    recommendation: recomendacion,
  };
};

const deduplicarEvaluaciones = (evaluaciones) => {
  const mapa = new Map();

  evaluaciones.forEach((evaluacion) => {
    if (!evaluacion) return;

    const tipo =
      normalizeText(evaluacion.original?.tipo || evaluacion.original?.tipo_evaluacion) ||
      normalizeText(evaluacion.trackingType);

    const key = `${tipo}-${evaluacion.id}-${evaluacion.createdAt}`;

    if (!mapa.has(key)) {
      mapa.set(key, evaluacion);
    }
  });

  return Array.from(mapa.values());
};

const History = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [usuario, setUsuario] = useState(location.state?.user || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeRisk, setActiveRisk] = useState("todos");
  const [selectedBabyId, setSelectedBabyId] = useState("");
  const [sortOrder, setSortOrder] = useState("recientes");
  const [evaluations, setEvaluations] = useState([]);
  const [loadingEvaluations, setLoadingEvaluations] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [bebes, setBebes] = useState([]);
  const [bebeActual, setBebeActual] = useState(null);

  const cargarDatosHistorial = async (babyIdForzado = "") => {
    try {
      setLoadingEvaluations(true);
      setLoadError(null);

      const usuarioStorage = leerJSONStorage("neocareUser");

      let resumen = null;
      let listaBebesRespuesta = null;

      try {
        resumen = await obtenerResumenUserHome();
        console.log("RESPUESTA RESUMEN HISTORY:", resumen);
      } catch (error) {
        console.error("No se pudo cargar resumen de History:", error);
      }

      try {
        listaBebesRespuesta = await listarBebes();
        console.log("RESPUESTA BEBES HISTORY:", listaBebesRespuesta);
      } catch (error) {
        console.error("No se pudo cargar lista de bebés:", error);
      }

      const usuarioFinal =
        resumen?.usuario ||
        location.state?.user ||
        usuarioStorage ||
        usuario ||
        null;

      if (usuarioFinal) {
        setUsuario(usuarioFinal);
      }

      const bebeResumen = normalizarBebe(
        resumen?.bebe ||
          resumen?.ultimoBebe ||
          resumen?.usuario?.bebe ||
          location.state?.user?.bebe ||
          usuarioStorage?.bebe
      );

      const listaBebes = extraerBebes(listaBebesRespuesta);

      const bebesCombinados = [...listaBebes];

      if (
        bebeResumen &&
        !bebesCombinados.some(
          (bebe) => String(bebe.id) === String(bebeResumen.id)
        )
      ) {
        bebesCombinados.unshift(bebeResumen);
      }

      const idObjetivo =
        babyIdForzado ||
        selectedBabyId ||
        bebeResumen?.id ||
        bebesCombinados[0]?.id ||
        "";

      const bebeElegido =
        bebesCombinados.find(
          (bebe) => String(bebe.id) === String(idObjetivo)
        ) ||
        bebeResumen ||
        bebesCombinados[0] ||
        null;

      setBebes(bebesCombinados);
      setBebeActual(bebeElegido);

      if (bebeElegido?.id) {
        setSelectedBabyId(String(bebeElegido.id));
      }

      if (!bebeElegido?.id) {
        setEvaluations([]);
        return;
      }

      let triaje = null;

      try {
        triaje = await obtenerTriajeBebe(bebeElegido.id);
        console.log("RESPUESTA TRIAJE HISTORY:", triaje);
      } catch (error) {
        console.error("No se pudo cargar triaje en History:", error);
      }

      const evaluacionesCrudas = [];

      const resumenPerteneceAlBebe =
        String(resumen?.bebe?.id || resumen?.ultimaEvaluacion?.bebeId || resumen?.ultimaEvaluacion?.bebe_id || "") ===
          String(bebeElegido.id) ||
        !resumen?.bebe?.id;

      if (resumenPerteneceAlBebe) {
        if (Array.isArray(resumen?.evaluaciones)) {
          evaluacionesCrudas.push(...resumen.evaluaciones);
        }

        if (resumen?.ultimaEvaluacion) {
          evaluacionesCrudas.push(resumen.ultimaEvaluacion);
        }

        if (resumen?.bebe?.ultimaEvaluacion) {
          evaluacionesCrudas.push(resumen.bebe.ultimaEvaluacion);
        }
      }

      if (Array.isArray(triaje?.evaluaciones)) {
        evaluacionesCrudas.push(
          ...triaje.evaluaciones.map((evaluacion) => ({
            ...evaluacion,
            tipo: evaluacion.tipo || "triaje",
            tipo_evaluacion: evaluacion.tipo_evaluacion || "triaje",
          }))
        );
      }

      const normalizadas = deduplicarEvaluaciones(
        evaluacionesCrudas
          .map((evaluacion) => normalizarEvaluacion(evaluacion, bebeElegido))
          .filter(Boolean)
      );

      setEvaluations(normalizadas);
    } catch (error) {
      console.error("Error al cargar historial:", error);
      setLoadError(error.message || "Error desconocido");
      setEvaluations([]);
    } finally {
      setLoadingEvaluations(false);
    }
  };

  useEffect(() => {
    cargarDatosHistorial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const babyOptions = useMemo(() => {
    if (bebes.length > 0) return bebes;

    if (bebeActual) return [bebeActual];

    return [
      {
        id: "sin-registro",
        nombre: "Tu bebé",
      },
    ];
  }, [bebes, bebeActual]);

  const selectedBabyEvaluations = evaluations;

  const nombreBebeReal = bebeActual?.nombre || "Sin registro";

  const edadBebeReal =
    bebeActual?.edadActual ||
    calcularDiasDesdeNacimiento(bebeActual?.fechaNacimiento) ||
    "Sin registro";

  const sortedEvaluations = useMemo(() => {
    const evaluationsCopy = [...selectedBabyEvaluations];

    return evaluationsCopy.sort((a, b) => {
      const fechaA = parseDateValue(a.createdAt);
      const fechaB = parseDateValue(b.createdAt);

      const tiempoA = fechaA ? fechaA.getTime() : 0;
      const tiempoB = fechaB ? fechaB.getTime() : 0;

      if (sortOrder === "antiguas") {
        return tiempoA - tiempoB;
      }

      return tiempoB - tiempoA;
    });
  }, [selectedBabyEvaluations, sortOrder]);

  const latestEvaluation = sortedEvaluations[0] || null;
  const previousEvaluation = sortedEvaluations[1] || null;

  const changeStatus = useMemo(() => {
    if (!latestEvaluation || !previousEvaluation) {
      return "Sin comparación";
    }

    const latestWeight = getRiskWeight(latestEvaluation.risk);
    const previousWeight = getRiskWeight(previousEvaluation.risk);

    if (latestWeight === previousWeight) {
      return "Se mantiene estable";
    }

    if (latestWeight < previousWeight) {
      return "Mejoró respecto al registro anterior";
    }

    return "Aumentó el nivel de riesgo";
  }, [latestEvaluation, previousEvaluation]);

  const activeTrackingCount = useMemo(() => {
    return sortedEvaluations.filter(
      (evaluation) =>
        evaluation.risk === "medio" ||
        evaluation.risk === "alto" ||
        evaluation.trackingType === "Seguimiento clínico" ||
        evaluation.trackingType === "Atención prioritaria"
    ).length;
  }, [sortedEvaluations]);

  const nextEvaluationText = useMemo(() => {
    if (!latestEvaluation) return "Sin registro";

    if (latestEvaluation.risk === "alto") {
      return "De inmediato";
    }

    if (latestEvaluation.risk === "medio") {
      return "En 24 horas";
    }

    if (latestEvaluation.risk === "bajo") {
      return "Según control";
    }

    return "Sin registro";
  }, [latestEvaluation]);

  const filteredEvaluations = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm);

    return sortedEvaluations.filter((evaluation) => {
      const matchesRisk =
        activeRisk === "todos" || evaluation.risk === activeRisk;

      const matchesSearch =
        normalizeText(evaluation.baby).includes(normalizedSearch) ||
        normalizeText(evaluation.date).includes(normalizedSearch) ||
        normalizeText(evaluation.time).includes(normalizedSearch) ||
        normalizeText(evaluation.riskLabel).includes(normalizedSearch) ||
        normalizeText(evaluation.trackingType).includes(normalizedSearch) ||
        normalizeText(evaluation.recommendation).includes(normalizedSearch);

      return matchesRisk && matchesSearch;
    });
  }, [searchTerm, activeRisk, sortedEvaluations]);

  const visibleEvaluations = filteredEvaluations.slice(0, 3);

  const handleBabyChange = (event) => {
    const nuevoId = event.target.value;
    setSelectedBabyId(nuevoId);
    cargarDatosHistorial(nuevoId);
  };

  const handleViewResult = () => {
    navigate("/resultado", {
      state: {
        user: usuario,
        fromHistory: true,
        evaluation: latestEvaluation,
        bebe: bebeActual,
      },
    });
  };

  const handleViewDetail = (evaluation) => {
    navigate("/resultado", {
      state: {
        user: usuario,
        fromHistory: true,
        evaluation,
        bebe: bebeActual,
      },
    });
  };

  const handleViewAllEvaluations = () => {
    navigate("/historial/evaluaciones", {
      state: {
        user: usuario,
        bebe: bebeActual,
        evaluations: sortedEvaluations,
      },
    });
  };

  return (
    <main className="history-page-wrapper">
      <Header2 user={usuario} />

      <section className="history-desktop">
        <aside className="history-sidebar">
          <nav className="history-sidebar-nav">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === "/inicio"}
                className={({ isActive }) =>
                  isActive
                    ? "history-sidebar-item active"
                    : "history-sidebar-item"
                }
              >
                <span className="history-sidebar-icon-box">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="history-sidebar-icon"
                  />
                </span>

                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <section className="history-main-panel">
          <header className="history-title-row">
            <div className="history-title-left">
              <h1>Historial de evaluaciones</h1>

              <p>
                Consulta los resultados anteriores y revisa cómo ha cambiado el
                seguimiento del recién nacido.
              </p>
            </div>

            <div className="history-title-actions">
              <label className="history-search-box">
                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Buscar por fecha, bebé o nivel de riesgo..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </label>

              <div className="history-risk-filters">
                <span>Filtros de riesgo:</span>

                {riskFilters.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    className={
                      activeRisk === filter.id
                        ? `history-risk-filter active ${filter.id}`
                        : `history-risk-filter ${filter.id}`
                    }
                    onClick={() => setActiveRisk(filter.id)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <label className="history-baby-select">
                <span>Bebé:</span>

                <select value={selectedBabyId} onChange={handleBabyChange}>
                  {babyOptions.map((baby) => (
                    <option key={baby.id || baby.nombre} value={baby.id || ""}>
                      {baby.nombre}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </header>

          <section className="history-current-card">
            <div className="history-current-image-box">
              <img
                src={bebeImage}
                alt="Bebé en seguimiento"
                className="history-current-image"
              />
            </div>

            <div className="history-current-content">
              <h2>Seguimiento actual</h2>

              <div className="history-current-details">
                <article className="history-current-item">
                  <span className="history-current-icon image">
                    <img src={uImage} alt="Bebé" />
                  </span>

                  <div>
                    <h3>Bebé:</h3>
                    <p>{latestEvaluation?.baby || nombreBebeReal}</p>
                  </div>
                </article>

                <article className="history-current-item">
                  <span className="history-current-icon image">
                    <img src={srImage} alt="Edad actual" />
                  </span>

                  <div>
                    <h3>Edad actual:</h3>
                    <p>{latestEvaluation?.babyAge || edadBebeReal}</p>
                  </div>
                </article>

                <article className="history-current-item">
                  <span className="history-current-icon image">
                    <img src={horarioImage} alt="Última evaluación" />
                  </span>

                  <div>
                    <h3>Última evaluación:</h3>
                    <p>{latestEvaluation?.date || "Sin registro"}</p>
                  </div>
                </article>

                <article className="history-current-item result">
                  <div>
                    <h3>Resultado más reciente:</h3>

                    <span
                      className={`history-risk-badge ${getRiskClass(
                        latestEvaluation?.risk
                      )}`}
                    >
                      {latestEvaluation?.riskLabel || "Sin registro"}
                    </span>
                  </div>
                </article>

                <article className="history-current-item recommendation">
                  <div>
                    <h3>Recomendación:</h3>

                    <p>
                      {latestEvaluation?.recommendation ||
                        "Aún no hay recomendaciones registradas."}
                    </p>
                  </div>
                </article>

                <button
                  type="button"
                  className="history-result-button"
                  onClick={handleViewResult}
                  disabled={!latestEvaluation}
                >
                  Ver último resultado <span>›</span>
                </button>
              </div>
            </div>
          </section>

          {loadError && (
            <p className="step-error">
              No se pudo cargar el historial: {loadError}
            </p>
          )}

          <section className="history-summary-grid">
            <article className="history-summary-card purple">
              <span className="history-summary-icon image">
                <img src={inicioActImage} alt="Evaluaciones realizadas" />
              </span>

              <div>
                <h3>Evaluaciones realizadas</h3>

                <p>
                  <strong>{selectedBabyEvaluations.length}</strong>{" "}
                  {selectedBabyEvaluations.length === 1
                    ? "evaluación"
                    : "evaluaciones"}
                </p>
              </div>
            </article>

            <article className="history-summary-card orange">
              <span className="history-summary-icon image">
                <img src={recienteImage} alt="Cambio reciente" />
              </span>

              <div>
                <h3>Cambio reciente</h3>
                <p>{changeStatus}</p>

                <span
                  className={`history-risk-badge ${getRiskClass(
                    latestEvaluation?.risk
                  )}`}
                >
                  {latestEvaluation?.riskLabel || "Sin registro"}
                </span>
              </div>
            </article>

            <article className="history-summary-card green">
              <span className="history-summary-icon image">
                <img src={tvrImage} alt="Seguimientos activos" />
              </span>

              <div>
                <h3>Seguimientos activos</h3>

                <p>
                  <strong>{activeTrackingCount}</strong>{" "}
                  {activeTrackingCount === 1
                    ? "seguimiento"
                    : "seguimientos"}
                </p>
              </div>
            </article>

            <article className="history-summary-card blue">
              <span className="history-summary-icon image">
                <img src={inicioProxiImage} alt="Próxima evaluación sugerida" />
              </span>

              <div>
                <h3>Próxima evaluación sugerida</h3>

                <p>
                  <strong>{nextEvaluationText}</strong>
                </p>
              </div>
            </article>
          </section>

          <section className="history-evaluations-section">
            <div className="history-section-title">
              <img
                src={horarioImage}
                alt="Evaluaciones anteriores"
                className="history-section-title-image"
              />

              <h2>Evaluaciones anteriores</h2>
            </div>

            <div className="history-order-box">
              <span>Ordenar por:</span>

              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
              >
                <option value="recientes">Más recientes</option>
                <option value="antiguas">Más antiguas</option>
              </select>
            </div>
          </section>

          <section className="history-table-card">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Fecha y hora</th>
                  <th>Puntaje</th>
                  <th>Nivel de riesgo</th>
                  <th>Tipo de seguimiento</th>
                  <th>Recomendación</th>
                  <th>Acción</th>
                </tr>
              </thead>

              <tbody>
                {loadingEvaluations ? (
                  <tr>
                    <td colSpan="6">
                      <div className="history-empty-state">
                        <h3>Cargando historial...</h3>
                        <p>Consultando los datos registrados del bebé.</p>
                      </div>
                    </td>
                  </tr>
                ) : visibleEvaluations.length > 0 ? (
                  visibleEvaluations.map((evaluation) => (
                    <tr key={`${evaluation.id}-${evaluation.createdAt}`}>
                      <td>
                        <div className="history-date-cell">
                          <span className="history-table-icon image">
                            <img src={erImage} alt="Fecha y hora" />
                          </span>

                          <div>
                            <strong>{evaluation.date}</strong>
                            <p>{evaluation.time}</p>
                          </div>
                        </div>
                      </td>

                      <td>
                        <strong>{evaluation.score}</strong>
                      </td>

                      <td>
                        <span
                          className={`history-risk-badge ${getRiskClass(
                            evaluation.risk
                          )}`}
                        >
                          {evaluation.riskLabel}
                        </span>
                      </td>

                      <td>
                        <div className="history-tracking-cell">
                          <span className="history-table-icon image">
                            <img
                              src={getTrackingImage(evaluation.risk)}
                              alt="Tipo de seguimiento"
                            />
                          </span>

                          <span>{evaluation.trackingType}</span>
                        </div>
                      </td>

                      <td>{evaluation.recommendation}</td>

                      <td>
                        <button
                          type="button"
                          className="history-detail-button"
                          onClick={() => handleViewDetail(evaluation)}
                        >
                          Ver detalle <span>›</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      <div className="history-empty-state">
                        <h3>No se encontraron evaluaciones</h3>

                        <p>
                          No hay evaluaciones registradas para este bebé o los
                          filtros actuales no tienen resultados.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="history-table-footer">
              <p>
                Mostrando {visibleEvaluations.length} de{" "}
                {filteredEvaluations.length} evaluaciones
              </p>

              <button
                type="button"
                className="history-view-all-button"
                onClick={handleViewAllEvaluations}
              >
                Ver todas las evaluaciones <span>›</span>
              </button>
            </div>
          </section>
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default History;