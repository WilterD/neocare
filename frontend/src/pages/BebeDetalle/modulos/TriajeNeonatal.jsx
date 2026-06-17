import React from "react";

const COLOR = {
  Bajo: "#6fa04f",
  Moderado: "#e0a64a",
  Alto: "#c64a4a",
};

const TEXTO = {
  Bajo: "Riesgo bajo",
  Moderado: "Riesgo medio",
  Alto: "Riesgo alto",
};

const TriajeNeonatal = ({ data }) => {
  if (!data) {
    return (
      <div className="modulo-empty">
        <p>No hay datos de triaje para este bebé.</p>
      </div>
    );
  }

  const { catalogoSignos = [], evaluaciones = [], ultimaEvaluacion, meta = {} } = data;
  const rangos = meta.ranges || [];

  return (
    <div className="modulo-triaje">
      <section className="triaje-intro-card">
        <h3>Sistema de triaje neonatal</h3>
        <p>
          Este módulo educativo explica los <strong>niveles de riesgo</strong>{" "}
          que NeoCare asigna al recién nacido según los signos de alarma
          observados, su peso al nacer y los antecedentes clínicos. Los
          resultados se calculan de la misma forma que en el backend,
          respetando la escala de puntaje de la base de datos.
        </p>

        <div className="triaje-rangos">
          {rangos.map((r) => (
            <div
              key={r.level}
              className="triaje-rango"
              style={{ borderColor: r.color }}
            >
              <span
                className="triaje-rango-dot"
                style={{ background: r.color }}
              />
              <strong style={{ color: r.color }}>{r.level}</strong>
              <p>
                {r.min === r.max
                  ? `${r.min} puntos`
                  : `${r.min}–${r.max} puntos`}
              </p>
              <small>
                {meta.recommendations?.[r.level]?.title}
              </small>
            </div>
          ))}
        </div>
      </section>

      <section className="triaje-catalog-card">
        <h3>Catálogo de signos evaluados</h3>
        <p className="modulo-subtitle">
          Cada signo suma puntos al puntaje total. La presencia de cualquier
          signo de alto riesgo (3 puntos) eleva automáticamente el resultado a
          nivel Alto.
        </p>

        <div className="triaje-catalog-grid">
          {catalogoSignos.map((signo) => (
            <div
              key={signo.id}
              className={`triaje-signo-card ${signo.category}`}
            >
              <div className="triaje-signo-puntos">
                {signo.points} pt{signo.points > 1 ? "s" : ""}
              </div>
              <div className="triaje-signo-label">{signo.label}</div>
              <div className={`triaje-signo-categoria ${signo.category}`}>
                {signo.category === "alto"
                  ? "Alto"
                  : signo.category === "medio"
                  ? "Medio"
                  : "Bajo"}
              </div>
            </div>
          ))}
        </div>
      </section>

      {ultimaEvaluacion && (
        <section
          className="triaje-ultima-card"
          style={{ borderColor: COLOR[ultimaEvaluacion.nivel] || "#777" }}
        >
          <div>
            <span className="triaje-ultima-label">Última evaluación</span>
            <h3
              className="triaje-ultima-nivel"
              style={{ color: COLOR[ultimaEvaluacion.nivel] || "#343349" }}
            >
              {TEXTO[ultimaEvaluacion.nivel] || ultimaEvaluacion.nivel}
            </h3>
            <p>
              <strong>{ultimaEvaluacion.puntuacion} puntos</strong> ·{" "}
              {ultimaEvaluacion.fecha}
            </p>
          </div>
          <div className="triaje-ultima-recomendacion">
            <h4>{ultimaEvaluacion.recomendacion?.title}</h4>
            <p>{ultimaEvaluacion.recomendacion?.text}</p>
            <small>{ultimaEvaluacion.recomendacion?.followUp}</small>
          </div>
        </section>
      )}

      <section className="triaje-historial-card">
        <h3>Historial de evaluaciones</h3>
        {evaluaciones.length === 0 ? (
          <p className="modulo-empty">
            Aún no se han registrado evaluaciones de riesgo para este bebé.
          </p>
        ) : (
          <ol className="triaje-historial-list">
            {evaluaciones.map((ev) => (
              <li
                key={ev.id}
                className="triaje-historial-item"
                style={{ borderLeftColor: COLOR[ev.nivel] || "#777" }}
              >
                <div className="triaje-historial-header">
                  <span
                    className="triaje-historial-pill"
                    style={{ background: COLOR[ev.nivel] || "#777" }}
                  >
                    {TEXTO[ev.nivel] || ev.nivel}
                  </span>
                  <strong>{ev.fecha}</strong>
                  <span className="triaje-historial-score">
                    {ev.puntuacion} puntos
                  </span>
                </div>
                {ev.signosActivos && ev.signosActivos.length > 0 && (
                  <ul className="triaje-historial-signos">
                    {ev.signosActivos.map((s) => (
                      <li key={s.id}>
                        <span className={`dot ${s.category}`} />
                        {s.label}{" "}
                        <em>(+{s.points})</em>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="triaje-historial-recomendacion">
                  {ev.recomendacion?.text}
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
};

export default TriajeNeonatal;
