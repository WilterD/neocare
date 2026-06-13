import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Education.css";

import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import inicioImage from "../../assets/Inicio.png";
import evaluacionImage from "../../assets/evaluacion.png";
import educacionImage from "../../assets/educacion.png";
import historialImage from "../../assets/h.png";
import perfilImage from "../../assets/perfil.png";

import dtImage from "../../assets/DT.png";

import datosBebeImage from "../../assets/DatosBebe.png";
import qsImage from "../../assets/QS.png";
import realizarEImage from "../../assets/RealizarE.png";
import hipoImage from "../../assets/HIPO.png";
import controlImage from "../../assets/CONTROL.png";
import sepsisImage from "../../assets/sepsis.png";
import vacuImage from "../../assets/VACU.png";

import bloqueBlancoImage from "../../assets/BLOQUEBLANCO.png";
import bverdeImage from "../../assets/BVERDE.png";
import gorroImage from "../../assets/GORRO.png";
import aleImage from "../../assets/ALE.png";
import dudaImage from "../../assets/DUDA.png";
import ramaImage from "../../assets/RAMA.png";
import tempeImage from "../../assets/TEMPE.png";
import lacImage from "../../assets/LAC.png";
import flechImage from "../../assets/FLECH.png";

import saImage from "../../assets/SA.png";
import cuidadosBasicosImage from "../../assets/CUIDADOSBASICOS.png";
import lacLogoImage from "../../assets/LACLOGO.png";
import temLogoImage from "../../assets/TEMLOGO.png";

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

const mainFilters = [
  {
    id: "todos",
    label: "Todos",
    image: bloqueBlancoImage,
  },
  {
    id: "signos",
    label: "Signos de alarma",
    image: aleImage,
  },
  {
    id: "cuidados",
    label: "Cuidados básicos",
    image: ramaImage,
  },
  {
    id: "lactancia",
    label: "Lactancia",
    image: lacImage,
  },
  {
    id: "temperatura",
    label: "Temperatura",
    image: tempeImage,
  },
];

const moreFilters = [
  {
    id: "ictericia",
    label: "Ictericia",
    image: datosBebeImage,
  },
  {
    id: "sepsis",
    label: "Sepsis",
    image: sepsisImage,
  },
  {
    id: "hipotermia",
    label: "Hipotermia",
    image: hipoImage,
  },
  {
    id: "vacunas",
    label: "Vacunas",
    image: vacuImage,
  },
  {
    id: "controles",
    label: "Controles",
    image: controlImage,
  },
  {
    id: "triaje",
    label: "Triaje neonatal",
    image: qsImage,
  },
  {
    id: "seguimiento",
    label: "Seguimiento diario",
    image: realizarEImage,
  },
];

const topics = [
  {
    id: "signos-alarma",
    title: "Signos de alarma en el recién nacido",
    description:
      "Aprende a identificar señales que pueden indicar que tu bebé necesita atención médica.",
    category: "signos",
    image: saImage,
  },
  {
    id: "ictericia-neonatal",
    title: "Ictericia neonatal",
    description:
      "Qué es, cómo identificarla y cuándo consultar al personal de salud.",
    category: "ictericia",
    image: datosBebeImage,
  },
  {
    id: "cuidados-basicos",
    title: "Cuidados básicos del recién nacido",
    description:
      "Conoce prácticas diarias para mantener a tu bebé seguro en casa.",
    category: "cuidados",
    image: cuidadosBasicosImage,
  },
  {
    id: "sepsis-neonatal",
    title: "Sepsis neonatal",
    description: "Información importante para prevenirla y actuar a tiempo.",
    category: "sepsis",
    image: sepsisImage,
  },
  {
    id: "lactancia-materna",
    title: "Lactancia materna",
    description:
      "Beneficios, frecuencia y recomendaciones para una lactancia adecuada.",
    category: "lactancia",
    image: lacLogoImage,
  },
  {
    id: "hipotermia-neonatal",
    title: "Hipotermia neonatal",
    description: "Qué es, causas, cómo prevenirla y cuándo buscar ayuda.",
    category: "hipotermia",
    image: hipoImage,
  },
  {
    id: "temperatura",
    title: "Control de temperatura",
    description:
      "Cómo mantener a tu bebé a una temperatura adecuada y reconocer señales de alerta.",
    category: "temperatura",
    image: temLogoImage,
  },
  {
    id: "centro-salud",
    title: "¿Cuándo acudir al centro de salud?",
    description: "Situaciones que requieren atención médica inmediata.",
    category: "signos",
    image: controlImage,
  },
];

const neocareModules = [
  {
    id: "triaje-neonatal",
    title: "Sistema de triaje neonatal",
    description:
      "Conoce qué significan los niveles verde, amarillo y rojo en NeoCare.",
    image: qsImage,
    path: "/evaluacion",
  },
  {
    id: "seguimiento-diario",
    title: "Seguimiento diario del recién nacido",
    description:
      "Registra durante 5 días la evolución del bebé después de una evaluación.",
    image: realizarEImage,
    path: "/seguimiento",
  },
  {
    id: "vacunas-controles",
    title: "Vacunas y controles del bebé",
    description:
      "Consulta recordatorios generales sobre vacunación, control neonatal y seguimiento del crecimiento.",
    image: vacuImage,
    path: "/educacion",
  },
];

const normalizeText = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const Education = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const topicsRef = useRef(null);

  const [usuario, setUsuario] = useState(location.state?.user || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("todos");
  const [isMoreOpen, setIsMoreOpen] = useState(false);

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
    const handleOutsideClick = (event) => {
      if (!dropdownRef.current) return;

      if (!dropdownRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const activeMoreFilter = moreFilters.find(
    (filter) => filter.id === activeFilter
  );

  const filteredTopics = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm);

    return topics.filter((topic) => {
      const matchesFilter =
        activeFilter === "todos" || topic.category === activeFilter;

      const matchesSearch =
        normalizeText(topic.title).includes(normalizedSearch) ||
        normalizeText(topic.description).includes(normalizedSearch) ||
        normalizeText(topic.category).includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchTerm]);

  const handleSelectFilter = (filterId) => {
    setActiveFilter(filterId);
    setIsMoreOpen(false);
  };

  const handleViewDangerSigns = () => {
    setActiveFilter("signos");
    setIsMoreOpen(false);

    setTimeout(() => {
      topicsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  return (
    <main className="education-page-wrapper">
      <Header2 user={usuario} />

      <section className="education-desktop">
        <aside className="education-sidebar">
          <nav className="education-sidebar-nav">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === "/inicio"}
                className={({ isActive }) =>
                  isActive
                    ? "education-sidebar-item active"
                    : "education-sidebar-item"
                }
              >
                <span className="education-sidebar-icon-box">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="education-sidebar-icon"
                  />
                </span>

                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <section className="education-main-panel">
          <header className="education-title-row">
            <div className="education-title-left">
              <h1>Contenido educativo</h1>
              <p>Aprende, cuida y actúa a tiempo con información confiable.</p>
            </div>

            <div className="education-title-actions">
              <label className="education-search-box">
                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Buscar temas..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </label>

              <div className="education-help-tooltip-wrapper">
                <button
                  type="button"
                  className="education-help-button"
                  aria-label="Ayuda"
                >
                  ?
                </button>

                <div className="education-help-tooltip">
                  <div className="education-help-tooltip-icon">...</div>

                  <div className="education-help-tooltip-text">
                    <h3>¿Necesitas ayuda?</h3>
                    <p>Estamos aquí para ayudarte.</p>
                  </div>

                  <button
                    type="button"
                    className="education-help-tooltip-button"
                    onClick={() => navigate("/contacto")}
                  >
                    Contáctanos ›
                  </button>
                </div>
              </div>
            </div>
          </header>

          <section className="education-hero-card">
            <div className="education-hero-image-box">
              <img
                src={dtImage}
                alt="Madre con recién nacido"
                className="education-hero-image"
              />
            </div>

            <div className="education-hero-text">
              <h2>Aprende, cuida y actúa a tiempo</h2>
              <p>
                Consulta información confiable para reconocer signos de alarma y
                fortalecer el cuidado del recién nacido en casa.
              </p>
            </div>
          </section>

          <section
            className="education-filter-row"
            aria-label="Filtros de contenido educativo"
          >
            {mainFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={
                  activeFilter === filter.id
                    ? "education-filter-button active"
                    : "education-filter-button"
                }
                onClick={() => handleSelectFilter(filter.id)}
              >
                <img
                  src={filter.image}
                  alt={filter.label}
                  className="education-filter-icon"
                />

                {filter.label}
              </button>
            ))}

            <div className="education-more-wrapper" ref={dropdownRef}>
              <button
                type="button"
                className={
                  activeMoreFilter
                    ? "education-filter-button more active"
                    : "education-filter-button more"
                }
                onClick={() => setIsMoreOpen((currentValue) => !currentValue)}
                aria-expanded={isMoreOpen}
              >
                <span className="education-more-dots">•••</span>

                {activeMoreFilter ? activeMoreFilter.label : "Más"}

                <img
                  src={flechImage}
                  alt="Desplegar opciones"
                  className={
                    isMoreOpen
                      ? "education-more-arrow open"
                      : "education-more-arrow"
                  }
                />
              </button>

              {isMoreOpen && (
                <div className="education-more-menu">
                  {moreFilters.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      className={
                        activeFilter === filter.id
                          ? "education-more-item active"
                          : "education-more-item"
                      }
                      onClick={() => handleSelectFilter(filter.id)}
                    >
                      <img
                        src={filter.image}
                        alt={filter.label}
                        className="education-more-icon"
                      />

                      {filter.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="education-grid-content">
            <section className="education-topics-card" ref={topicsRef}>
              <div className="education-section-title">
                <img
                  src={bverdeImage}
                  alt="Temas esenciales"
                  className="education-section-title-image"
                />

                <h2>Temas esenciales de cuidado neonatal</h2>
              </div>

              <div className="education-topic-grid">
                {filteredTopics.length > 0 ? (
                  filteredTopics.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      className="education-topic-card"
                    >
                      <span className="education-topic-image-box">
                        <img
                          src={topic.image}
                          alt={topic.title}
                          className="education-topic-image"
                        />
                      </span>

                      <div>
                        <h3>{topic.title}</h3>
                        <p>{topic.description}</p>
                      </div>

                      <span className="education-arrow">›</span>
                    </button>
                  ))
                ) : (
                  <div className="education-empty-state">
                    <h3>No se encontraron temas</h3>
                    <p>Prueba con otra palabra o selecciona otro filtro.</p>
                  </div>
                )}
              </div>
            </section>

            <aside className="education-modules-card">
              <div className="education-section-title">
                <img
                  src={gorroImage}
                  alt="Módulos de NeoCare"
                  className="education-section-title-image"
                />

                <h2>Módulos de NeoCare</h2>
              </div>

              <div className="education-module-list">
                {neocareModules.map((module) => (
                  <button
                    key={module.id}
                    type="button"
                    className="education-module-card"
                    onClick={() => navigate(module.path)}
                  >
                    <span className="education-module-image-box">
                      <img
                        src={module.image}
                        alt={module.title}
                        className="education-module-image"
                      />
                    </span>

                    <div>
                      <h3>{module.title}</h3>
                      <p>{module.description}</p>
                    </div>

                    <span className="education-arrow">›</span>
                  </button>
                ))}
              </div>
            </aside>
          </section>

          <section className="education-doubts-card">
            <div className="education-doubts-icon">
              <img
                src={dudaImage}
                alt="Tienes dudas"
                className="education-doubts-image"
              />
            </div>

            <div className="education-doubts-content">
              <h2>¿Tienes dudas?</h2>

              <p>
                NeoCare te orienta, pero no reemplaza la atención médica
                profesional. Ante fiebre, dificultad respiratoria, convulsiones,
                coloración azulada o rechazo del alimento, acude al centro de
                salud más cercano.
              </p>

              <button
                type="button"
                className="education-danger-button"
                onClick={handleViewDangerSigns}
              >
                Ver signos de alarma
                <span>›</span>
              </button>
            </div>
          </section>
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default Education;