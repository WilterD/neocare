import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Evaluation.css";

import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import ctImage from "../../assets/CT.png";
import qsImage from "../../assets/QS.png";
import realizarEImage from "../../assets/RealizarE.png";

import amImage from "../../assets/DatosP.png";
import edadImage from "../../assets/Edad.png";
import heImage from "../../assets/EdadB.png";
import residenciaImage from "../../assets/Residencia.png";
import erImage from "../../assets/AF.png";
import ocImage from "../../assets/DatosClinicos.png";
import datosBebeImage from "../../assets/DatosBebe.png";
import avImage from "../../assets/Peso.png";
import saImage from "../../assets/AR.png";

import inicioImage from "../../assets/Inicio.png";
import evaluacionImage from "../../assets/evaluacion.png";
import educacionImage from "../../assets/educacion.png";
import historialImage from "../../assets/h.png";
import perfilImage from "../../assets/perfil.png";

const sidebarItems = [
  {
    image: inicioImage,
    label: "Inicio",
    path: "/",
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

const Evaluation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [usuario, setUsuario] = useState(location.state?.user || null);
  const [registro, setRegistro] = useState(location.state?.registro || null);

  useEffect(() => {
    const cargarDatosRegistro = () => {
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
        console.error("Error al cargar datos guardados:", error);
      }
    };

    cargarDatosRegistro();
  }, [usuario, registro]);

  const datosPersonales =
    registro?.datosPersonales || usuario?.datosPersonales || {};

  const sociodemografica =
    registro?.sociodemografica || usuario?.sociodemografica || {};

  const condicionesCuidado =
    registro?.condicionesCuidado || usuario?.condicionesCuidado || {};

  const recienNacido = registro?.recienNacido || usuario?.recienNacido || {};

  const datosClinicos = registro?.datosClinicos || usuario?.datosClinicos || {};

  const nombreUsuario =
    usuario?.nombre ||
    usuario?.nombreCompleto ||
    datosPersonales?.nombreCompleto ||
    "No registrado";

  const summaryData = [
    {
      image: amImage,
      label: "Madre o cuidadora",
      value: nombreUsuario,
    },
    {
      image: edadImage,
      label: "Edad",
      value: datosPersonales?.edad
        ? `${datosPersonales.edad} años`
        : "No registrada",
    },
    {
      image: residenciaImage,
      label: "Residencia",
      value: sociodemografica?.zonaResidencia || "No registrada",
    },
    {
      image: erImage,
      label: "Apoyo familiar",
      value: condicionesCuidado?.apoyoFamiliar || "No registrado",
      pill: true,
    },
    {
      image: ocImage,
      label: "Acceso a servicios de salud",
      value: sociodemografica?.accesoCentroSalud || "No registrado",
    },
    {
      image: datosBebeImage,
      label: "Recién nacido",
      value: recienNacido?.sexo || "No registrado",
    },
    {
      image: heImage,
      label: "Edad del bebé",
      value: recienNacido?.edadActual || "No registrada",
    },
    {
      image: avImage,
      label: "Peso al nacer",
      value: recienNacido?.pesoNacer
        ? `${recienNacido.pesoNacer} g`
        : "No registrado",
    },
    {
      image: saImage,
      label: "Antecedentes relevantes",
      value:
        datosClinicos?.complicacionesNacer === "Sí"
          ? datosClinicos?.complicacion || "Complicación registrada"
          : "Ninguno",
    },
  ];

  const handleGoBack = () => {
    navigate("/registro");
  };

  const handleRunEvaluation = () => {
    navigate("/resultado", {
      state: {
        user: usuario,
        registro,

        /*
          Estos signos son enviados a Result.jsx para que calcule el puntaje.
          Por ahora dejamos un caso de riesgo medio de prueba:
          vómitos repetitivos = 2 puntos
          ictericia progresiva = 2 puntos
          disminución de actividad = 2 puntos
          Total = 6, pero Result.jsx limitará y clasificará según su lógica.

          Cuando conectemos esta pantalla con preguntas reales de signos,
          esta lista debe llenarse con las respuestas seleccionadas por la usuaria.
        */
        selectedSigns: [
          "vomitosRepetitivos",
          "ictericiaProgresiva",
          "disminucionActividad",
        ],
      },
    });
  };

  return (
    <main className="evaluation-page-wrapper">
      <Header2 user={usuario} />

      <section className="evaluation-desktop">
        <aside className="evaluation-sidebar">
          <nav className="evaluation-sidebar-nav">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  isActive
                    ? "evaluation-sidebar-item active"
                    : "evaluation-sidebar-item"
                }
              >
                <span className="evaluation-sidebar-icon-box">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="evaluation-sidebar-icon"
                  />
                </span>

                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <section className="evaluation-main-panel">
          <header className="evaluation-title-row">
            <h1>Evaluación de riesgo</h1>

            <button
              type="button"
              className="evaluation-help-button"
              aria-label="Ayuda"
            >
              ?
            </button>
          </header>

          <section className="evaluation-hero-card">
            <div className="evaluation-hero-image-box">
              <img
                src={ctImage}
                alt="Casi terminamos"
                className="evaluation-hero-image"
              />
            </div>

            <div className="evaluation-hero-text">
              <h2>¡Casi terminamos!</h2>
              <p>
                Revisemos la información para evaluar el nivel de riesgo de tu
                bebé y brindarte recomendaciones.
              </p>
            </div>
          </section>

          <section className="evaluation-grid-content">
            <section className="evaluation-summary-card">
              <div className="evaluation-summary-header">
                <h2>Resumen de la información</h2>

                <button type="button" onClick={handleGoBack}>
                  ✎ Editar
                </button>
              </div>

              <div className="evaluation-summary-list">
                {summaryData.map((item) => (
                  <article className="evaluation-summary-row" key={item.label}>
                    <div className="evaluation-summary-image-box">
                      <img
                        src={item.image}
                        alt={item.label}
                        className="evaluation-summary-image"
                      />
                    </div>

                    <h3>{item.label}</h3>

                    {item.pill ? (
                      <span className="evaluation-pill">{item.value}</span>
                    ) : (
                      <p>{item.value}</p>
                    )}
                  </article>
                ))}
              </div>
            </section>

            <aside className="evaluation-action-column">
              <section className="evaluation-next-card">
                <h2>¿Qué sucede ahora?</h2>

                <div className="evaluation-next-content">
                  <div className="evaluation-next-image-box">
                    <img
                      src={qsImage}
                      alt="Qué sucede ahora"
                      className="evaluation-next-image"
                    />
                  </div>

                  <p>
                    Con esta información aplicaremos nuestras reglas de
                    clasificación para determinar el nivel de riesgo y el
                    seguimiento recomendado.
                  </p>
                </div>
              </section>

              <button
                type="button"
                className="evaluation-main-button"
                onClick={handleRunEvaluation}
              >
                <img
                  src={realizarEImage}
                  alt="Realizar evaluación"
                  className="evaluation-main-button-icon"
                />

                <span className="evaluation-main-button-text">
                  Realizar evaluación
                </span>

                <span className="evaluation-main-button-space"></span>
              </button>

              <p className="evaluation-secure-note">
                <span>▣</span>
                Tu información está segura y confidencial.
              </p>
            </aside>
          </section>
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default Evaluation;