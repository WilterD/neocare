import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { crearEvaluacion } from "../../services/api.js";
import { mapEvaluacionFromRegistro } from "../../utils/mapRegistroPayload.js";
import "./Evaluation.css";

import AppShell from "../../components/AppShell/AppShell.jsx";

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

const Evaluation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [usuario, setUsuario] = useState(location.state?.user || null);
  const [registro, setRegistro] = useState(location.state?.registro || null);
  const [evaluando, setEvaluando] = useState(false);

  useEffect(() => {
    if (usuario && registro) return;

    try {
      const storedUser = localStorage.getItem("neocareUser");
      const storedRegisterData = localStorage.getItem("neocareRegisterData");
      const storedRiesgo = localStorage.getItem("neocareResultadoRiesgo");

      if (storedUser && !usuario) {
        setUsuario(JSON.parse(storedUser));
      }

      if (storedRegisterData && !registro) {
        const parsed = JSON.parse(storedRegisterData);
        if (!parsed.resultadoRiesgo && storedRiesgo) {
          parsed.resultadoRiesgo = JSON.parse(storedRiesgo);
        }
        setRegistro(parsed);
      }
    } catch (error) {
      console.error("Error al cargar datos guardados:", error);
    }
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
    navigate("/perfil/editar");
  };

  const irAResultado = (resultadoRiesgo, registroActualizado) => {
    navigate("/resultado", {
      state: {
        user: usuario,
        registro: registroActualizado || registro,
        resultadoRiesgo,
      },
    });
  };

  const handleRunEvaluation = async () => {
    if (!registro) {
      alert("No hay datos de registro. Completa el registro primero.");
      return;
    }

    const token = localStorage.getItem("token");
    if (token) {
      setEvaluando(true);
      try {
        const payload = mapEvaluacionFromRegistro(registro);
        const res = await crearEvaluacion(payload);
        const registroActualizado = {
          ...registro,
          resultadoRiesgo: res.resultadoRiesgo,
          evaluacionId: res.evaluacionId,
        };
        setRegistro(registroActualizado);
        localStorage.setItem("neocareResultadoRiesgo", JSON.stringify(res.resultadoRiesgo));
        localStorage.setItem("neocareRegisterData", JSON.stringify(registroActualizado));
        irAResultado(res.resultadoRiesgo, registroActualizado);
      } catch (err) {
        alert(err.message || "No se pudo realizar la evaluación.");
      } finally {
        setEvaluando(false);
      }
      return;
    }

    const resultadoRiesgo =
      registro?.resultadoRiesgo ||
      JSON.parse(localStorage.getItem("neocareResultadoRiesgo") || "null");

    if (!resultadoRiesgo) {
      alert("No hay datos de evaluación. Completa el registro primero.");
      return;
    }

    irAResultado(resultadoRiesgo);
  };

  return (
    <AppShell title="Evaluación de riesgo">
        <section className="evaluation-main-panel" style={{ padding: 0 }}>
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
                disabled={evaluando}
              >
                <img
                  src={realizarEImage}
                  alt="Realizar evaluación"
                  className="evaluation-main-button-icon"
                />

                <span className="evaluation-main-button-text">
                  {evaluando ? "Evaluando..." : "Realizar evaluación"}
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
    </AppShell>
  );
};

export default Evaluation;