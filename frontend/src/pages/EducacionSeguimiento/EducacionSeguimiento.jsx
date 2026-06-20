import React from "react";
import { useNavigate } from "react-router-dom";
import "./EducacionSeguimiento.css";

import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import SidebarNeoCare from "../../components/SidebarNeoCare/SidebarNeoCare.jsx";

import realizarEImage from "../../assets/RealizarE.png";
import saImage from "../../assets/SA.png";
import gorroImage from "../../assets/GORRO.png";
import duvidaImage from "../../assets/DUDA.png";

const ITEMS = [
  { id: "alimentacion_normal", label: "Se alimenta con normalidad" },
  { id: "alimentacion_rechazo", label: "Rechazo alimentario" },
  { id: "temperatura_fiebre", label: "Fiebre" },
  { id: "temperatura_frio", label: "Hipotermia" },
  { id: "actividad_normal", label: "Actividad habitual" },
  { id: "actividad_letargo", label: "Letargo o somnolencia excesiva" },
  { id: "respiracion_normal", label: "Respiración normal" },
  { id: "respiracion_dificultad", label: "Dificultad respiratoria" },
  { id: "piel_normal", label: "Coloración normal de la piel" },
  { id: "piel_alteracion", label: "Alteraciones en la piel" },
  { id: "eliminacion_panales", label: "Pañales mojados con regularidad" },
  { id: "eliminacion_deposiciones", label: "Deposiciones normales" },
  { id: "llanto_normal", label: "Llanto consolable" },
  { id: "llanto_alteracion", label: "Llanto inconsolable" },
  { id: "alarma_convulsiones", label: "Convulsiones" },
  { id: "alarma_vomito", label: "Vómitos repetitivos" },
  { id: "alarma_empeoramiento", label: "Empeoramiento general" },
];

const EducacionSeguimiento = () => {
  const navigate = useNavigate();

  return (
    <main className="edu-seg-page-wrapper">
      <Header2 />

      <section className="edu-seg-desktop">
        <SidebarNeoCare className="edu-seg" activePath="/educacion" />

        <section className="edu-seg-main-panel">
          <section className="edu-seg-hero">
            <div className="edu-seg-hero-text">
              <span className="edu-seg-hero-label">Módulo educativo</span>
              <h1>Seguimiento diario del recién nacido</h1>

              <p>
                Después de una evaluación de triaje, NeoCare permite registrar
                la <strong>evolución del bebé durante 5 días</strong>{" "}
                consecutivos. Cada día se evalúan 17 indicadores para confirmar
                la mejoría o detectar empeoramiento.
              </p>

              <div className="edu-seg-hero-tags">
                <span className="edu-seg-tag">5 días</span>
                <span className="edu-seg-tag">17 indicadores</span>
                <span className="edu-seg-tag">Verde / Amarillo / Rojo</span>
              </div>
            </div>

            <div className="edu-seg-hero-image-box">
              <img src={realizarEImage} alt="Seguimiento diario" />
            </div>
          </section>

          <section className="edu-seg-intro-card">
            <h3>¿Qué es el seguimiento diario?</h3>

            <p>
              Es un control estructurado que la madre, el cuidador o el
              personal de salud realiza al bebé durante{" "}
              <strong>5 días seguidos</strong> luego de un triaje. Permite
              confirmar que los signos observados están mejorando, se mantienen
              estables o están empeorando, y tomar decisiones oportunas.
            </p>

            <p>
              El seguimiento <strong>se activa después de una evaluación de
              triaje</strong>, especialmente cuando el nivel de riesgo es
              moderado. Los resultados se clasifican en tres colores:
            </p>
          </section>

          <section className="edu-seg-leyenda-card">
            <h3>Clasificación por colores</h3>

            <div className="edu-seg-leyenda-grid">
              <article className="edu-seg-leyenda verde">
                <div className="edu-seg-leyenda-head">
                  <span className="dot" style={{ background: "#6fa04f" }} />
                  <h4>Verde</h4>
                </div>

                <p className="edu-seg-leyenda-titulo">Evolución favorable</p>

                <p>
                  El bebé muestra mejoría o estabilidad. Continúa con la
                  observación diaria y los cuidados generales.
                </p>
              </article>

              <article className="edu-seg-leyenda amarillo">
                <div className="edu-seg-leyenda-head">
                  <span className="dot" style={{ background: "#e0a64a" }} />
                  <h4>Amarillo</h4>
                </div>

                <p className="edu-seg-leyenda-titulo">Vigilancia reforzada</p>

                <p>
                  Hay señales que no han mejorado lo suficiente. Mantente atenta
                  y consulta a un profesional de salud en menos de 24 horas.
                </p>
              </article>

              <article className="edu-seg-leyenda rojo">
                <div className="edu-seg-leyenda-head">
                  <span className="dot" style={{ background: "#c64a4a" }} />
                  <h4>Rojo</h4>
                </div>

                <p className="edu-seg-leyenda-titulo">
                  Atención médica inmediata
                </p>

                <p>
                  Se detectaron señales de alarma o empeoramiento. Acude de
                  inmediato al centro de salud más cercano.
                </p>
              </article>
            </div>
          </section>

          <section className="edu-seg-reglas-card">
            <h3>Reglas de clasificación</h3>

            <p className="edu-seg-subtitle">
              Cada día se evalúan los indicadores con tres posibles valores:
              <strong> Mejoró · Igual · Empeoró</strong>. La combinación de
              estos valores determina el color del día.
            </p>

            <div className="edu-seg-reglas-grid">
              <div className="edu-seg-regla rojo">
                <div className="edu-seg-regla-head">
                  <span
                    className="edu-seg-regla-pill"
                    style={{ background: "#c64a4a" }}
                  >
                    Rojo
                  </span>
                  <h4>Cualquier "Empeoró"</h4>
                </div>

                <p>
                  Si en algún indicador el bebé está{" "}
                  <strong>empeorando</strong>, ese día se clasifica como rojo,
                  sin importar el resto.
                </p>
              </div>

              <div className="edu-seg-regla amarillo">
                <div className="edu-seg-regla-head">
                  <span
                    className="edu-seg-regla-pill"
                    style={{ background: "#e0a64a" }}
                  >
                    Amarillo
                  </span>
                  <h4>Tres o más "Igual"</h4>
                </div>

                <p>
                  Si tres o más indicadores se mantienen{" "}
                  <strong>iguales</strong> y ninguno empeora, el día se
                  clasifica como amarillo, es decir, vigilancia reforzada.
                </p>
              </div>

              <div className="edu-seg-regla verde">
                <div className="edu-seg-regla-head">
                  <span
                    className="edu-seg-regla-pill"
                    style={{ background: "#6fa04f" }}
                  >
                    Verde
                  </span>
                  <h4>Resto de los casos</h4>
                </div>

                <p>
                  Si la mayoría de los indicadores <strong>mejoraron</strong>{" "}
                  o se mantienen sin empeorar, el día se considera de evolución
                  favorable.
                </p>
              </div>
            </div>
          </section>

          <section className="edu-seg-items-card">
            <div className="edu-seg-section-title">
              <img src={saImage} alt="Indicadores" />
              <h3>Los 17 indicadores evaluados</h3>
            </div>

            <p className="edu-seg-subtitle">
              Cada uno de estos indicadores se evalúa durante los 5 días.
              Conoce qué observar y cuándo marcar Mejoró, Igual o Empeoró.
            </p>

            <div className="edu-seg-items-grid">
              {ITEMS.map((it, idx) => (
                <div key={it.id} className="edu-seg-item">
                  <span className="edu-seg-item-num">{idx + 1}</span>
                  <span className="edu-seg-item-label">{it.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="edu-seg-comofunciona-card">
            <div className="edu-seg-section-title">
              <img src={gorroImage} alt="Cómo funciona" />
              <h3>¿Cómo se registra?</h3>
            </div>

            <ol className="edu-seg-pasos">
              <li>
                <strong>Realiza una evaluación de triaje</strong> del bebé
                desde la pantalla de evaluación.
              </li>

              <li>
                Si el resultado lo recomienda, NeoCare activará el{" "}
                <strong>seguimiento de 5 días</strong>.
              </li>

              <li>
                Cada día, marca el estado de los 17 indicadores: Mejoró, Igual
                o Empeoró.
              </li>

              <li>
                NeoCare clasificará el día en{" "}
                <strong>Verde, Amarillo o Rojo</strong> automáticamente.
              </li>

              <li>
                Revisa el resumen de tendencia: si los días van mejorando,
                manteniéndose o empeorando.
              </li>

              <li>
                Ante cualquier día <strong>Rojo</strong>, acude de inmediato al
                centro de salud.
              </li>
            </ol>
          </section>

          <section className="edu-seg-recordatorio-card">
            <img src={duvidaImage} alt="Recordatorio" />

            <div>
              <h3>Importante</h3>

              <p>
                El seguimiento diario es una herramienta poderosa para detectar
                a tiempo cambios en la condición del bebé, pero{" "}
                <strong>no sustituye</strong> el control médico profesional.
                Ante cualquier duda, siempre consulta con tu profesional de
                salud de confianza.
              </p>

              <button
                type="button"
                className="edu-seg-recordatorio-button"
                onClick={() => navigate("/evaluacion")}
              >
                Realizar evaluación
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

export default EducacionSeguimiento;