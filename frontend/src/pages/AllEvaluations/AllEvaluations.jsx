import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./AllEvaluations.css";

import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import inicioImage from "../../assets/Inicio.png";
import evaluacionImage from "../../assets/Evaluacion.png";
import educacionImage from "../../assets/Educacion.png";
import historialImage from "../../assets/H.png";
import perfilImage from "../../assets/Perfil.png";
import recienteImage from "../../assets/RECIENTE.png";

import inicioActImage from "../../assets/INICIOACT.png";
import horarioImage from "../../assets/HORARIO.png";
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

const periodFilters = [
  {
    id: "todos",
    label: "Todos",
  },
  {
    id: "semana",
    label: "Esta semana",
  },
  {
    id: "mes",
    label: "Este mes",
  },
];

const evaluations = [
  {
    id: 1,
    createdAt: "2025-05-20T12:30:00",
    date: "20 mayo, 2025",
    time: "12:30 p. m.",
    baby: "Mateo",
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
    baby: "Mateo",
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
    baby: "Mateo",
    score: "7 / 10",
    risk: "alto",
    riskLabel: "Riesgo alto",
    trackingType: "Atención prioritaria",
    recommendation: "Acudir al centro de salud más cercano.",
  },
  {
    id: 4,
    createdAt: "2025-04-28T19:30:00",
    date: "28 abril, 2025",
    time: "7:30 p. m.",
    baby: "Mateo",
    score: "4 / 10",
    risk: "medio",
    riskLabel: "Riesgo medio",
    trackingType: "Seguimiento clínico",
    recommendation: "Mantener vigilancia y repetir evaluación.",
  },
  {
    id: 5,
    createdAt: "2025-04-20T11:00:00",
    date: "20 abril, 2025",
    time: "11:00 a. m.",
    baby: "Mateo",
    score: "6 / 10",
    risk: "medio",
    riskLabel: "Riesgo medio",
    trackingType: "Seguimiento clínico",
    recommendation: "Revisar evolución del bebé.",
  },
  {
    id: 6,
    createdAt: "2025-04-10T18:30:00",
    date: "10 abril, 2025",
    time: "6:30 p. m.",
    baby: "Mateo",
    score: "2 / 10",
    risk: "bajo",
    riskLabel: "Riesgo bajo",
    trackingType: "Seguimiento básico",
    recommendation: "Mantener cuidados generales.",
  },
];

const normalizeText = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
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

const AllEvaluations = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [usuario, setUsuario] = useState(location.state?.user || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBaby, setSelectedBaby] = useState("Mateo");
  const [activeRisk, setActiveRisk] = useState("todos");
  const [selectedPeriod, setSelectedPeriod] = useState("todos");
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

  const babyOptions = useMemo(() => {
    const babies = evaluations.map((evaluation) => evaluation.baby);
    return [...new Set(babies)];
  }, []);

  const selectedBabyEvaluations = useMemo(() => {
    return evaluations.filter((evaluation) => evaluation.baby === selectedBaby);
  }, [selectedBaby]);

  const filteredEvaluations = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm);

    return selectedBabyEvaluations.filter((evaluation) => {
      const matchesRisk =
        activeRisk === "todos" || evaluation.risk === activeRisk;

      const matchesSearch =
        normalizeText(evaluation.date).includes(normalizedSearch) ||
        normalizeText(evaluation.time).includes(normalizedSearch) ||
        normalizeText(evaluation.baby).includes(normalizedSearch) ||
        normalizeText(evaluation.riskLabel).includes(normalizedSearch) ||
        normalizeText(evaluation.trackingType).includes(normalizedSearch) ||
        normalizeText(evaluation.recommendation).includes(normalizedSearch);

      return matchesRisk && matchesSearch;
    });
  }, [activeRisk, searchTerm, selectedBabyEvaluations]);

  const sortedEvaluations = useMemo(() => {
    const evaluationsCopy = [...filteredEvaluations];

    return evaluationsCopy.sort((a, b) => {
      if (sortOrder === "antiguas") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [filteredEvaluations, sortOrder]);

  const latestEvaluation = useMemo(() => {
    const ordered = [...selectedBabyEvaluations].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return ordered[0];
  }, [selectedBabyEvaluations]);

  const alertEvaluations = useMemo(() => {
    return selectedBabyEvaluations.filter(
      (evaluation) => evaluation.risk === "alto"
    ).length;
  }, [selectedBabyEvaluations]);

  const handleViewDetail = (evaluation) => {
    navigate("/resultado", {
      state: {
        user: usuario,
        fromHistory: true,
        evaluation,
      },
    });
  };

 
  return (
    <main className="all-evaluations-page-wrapper">
      <Header2 user={usuario} />

      <section className="all-evaluations-desktop">
        <aside className="all-evaluations-sidebar">
          <nav className="all-evaluations-sidebar-nav">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === "/inicio"}
                className={({ isActive }) => {
                  const isHistoryRoute =
                    item.path === "/historial" &&
                    location.pathname.startsWith("/historial");

                  return isActive || isHistoryRoute
                    ? "all-evaluations-sidebar-item active"
                    : "all-evaluations-sidebar-item";
                }}
              >
                <span className="all-evaluations-sidebar-icon-box">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="all-evaluations-sidebar-icon"
                  />
                </span>

                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <section className="all-evaluations-main-panel">
          <header className="all-evaluations-title-row">
            <div>
              <h1>Todas las evaluaciones</h1>
              <p>
                Consulta el registro completo de evaluaciones realizadas y revisa
                los cambios en el seguimiento del recién nacido.
              </p>
            </div>
          </header>

          <section className="all-evaluations-filter-row">
            <label className="all-evaluations-search-box">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Buscar por fecha, bebé o nivel de riesgo..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>

            <label className="all-evaluations-baby-select">
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

            <div className="all-evaluations-risk-filters">
              <span>Filtrar por riesgo:</span>

              {riskFilters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={
                    activeRisk === filter.id
                      ? `all-evaluations-risk-filter active ${filter.id}`
                      : `all-evaluations-risk-filter ${filter.id}`
                  }
                  onClick={() => setActiveRisk(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <label className="all-evaluations-period-select">
              <span>Periodo:</span>

              <select
                value={selectedPeriod}
                onChange={(event) => setSelectedPeriod(event.target.value)}
              >
                {periodFilters.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.label}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <section className="all-evaluations-summary-bar">
            <article className="all-evaluations-summary-item">
              <span className="all-evaluations-summary-icon image">
                <img src={inicioActImage} alt="Evaluaciones registradas" />
              </span>

              <p>
                <strong>{selectedBabyEvaluations.length}</strong> evaluaciones
                registradas
              </p>
            </article>

            <article className="all-evaluations-summary-item">
              <span className="all-evaluations-summary-icon image">
                <img src={horarioImage} alt="Última evaluación" />
              </span>

              <div>
                <p>Última evaluación:</p>
                <strong>{latestEvaluation?.date || "Sin registro"}</strong>
              </div>
            </article>

            <article className="all-evaluations-summary-item alert">
              <span className="all-evaluations-alert-icon image">
                <img src={recienteImage} alt="Evaluaciones con alerta" />
             </span>

              <div>
                <p>Evaluaciones con alerta:</p>
                <strong>{alertEvaluations} alta</strong>
              </div>
            </article>
          </section>

          <section className="all-evaluations-table-card">
            <div className="all-evaluations-table-header">
              <h2>Registro completo</h2>

              <label className="all-evaluations-order-box">
                <span>Ordenar por:</span>

                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                >
                  <option value="recientes">Más recientes</option>
                  <option value="antiguas">Más antiguas</option>
                </select>
              </label>
            </div>

            <table className="all-evaluations-table">
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
                {sortedEvaluations.map((evaluation) => (
                  <tr key={evaluation.id}>
                    <td>
                      <div className="all-evaluations-date-cell">
                        <span className="all-evaluations-table-icon image">
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
                        className={`all-evaluations-risk-badge ${getRiskClass(
                          evaluation.risk
                        )}`}
                      >
                        <span></span>
                        {evaluation.riskLabel}
                      </span>
                    </td>

                    <td>
                      <div className="all-evaluations-tracking-cell">
                        <span className="all-evaluations-tracking-icon image">
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
                        className="all-evaluations-detail-button"
                        onClick={() => handleViewDetail(evaluation)}
                      >
                        Ver detalle <span>›</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="all-evaluations-table-footer">
            <p>
             Mostrando {sortedEvaluations.length} de{" "}
            {selectedBabyEvaluations.length} evaluaciones
            </p>
            </div>
          </section>
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default AllEvaluations;