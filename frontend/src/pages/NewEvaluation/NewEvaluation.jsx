import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./NewEvaluation.css";

import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import SidebarNeoCare from "../../components/SidebarNeoCare/SidebarNeoCare.jsx";

import { obtenerResumenUserHome } from "../../services/api.js";

import datosBebeImage from "../../assets/DatosBebe.png";

const highRiskSigns = [
  { key: "convulsiones", label: "Convulsiones" },
  { key: "dificultadRespiratoria", label: "Dificultad respiratoria" },
  {
    key: "coloracionAzulada",
    label: "Coloración azulada de labios o piel",
  },
  { key: "fiebreHipotermia", label: "Fiebre o hipotermia" },
  {
    key: "rechazoAlimentacion",
    label: "Rechazo completo de la alimentación",
  },
  {
    key: "disminucionConciencia",
    label: "Disminución importante del estado de conciencia",
  },
];

const mediumRiskSigns = [
  { key: "vomitosRepetitivos", label: "Vómitos repetitivos" },
  { key: "ictericiaProgresiva", label: "Ictericia progresiva" },
  {
    key: "disminucionActividad",
    label: "Disminución de la actividad habitual",
  },
  {
    key: "llantoPersistente",
    label: "Llanto persistente o inconsolable",
  },
];

const lowRiskSigns = [
  { key: "alteracionesSueno", label: "Alteraciones leves del sueño" },
  { key: "disminucionApetito", label: "Disminución leve del apetito" },
  { key: "irritabilidadOcasional", label: "Irritabilidad ocasional" },
];

const leerJSONStorage = (key) => {
  try {
    const value = localStorage.getItem(key) || sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const normalizarFechaInput = (value) => {
  if (!value) return "";

  const text = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(text)) {
    const [day, month, year] = text.split("/");
    return `${year}-${month}-${day}`;
  }

  const date = new Date(text);

  if (Number.isNaN(date.getTime())) return "";

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
};

const calcularEdadActual = (fechaNacimiento) => {
  if (!fechaNacimiento) return "Sin registro";

  const fechaNormalizada = normalizarFechaInput(fechaNacimiento);

  if (!fechaNormalizada) return "Sin registro";

  const birth = new Date(`${fechaNormalizada}T00:00:00`);
  const today = new Date();

  if (Number.isNaN(birth.getTime())) return "Sin registro";

  birth.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffMs = today - birth;
  const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  return `${days} ${days === 1 ? "día" : "días"}`;
};

const obtenerNombreBebe = (bebe) => {
  return (
    bebe?.nombreBebe ||
    bebe?.nombre_bebe ||
    bebe?.nombre ||
    bebe?.bebeNombre ||
    bebe?.bebe_nombre ||
    "Tu bebé"
  );
};

const obtenerEdadBebe = (bebe) => {
  return (
    bebe?.edadActual ||
    bebe?.edad_actual ||
    calcularEdadActual(bebe?.fechaNacimiento || bebe?.fecha_nacimiento)
  );
};

const getRecommendation = (risk) => {
  if (risk === "alto") {
    return "El resultado indica un nivel de riesgo alto. Se recomienda acudir de inmediato a un centro de salud o contactar a un profesional médico, sin esperar una nueva evaluación.";
  }

  if (risk === "medio") {
    return "El resultado indica un nivel de riesgo moderado. Se recomienda mantener vigilancia cercana, repetir la evaluación en las próximas 24 horas y consultar a un profesional de salud si los signos persisten o aumentan.";
  }

  return "El resultado indica un nivel de riesgo bajo. Se recomienda continuar con los cuidados básicos en casa, mantener la observación diaria y asistir a los controles correspondientes.";
};

const NewEvaluation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(
    location.state?.user || leerJSONStorage("neocareUser") || null
  );

  const [bebe, setBebe] = useState(
    location.state?.bebe || leerJSONStorage("neocareBebe") || null
  );

  const [registro, setRegistro] = useState(
    location.state?.registro ||
      leerJSONStorage("neocareRegisterData") ||
      leerJSONStorage("neocareRegistro") ||
      null
  );

  const [selectedSigns, setSelectedSigns] = useState({});
  const [noPresentaSenales, setNoPresentaSenales] = useState(false);
  const [observaciones, setObservaciones] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const response = await obtenerResumenUserHome();

        if (response?.usuario) {
          setUser(response.usuario);
          localStorage.setItem("neocareUser", JSON.stringify(response.usuario));
        }

        if (response?.bebe) {
          setBebe(response.bebe);
          localStorage.setItem("neocareBebe", JSON.stringify(response.bebe));
        }

        if (response?.registro) {
          setRegistro(response.registro);
        }
      } catch (error) {
        console.error("No se pudieron cargar los datos iniciales:", error);
      }
    };

    cargarDatosIniciales();
  }, []);

  const toggleSign = (key) => {
    if (noPresentaSenales) return;

    setSelectedSigns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    setErrors((prev) => ({
      ...prev,
      signs: "",
    }));
  };

  const toggleNoSigns = () => {
    const nextValue = !noPresentaSenales;

    setNoPresentaSenales(nextValue);

    if (nextValue) {
      setSelectedSigns({});
    }

    setErrors((prev) => ({
      ...prev,
      signs: "",
    }));
  };

  const calculatedResult = useMemo(() => {
    const highSelected = highRiskSigns.filter(
      (sign) => selectedSigns[sign.key]
    );

    const mediumSelected = mediumRiskSigns.filter(
      (sign) => selectedSigns[sign.key]
    );

    const lowSelected = lowRiskSigns.filter((sign) => selectedSigns[sign.key]);

    const highScore = highSelected.length * 3;
    const mediumScore = mediumSelected.length * 2;
    const lowScore = lowSelected.length;

    const score = highScore + mediumScore + lowScore;

    let risk = "bajo";

    if (score >= 6) {
      risk = "alto";
    } else if (score >= 3) {
      risk = "medio";
    } else {
      risk = "bajo";
    }

    const riskLabel =
      risk === "alto"
        ? "Riesgo alto"
        : risk === "medio"
        ? "Riesgo moderado"
        : "Riesgo bajo";

    const classification =
      risk === "alto"
        ? "Atención inmediata"
        : risk === "medio"
        ? "Seguimiento clínico"
        : "Observación en casa";

    const followUp =
      risk === "alto"
        ? "De inmediato"
        : risk === "medio"
        ? "En 24 horas"
        : "Según control";

    const activeSigns = [
      ...highSelected.map((sign) => ({
        ...sign,
        id: sign.key,
        points: 3,
        puntos: 3,
        category: "alto",
        categoria: "Manifestaciones clínicas de alarma neonatal",
      })),
      ...mediumSelected.map((sign) => ({
        ...sign,
        id: sign.key,
        points: 2,
        puntos: 2,
        category: "medio",
        categoria: "Señales de vigilancia clínica",
      })),
      ...lowSelected.map((sign) => ({
        ...sign,
        id: sign.key,
        points: 1,
        puntos: 1,
        category: "bajo",
        categoria: "Cambios leves de observación domiciliaria",
      })),
    ];

    return {
      risk,
      riskLabel,
      score,
      highScore,
      mediumScore,
      lowScore,
      classification,
      followUp,
      recommendation: getRecommendation(risk),
      activeSigns,
    };
  }, [selectedSigns]);

  const validateEvaluation = () => {
    const hasSigns = Object.values(selectedSigns).some(Boolean);

    if (!hasSigns && !noPresentaSenales) {
      setErrors({
        signs:
          "Selecciona al menos una señal o marca que no presenta señales actualmente.",
      });

      return false;
    }

    setErrors({});
    return true;
  };

  const submitEvaluation = () => {
    if (!validateEvaluation()) return;

    const currentDate = new Date().toISOString();

    const nombreBebe = obtenerNombreBebe(bebe);
    const edadActual = obtenerEdadBebe(bebe);

    const selectedSignIds = calculatedResult.activeSigns.map(
      (sign) => sign.key
    );

    const evaluationResult = {
      mode: "dangerSigns",

      riskLevel: calculatedResult.risk,
      finalRisk: calculatedResult.risk,
      finalLabel: calculatedResult.riskLabel.replace("Riesgo ", ""),

      totalScore: calculatedResult.score,

      selectedSigns: calculatedResult.activeSigns,
      selectedSignIds,

      identifiedFactors: calculatedResult.activeSigns.map((sign) => ({
        id: sign.id || sign.key,
        key: sign.key,
        label: sign.label,
        points: sign.points,
        puntos: sign.puntos,
        category: sign.category,
        categoria: sign.categoria,
      })),

      recommendation: {
        title: calculatedResult.classification,
        text: calculatedResult.recommendation,
      },

      criteriosClasificacion: {
        bajo: "0–2 puntos",
        moderado: "3–5 puntos",
        alto: "6 puntos o más",
      },

      puntosAltoRiesgo: calculatedResult.highScore,
      puntosRiesgoModerado: calculatedResult.mediumScore,
      puntosBajoRiesgo: calculatedResult.lowScore,

      observaciones,
      noPresentaSenales,
      fechaEvaluacion: currentDate,
    };

    navigate("/resultado", {
      state: {
        user,
        registro,
        fromNewEvaluation: true,

        bebe: {
          ...bebe,
          nombre: nombreBebe,
          nombreBebe,
          nombre_bebe: nombreBebe,
          edadActual,
          edad_actual: edadActual,
        },

        evaluationResult,

        evaluation: {
          id: Date.now(),
          tipo: "nueva_evaluacion",
          tipoEvaluacion: "Nueva evaluación",
          fecha: currentDate,
          fechaEvaluacion: currentDate,
          fecha_evaluacion: currentDate,
          createdAt: currentDate,

          baby: nombreBebe,
          babyAge: edadActual,

          puntuacion: calculatedResult.score,
          puntuacionTotal: calculatedResult.score,
          puntuacion_total: calculatedResult.score,
          puntaje: calculatedResult.score,
          score: `${calculatedResult.score} pts`,

          puntosAltoRiesgo: calculatedResult.highScore,
          puntos_alto_riesgo: calculatedResult.highScore,
          puntosRiesgoModerado: calculatedResult.mediumScore,
          puntos_riesgo_moderado: calculatedResult.mediumScore,
          puntosBajoRiesgo: calculatedResult.lowScore,
          puntos_bajo_riesgo: calculatedResult.lowScore,

          nivel: calculatedResult.risk,
          nivelRiesgo: calculatedResult.risk,
          nivel_riesgo: calculatedResult.risk,
          risk: calculatedResult.risk,
          riskLabel: calculatedResult.riskLabel,

          clasificacion: calculatedResult.classification,
          classification: calculatedResult.classification,

          recomendacion: calculatedResult.recommendation,
          recommendation: calculatedResult.recommendation,
          recomendaciones: calculatedResult.recommendation,

          seguimiento: calculatedResult.followUp,
          followUp: calculatedResult.followUp,
          tipoSeguimiento: calculatedResult.followUp,
          tipo_seguimiento: calculatedResult.followUp,

          signosActivos: calculatedResult.activeSigns.map((sign) => sign.label),
          detalleSignos: calculatedResult.activeSigns,

          criteriosClasificacion: {
            bajo: "0–2 puntos",
            moderado: "3–5 puntos",
            alto: "6 puntos o más",
          },

          observaciones,
          noPresentaSenales,
        },
      },
    });
  };

  const renderSignGroup = (title, helpText, signs, type) => {
    return (
      <section className={`new-evaluation-sign-group ${type}`}>
        <div className="new-evaluation-sign-heading">
          <h3>{title}</h3>
          <p>{helpText}</p>
        </div>

        <div className="new-evaluation-checkbox-grid">
          {signs.map((sign) => (
            <label
              key={sign.key}
              className={
                selectedSigns[sign.key]
                  ? "new-evaluation-checkbox active"
                  : "new-evaluation-checkbox"
              }
            >
              <input
                type="checkbox"
                checked={Boolean(selectedSigns[sign.key])}
                disabled={noPresentaSenales}
                onChange={() => toggleSign(sign.key)}
              />

              <span>{sign.label}</span>
            </label>
          ))}
        </div>
      </section>
    );
  };

  return (
    <main className="new-evaluation-page-wrapper">
      <Header2
        user={user}
        usuario={user}
        nombreUsuario={user?.nombre || user?.nombreCompleto || "Usuario"}
      />

      <section className="new-evaluation-layout">
        <SidebarNeoCare
          className="new-evaluation"
          activePath="/nueva-evaluacion"
        />

        <section className="new-evaluation-main">
          <header className="new-evaluation-header">
            <div>
              <h1>Nueva evaluación</h1>

              <p>
                Registra las señales actuales del recién nacido para generar un
                resultado actualizado de seguimiento.
              </p>
            </div>
          </header>

          <section className="new-evaluation-card only-signs">
            <div className="new-evaluation-form-area">
              <div className="new-evaluation-step-title">
                <span className="new-evaluation-step-image-box">
                  <img
                    src={datosBebeImage}
                    alt="Datos del bebé"
                    className="new-evaluation-step-image"
                  />
                </span>

                <div>
                  <h2>Señales actuales del bebé</h2>

                  <p>
                    Selecciona las señales que hayas observado recientemente.
                  </p>
                </div>
              </div>

              {renderSignGroup(
                "Manifestaciones clínicas de alarma neonatal",
                "Estas manifestaciones pueden requerir atención inmediata.",
                highRiskSigns,
                "high"
              )}

              {renderSignGroup(
                "Señales de vigilancia clínica",
                "Estas señales requieren observación cercana y posible consulta médica.",
                mediumRiskSigns,
                "medium"
              )}

              {renderSignGroup(
                "Cambios leves de observación domiciliaria",
                "Estos cambios pueden requerir observación en casa.",
                lowRiskSigns,
                "low"
              )}

              <label
                className={
                  noPresentaSenales
                    ? "new-evaluation-no-signs active"
                    : "new-evaluation-no-signs"
                }
              >
                <input
                  type="checkbox"
                  checked={noPresentaSenales}
                  onChange={toggleNoSigns}
                />

                <span>No presenta señales actualmente</span>
              </label>

              {errors.signs && (
                <p className="new-evaluation-error-message">{errors.signs}</p>
              )}

              <label className="new-evaluation-field full">
                <span>Observaciones adicionales</span>

                <textarea
                  placeholder="Escribe cualquier detalle que consideres importante..."
                  value={observaciones}
                  onChange={(event) => setObservaciones(event.target.value)}
                />
              </label>

              <div className="new-evaluation-safety-card">
                <strong>Importante</strong>

                <p>
                  NeoCare brinda orientación inicial y apoyo educativo, pero no
                  reemplaza la atención médica profesional. Si observas
                  dificultad respiratoria, convulsiones, coloración azulada,
                  rechazo total del alimento o empeoramiento rápido, acude al
                  centro de salud más cercano.
                </p>
              </div>

              <div className="new-evaluation-actions">
                <button
                  type="button"
                  className="new-evaluation-secondary-button"
                  onClick={() => navigate("/inicio")}
                >
                  ← Volver al inicio
                </button>

                <button
                  type="button"
                  className="new-evaluation-primary-button"
                  onClick={submitEvaluation}
                >
                  Realizar evaluación <span>›</span>
                </button>
              </div>
            </div>
          </section>
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default NewEvaluation;