import React from "react";

const COLOR = {
  Verde: "#6fa04f",
  Amarillo: "#e0a64a",
  Rojo: "#c64a4a",
};

const SeguimientoDiario = ({ data }) => {
  if (!data) {
    return (
      <div className="modulo-empty">
        <p>No hay datos de seguimiento para este bebé.</p>
      </div>
    );
  }

  const { meta = {}, triajes = [], resumenGlobal = {} } = data;
  const items = meta.items || [];
  const recomendaciones = meta.recomendaciones || {};

  return (
    <div className="modulo-seguimiento">
      <section className="seguimiento-intro-card">
        <h3>Seguimiento diario del recién nacido</h3>
        <p>
          Después de cada evaluación de triaje, NeoCare permite registrar la
          evolución del bebé durante{" "}
          <strong>{meta.totalDias || 5} días</strong>. Cada día se evalúan{" "}
          {items.length} indicadores con tres posibles valores:
        </p>

        <div className="seguimiento-leyenda">
          <div
            className="seguimiento-leyenda-item"
            style={{ borderColor: COLOR.Verde }}
          >
            <span
              className="dot"
              style={{ background: COLOR.Verde }}
            />
            <strong>Verde</strong>
            <p>Evolución favorable. Continuar con cuidados generales.</p>
          </div>
          <div
            className="seguimiento-leyenda-item"
            style={{ borderColor: COLOR.Amarillo }}
          >
            <span
              className="dot"
              style={{ background: COLOR.Amarillo }}
            />
            <strong>Amarillo</strong>
            <p>
              Vigilancia reforzada. {recomendaciones.Amarillo?.text}
            </p>
          </div>
          <div
            className="seguimiento-leyenda-item"
            style={{ borderColor: COLOR.Rojo }}
          >
            <span
              className="dot"
              style={{ background: COLOR.Rojo }}
            />
            <strong>Rojo</strong>
            <p>{recomendaciones.Rojo?.text}</p>
          </div>
        </div>

        <ul className="seguimiento-reglas">
          <li>
            <strong>Regla Rojo:</strong> cualquier ítem en estado
            <em> "Empeoró"</em> marca el día como Rojo.
          </li>
          <li>
            <strong>Regla Amarillo:</strong> tres o más ítems en
            <em> "Igual"</em> clasifican el día como Amarillo.
          </li>
          <li>
            <strong>Regla Verde:</strong> el resto de los casos se consideran
            de evolución favorable.
          </li>
        </ul>
      </section>

      {resumenGlobal && resumenGlobal.totalDias > 0 && (
        <section className="seguimiento-resumen-card">
          <h3>Resumen global de seguimiento</h3>
          <div className="seguimiento-resumen-grid">
            <div className="seguimiento-resumen-stat">
              <span>Días registrados</span>
              <strong>{resumenGlobal.totalDias}</strong>
            </div>
            <div className="seguimiento-resumen-stat verde">
              <span>Días Verde</span>
              <strong>{resumenGlobal.distribucion?.Verde || 0}</strong>
            </div>
            <div className="seguimiento-resumen-stat amarillo">
              <span>Días Amarillo</span>
              <strong>{resumenGlobal.distribucion?.Amarillo || 0}</strong>
            </div>
            <div className="seguimiento-resumen-stat rojo">
              <span>Días Rojo</span>
              <strong>{resumenGlobal.distribucion?.Rojo || 0}</strong>
            </div>
            <div className="seguimiento-resumen-stat tendencia">
              <span>Tendencia</span>
              <strong>{resumenGlobal.tendencia || "Estable"}</strong>
            </div>
          </div>
        </section>
      )}

      {triajes.length === 0 ? (
        <section className="seguimiento-empty">
          <p>
            Este bebé aún no tiene días de seguimiento registrados. Cuando se
            realice una evaluación de triaje con nivel de riesgo medio o
            seguimiento recomendado, podrás comenzar a registrar la evolución
            diaria.
          </p>
        </section>
      ) : (
        triajes.map((triaje) => (
          <section
            key={triaje.evaluacionRiesgoId}
            className="seguimiento-triaje-card"
          >
            <header className="seguimiento-triaje-header">
              <div>
                <h3>
                  Triaje #{triaje.evaluacionRiesgoId} · {triaje.totalDias} día
                  {triaje.totalDias > 1 ? "s" : ""} registrado
                  {triaje.totalDias > 1 ? "s" : ""}
                </h3>
                <p>
                  Resultado del último día:{" "}
                  <strong
                    style={{ color: COLOR[triaje.resumen.ultimoResultado] }}
                  >
                    {triaje.resumen.ultimoResultado}
                  </strong>{" "}
                  · Tendencia: {triaje.resumen.tendencia}
                </p>
              </div>

              <div className="seguimiento-dias-tira">
                {triaje.dias.map((d) => (
                  <div
                    key={d.id}
                    className={`seguimiento-dia-pill ${d.clasificacion.resultado.toLowerCase()}`}
                    title={`Día ${d.dia} · ${d.clasificacion.resultado}`}
                  >
                    <span className="seguimiento-dia-numero">{d.dia}</span>
                    <span className="seguimiento-dia-resultado">
                      {d.clasificacion.resultado}
                    </span>
                  </div>
                ))}
              </div>
            </header>

            <div className="seguimiento-dias-grid">
              {triaje.dias.map((d) => (
                <article
                  key={d.id}
                  className={`seguimiento-dia-card ${d.clasificacion.resultado.toLowerCase()}`}
                >
                  <header>
                    <strong>Día {d.dia}</strong>
                    <span className="seguimiento-dia-fecha">{d.fecha}</span>
                  </header>
                  <div
                    className="seguimiento-dia-barra"
                    style={{
                      background: COLOR[d.clasificacion.resultado],
                    }}
                  />
                  <p className="seguimiento-dia-recomendacion">
                    {d.clasificacion.recomendacion?.text}
                  </p>
                  <details>
                    <summary>Ver detalles del día</summary>
                    <ul className="seguimiento-items-list">
                      {items.map((it) => {
                        const valor = d.registro[it.id];
                        return (
                          <li key={it.id}>
                            <span className="seguimiento-item-label">
                              {it.label}
                            </span>
                            <span
                              className={`seguimiento-item-valor ${
                                valor === "Empeoró"
                                  ? "empeoro"
                                  : valor === "Mejoró"
                                  ? "mejoro"
                                  : ""
                              }`}
                            >
                              {valor}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                </article>
              ))}
            </div>
          </section>
        ))
      )}

      <section className="seguimiento-info-card">
        <h3>Indicadores evaluados</h3>
        <p className="modulo-subtitle">
          Cada día se diligencian {items.length} indicadores. A continuación
          se muestra el catálogo completo:
        </p>
        <ul className="seguimiento-items-catalog">
          {items.map((it) => (
            <li key={it.id}>
              <span className="dot neutral" />
              {it.label}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default SeguimientoDiario;
