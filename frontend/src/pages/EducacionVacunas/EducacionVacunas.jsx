import React from "react";
import { useNavigate } from "react-router-dom";
import "./EducacionVacunas.css";

import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import SidebarNeoCare from "../../components/SidebarNeoCare/SidebarNeoCare.jsx";

import vacuImage from "../../assets/VACU.png";
import controlImage from "../../assets/CONTROL.png";
import pesoImage from "../../assets/Peso.png";
import gorroImage from "../../assets/GORRO.png";
import duvidaImage from "../../assets/DUDA.png";
import flechImage from "../../assets/FLECH.png";
import saImage from "../../assets/SA.png";

const VACUNAS = [
  {
    nombre: "BCG",
    dosis: "Única",
    momento: "Al nacer",
    previene: "Tuberculosis meníngea y miliar",
  },
  {
    nombre: "Hepatitis B (RN)",
    dosis: "Primera",
    momento: "En las primeras 24 horas de vida",
    previene: "Hepatitis B",
  },
  {
    nombre: "Pentavalente (1ra)",
    dosis: "Primera",
    momento: "A los 2 meses",
    previene: "Difteria, tétanos, tosferina, polio y Haemophilus influenzae tipo b",
  },
  {
    nombre: "Polio (1ra)",
    dosis: "Primera",
    momento: "A los 2 meses",
    previene: "Poliomielitis",
  },
  {
    nombre: "Rotavirus (1ra)",
    dosis: "Primera",
    momento: "A los 2 meses",
    previene: "Gastroenteritis severa por rotavirus",
  },
  {
    nombre: "Neumococo conjugada (1ra)",
    dosis: "Primera",
    momento: "A los 2 meses",
    previene: "Neumonía, meningitis y otitis por neumococo",
  },
  {
    nombre: "Pentavalente (2da)",
    dosis: "Segunda",
    momento: "A los 4 meses",
    previene: "Difteria, tétanos, tosferina, polio y Hib",
  },
  {
    nombre: "Polio (2da)",
    dosis: "Segunda",
    momento: "A los 4 meses",
    previene: "Poliomielitis",
  },
  {
    nombre: "Rotavirus (2da)",
    dosis: "Segunda",
    momento: "A los 4 meses",
    previene: "Gastroenteritis por rotavirus",
  },
  {
    nombre: "Neumococo conjugada (2da)",
    dosis: "Segunda",
    momento: "A los 4 meses",
    previene: "Infecciones por neumococo",
  },
  {
    nombre: "Pentavalente (3ra)",
    dosis: "Tercera",
    momento: "A los 6 meses",
    previene: "Difteria, tétanos, tosferina, polio y Hib",
  },
  {
    nombre: "Polio (3ra)",
    dosis: "Tercera",
    momento: "A los 6 meses",
    previene: "Poliomielitis",
  },
  {
    nombre: "Neumococo conjugada (3ra)",
    dosis: "Tercera",
    momento: "Entre los 9 y 12 meses",
    previene: "Infecciones por neumococo",
  },
  {
    nombre: "SRP (Triple Viral)",
    dosis: "Primera",
    momento: "Al año de edad",
    previene: "Sarampión, rubéola y parotiditis",
  },
  {
    nombre: "Fiebre Amarilla",
    dosis: "Única",
    momento: "Al año (zonas endémicas)",
    previene: "Fiebre amarilla",
  },
];

const CONTROLES = [
  {
    edad: "7 días",
    titulo: "Primer control del recién nacido",
    descripcion:
      "Evaluación inicial tras el alta hospitalaria. Verifica peso, talla, perímetro cefálico, alimentación y signos de alarma.",
  },
  {
    edad: "1 mes",
    titulo: "Control del mes de vida",
    descripcion:
      "Control de crecimiento y desarrollo. Refuerzo de lactancia materna y orientación a la familia.",
  },
  {
    edad: "2 meses",
    titulo: "Control de los 2 meses",
    descripcion:
      "Control de crecimiento, aplicación del esquema de vacunas y tamizaje del desarrollo.",
  },
  {
    edad: "4 meses",
    titulo: "Control de los 4 meses",
    descripcion:
      "Control de crecimiento, segunda dosis de vacunas y orientación sobre alimentación complementaria.",
  },
  {
    edad: "6 meses",
    titulo: "Control de los 6 meses",
    descripcion:
      "Inicio de alimentación complementaria, control de peso y talla, evaluación del desarrollo motor.",
  },
  {
    edad: "9 meses",
    titulo: "Control de los 9 meses",
    descripcion:
      "Refuerzo de vacunas, evaluación del desarrollo y tamizaje de anemia según el caso.",
  },
  {
    edad: "12 meses",
    titulo: "Control del año de vida",
    descripcion:
      "Vacunas del año, evaluación del desarrollo psicomotor y nutrición.",
  },
];

const EducacionVacunas = () => {
  const navigate = useNavigate();

  return (
    <main className="edu-vac-page-wrapper">
      <Header2 />

      <section className="edu-vac-desktop">
        <SidebarNeoCare className="edu-vac" activePath="/educacion" />

        <section className="edu-vac-main-panel">
          <header className="edu-vac-topbar">
            <button
              type="button"
              className="edu-vac-back-button"
              onClick={() => navigate("/educacion")}
            >
              <img src={flechImage} alt="Volver" className="flip" />
              Volver a Educación
            </button>
          </header>

          <section className="edu-vac-hero">
            <div className="edu-vac-hero-text">
              <span className="edu-vac-hero-label">Módulo educativo</span>
              <h1>Vacunas y controles del bebé</h1>
              <p>
                Conoce el <strong>esquema nacional de vacunación</strong> y
                los <strong>controles de niño sano</strong> recomendados
                durante el primer año de vida. La vacunación oportuna y los
                controles periódicos son la base de una infancia saludable.
              </p>
              <div className="edu-vac-hero-tags">
                <span className="edu-vac-tag">Esquema PAI/OPS</span>
                <span className="edu-vac-tag">15 vacunas</span>
                <span className="edu-vac-tag">7 controles</span>
              </div>
            </div>
            <div className="edu-vac-hero-image-box">
              <img src={vacuImage} alt="Vacunas y controles" />
            </div>
          </section>

          <section className="edu-vac-intro-card">
            <h3>¿Por qué son importantes las vacunas y los controles?</h3>
            <p>
              Las <strong>vacunas</strong> protegen al bebé contra
              enfermedades potencialmente graves como tuberculosis,
              hepatitis B, poliomielitis, sarampión o neumonía. Aplicarlas en
              las fechas indicadas es esencial para que el niño esté
              protegido desde los primeros meses de vida.
            </p>
            <p>
              Los <strong>controles de niño sano</strong> permiten vigilar
              el crecimiento (peso, talla, perímetro cefálico), evaluar el
              desarrollo psicomotor y detectar a tiempo cualquier alteración.
              Son la mejor oportunidad para resolver dudas sobre
              alimentación, sueño, vacunas o crianza.
            </p>
          </section>

          <section className="edu-vac-vacunas-card">
            <div className="edu-vac-section-title">
              <img src={vacuImage} alt="Vacunas" />
              <h3>Esquema nacional de vacunación</h3>
            </div>
            <p className="edu-vac-subtitle">
              El esquema combina vacunas individuales y combinadas. Las
              edades son tentativas a partir de la fecha de nacimiento.
              Aplicarlas a tiempo es clave para la protección del bebé.
            </p>
            <div className="edu-vac-vacunas-grid">
              {VACUNAS.map((v, idx) => (
                <div key={idx} className="edu-vac-vacuna">
                  <div className="edu-vac-vacuna-head">
                    <strong>{v.nombre}</strong>
                    <span className="edu-vac-vacuna-dosis">{v.dosis}</span>
                  </div>
                  <div className="edu-vac-vacuna-momento">
                    <span className="edu-vac-vacuna-icono">⏱</span>
                    {v.momento}
                  </div>
                  <div className="edu-vac-vacuna-previene">
                    <span className="edu-vac-vacuna-label">Previene</span>
                    {v.previene}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="edu-vac-controles-card">
            <div className="edu-vac-section-title">
              <img src={controlImage} alt="Controles" />
              <h3>Controles de niño sano</h3>
            </div>
            <p className="edu-vac-subtitle">
              Controles periódicos de crecimiento y desarrollo sugeridos por
              la OMS/OPS durante el primer año. Asiste a cada uno puntualmente.
            </p>
            <div className="edu-vac-controles-linea">
              {CONTROLES.map((c, idx) => (
                <div key={idx} className="edu-vac-control">
                  <div className="edu-vac-control-punto">
                    <span className="edu-vac-control-num">{idx + 1}</span>
                  </div>
                  <div className="edu-vac-control-info">
                    <span className="edu-vac-control-edad">{c.edad}</span>
                    <strong>{c.titulo}</strong>
                    <p>{c.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="edu-vac-crecimiento-card">
            <div className="edu-vac-section-title">
              <img src={pesoImage} alt="Crecimiento" />
              <h3>Curva de crecimiento</h3>
            </div>
            <p>
              En cada control se registran tres medidas clave del bebé:
            </p>
            <div className="edu-vac-medidas-grid">
              <div className="edu-vac-medida">
                <strong>Peso</strong>
                <p>
                  Es la medida más sensible para detectar desnutrición,
                  deshidratación o problemas de alimentación.
                </p>
              </div>
              <div className="edu-vac-medida">
                <strong>Talla</strong>
                <p>
                  Permite evaluar el crecimiento lineal a lo largo del
                  tiempo.
                </p>
              </div>
              <div className="edu-vac-medida">
                <strong>Perímetro cefálico</strong>
                <p>
                  Refleja el crecimiento del cerebro. Alteraciones marcadas
                  ameritan evaluación especializada.
                </p>
              </div>
            </div>
            <p className="edu-vac-crecimiento-nota">
              NeoCare compara las medidas del bebé con las{" "}
              <strong>tablas de referencia de la OMS</strong> y clasifica
              percentiles para detectar valores fuera del rango esperado.
            </p>
          </section>

          <section className="edu-vac-consejos-card">
            <div className="edu-vac-section-title">
              <img src={gorroImage} alt="Consejos" />
              <h3>Consejos prácticos</h3>
            </div>
            <ul className="edu-vac-consejos-list">
              <li>
                <strong>Lleva siempre la tarjeta de vacunación</strong> y
                enséñala en cada consulta.
              </li>
              <li>
                <strong>No faltes a los controles</strong> aunque el bebé
                parezca sano: muchas condiciones se detectan solo en consulta.
              </li>
              <li>
                <strong>Respeta los intervalos</strong> entre dosis: cada
                refuerzo aumenta la protección.
              </li>
              <li>
                <strong>Si el bebé está enfermo</strong> el día de la
                vacuna, consulta con el profesional de salud si es
                conveniente posponerla.
              </li>
              <li>
                <strong>Comunica reacciones</strong> inusuales tras la
                vacuna (fiebre alta, llanto persistente, alergias).
              </li>
              <li>
                <strong>Confía en el esquema oficial</strong>: las vacunas
                incluidas son seguras y gratuitas.
              </li>
            </ul>
          </section>

          <section className="edu-vac-recordatorio-card">
            <img src={duvidaImage} alt="Recordatorio" />
            <div>
              <h3>Importante</h3>
              <p>
                El esquema de vacunación puede variar ligeramente según el
                país o la región. NeoCare te ayuda a llevar el control
                personalizado de tu bebé, pero sigue siempre las indicaciones
                del personal de salud local.
              </p>
              <button
                type="button"
                className="edu-vac-recordatorio-button"
                onClick={() => navigate("/bebes")}
              >
                Ver mis bebés
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

export default EducacionVacunas;
