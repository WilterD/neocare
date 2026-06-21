import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./History.css";

import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";

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

const evaluations = [
  {
    id: 1,
    createdAt: "2025-05-20T12:30:00",
    date: "20 mayo, 2025",
    time: "12:30 p. m.",
    babyAge: "12 días",
    score: "5 / 10",
    risk: "medio",
    riskLabel: "Riesgo medio",
    trackingType: "Seguimiento clínico",
    recommendation: "Repetir evaluación en 24 horas.",
  },
  {
    id: 2,
    createdAt: "2025-05-12T09:15:00",
    date: "12 mayo, 2025",
    time: "9:15 a. m.",
    babyAge: "4 días",
    score: "3 / 10",
    risk: "bajo",
    riskLabel: "Riesgo bajo",
    trackingType: "Seguimiento básico",
    recommendation: "Continuar cuidados generales en casa.",
  },
  {
    id: 3,
    createdAt: "2025-05-04T08:45:00",
    date: "4 mayo, 2025",
    time: "8:45 a. m.",
    babyAge: "1 día",
    score: "7 / 10",
    risk: "alto",
    riskLabel: "Riesgo alto",
    trackingType: "Atención prioritaria",
    recommendation: "Acudir al centro de salud más cercano.",
  },
  {
    id: 4,
    createdAt: "2025-05-02T10:10:00",
    date: "2 mayo, 2025",
    time: "10:10 a. m.",
    babyAge: "1 día",
    score: "6 / 10",
    risk: "medio",
    riskLabel: "Riesgo medio",
    trackingType: "Seguimiento clínico",
    recommendation: "Mantener vigilancia y repetir evaluación en 24 horas.",
  },
  {
    id: 5,
    createdAt: "2025-04-30T16:20:00",
    date: "30 abril, 2025",
    time: "4:20 p. m.",
    babyAge: "Recién nacido",
    score: "2 / 10",
    risk: "bajo",
    riskLabel: "Riesgo bajo",
    trackingType: "Seguimiento básico",
    recommendation: "Continuar cuidados generales en casa.",
  },
  {
    id: 6,
    createdAt: "2025-04-28T11:40:00",
    date: "28 abril, 2025",
    time: "11:40 a. m.",
    babyAge: "Recién nacido",
    score: "4 / 10",
    risk: "medio",
    riskLabel: "Riesgo medio",
    trackingType: "Seguimiento clínico",
    recommendation: "Repetir evaluación en 24 horas.",
  },
];

const normalizeText = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
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

const getTrackingImage = (risk) => {
  if (risk === "bajo") return tsvImage;
  if (risk === "medio") return tsaImage;
  if (risk === "alto") return tsrImage;

  return tsaImage;
};

const History = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [usuario, setUsuario] = useState(location.state?.user || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeRisk, setActiveRisk] = useState("todos");
  const [selectedBaby, setSelectedBaby] = useState("");
  const [sortOrder, setSortOrder] = useState("recientes");

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

  useEffect(() => {
    if (usuario?.bebe?.nombre && !selectedBaby) {
      setSelectedBaby(usuario.bebe.nombre);
    }
  }, [usuario, selectedBaby]);

  const babyOptions = useMemo(() => {
    if (usuario?.bebe?.nombre) {
      return [usuario.bebe.nombre];
    }
    return ["Tu bebé"];
  }, [usuario]);

  const selectedBabyEvaluations = useMemo(() => {
    return evaluations;
  }, []);

  const sortedEvaluations = useMemo(() => {
    const evaluationsCopy = [...selectedBabyEvaluations];

    return evaluationsCopy.sort((a, b) => {
      if (sortOrder === "antiguas") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
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

    return "Según control";
  }, [latestEvaluation]);

  const filteredEvaluations = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm);

    return sortedEvaluations.filter((evaluation) => {
      const matchesRisk =
        activeRisk === "todos" || evaluation.risk === activeRisk;

      const matchesSearch =
        normalizeText(evaluation.date).includes(normalizedSearch) ||
        normalizeText(evaluation.time).includes(normalizedSearch) ||
        normalizeText(evaluation.riskLabel).includes(normalizedSearch) ||
        normalizeText(evaluation.trackingType).includes(normalizedSearch) ||
        normalizeText(evaluation.recommendation).includes(normalizedSearch);

      return matchesRisk && matchesSearch;
    });
  }, [searchTerm, activeRisk, sortedEvaluations]);

  const visibleEvaluations = filteredEvaluations.slice(0, 3);

  const handleViewResult = () => {
    navigate("/resultado", {
      state: {
        user: usuario,
        fromHistory: true,
        evaluation: latestEvaluation,
      },
    });
  };

  const handleViewDetail = (evaluation) => {
    navigate("/resultado", {
      state: {
        user: usuario,
        fromHistory: true,
        evaluation,
      },
    });
  };

  const handleViewAllEvaluations = () => {
    navigate("/historial/evaluaciones", {
      state: {
        user: usuario,
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

                <select
                  value={selectedBaby}
                  onChange={(event) => setSelectedBaby(event.target.value)}
                >
                  {babyOptions.map((baby) => (
                    <option key={baby} value={baby}>
                      {baby}
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
                    <p>{latestEvaluation?.baby || "Sin registro"}</p>
                  </div>
                </article>

                <article className="history-current-item">
                  <span className="history-current-icon image">
                    <img src={srImage} alt="Edad actual" />
                  </span>

                  <div>
                    <h3>Edad actual:</h3>
                    <p>{latestEvaluation?.babyAge || "Sin registro"}</p>
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
                >
                  Ver último resultado <span>›</span>
                </button>
              </div>
            </div>
          </section>

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
                {visibleEvaluations.length > 0 ? (
                  visibleEvaluations.map((evaluation) => (
                    <tr key={evaluation.id}>
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
                          Prueba con otro filtro, otra búsqueda o selecciona
                          otro nivel de riesgo.
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