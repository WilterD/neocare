import React from "react";

const VacunasControles = ({ data }) => {
  if (!data) {
    return (
      <div className="modulo-empty">
        <p>No hay datos de vacunas y controles para este bebé.</p>
      </div>
    );
  }

  const {
    planVacunas = [],
    planControles = [],
    crecimiento = null,
    resumen = {},
  } = data;

  return (
    <div className="modulo-vacunas">
      <section className="vacunas-intro-card">
        <h3>Vacunas y controles del bebé</h3>
        <p>
          Este módulo educativo organiza el <strong>esquema nacional de
          vacunación</strong> y los <strong>controles de niño sano</strong>{" "}
          según la edad del bebé, cruzando la información registrada en
          NeoCare. Los planes se calculan a partir de la fecha de nacimiento
          y se actualizan automáticamente.
        </p>

        <div className="vacunas-resumen-grid">
          <div className="vacunas-resumen-stat aplicadas">
            <span>Vacunas aplicadas</span>
            <strong>
              {resumen.vacunasAplicadas || 0}/{resumen.totalVacunas || 0}
            </strong>
          </div>
          <div className="vacunas-resumen-stat pendientes">
            <span>Pendientes</span>
            <strong>{resumen.vacunasPendientes || 0}</strong>
          </div>
          <div className="vacunas-resumen-stat atrasadas">
            <span>Atrasadas</span>
            <strong>{resumen.vacunasAtrasadas || 0}</strong>
          </div>
          <div className="vacunas-resumen-stat controles">
            <span>Controles</span>
            <strong>
              {resumen.controlesRealizados || 0}/{resumen.totalControles || 0}
            </strong>
          </div>
        </div>
      </section>

      <section className="vacunas-section-card">
        <h3>Esquema de vacunación</h3>
        <p className="modulo-subtitle">
          Basado en el PAI y recomendaciones OPS/OMS. Las fechas son tentativas
          a partir de la fecha de nacimiento.
        </p>
        <div className="vacunas-tabla-wrapper">
          <table className="vacunas-tabla">
            <thead>
              <tr>
                <th>Vacuna</th>
                <th>Dosis</th>
                <th>Programada</th>
                <th>Aplicada</th>
                <th>Estado</th>
                <th>Previene</th>
              </tr>
            </thead>
            <tbody>
              {planVacunas.map((v) => (
                <tr key={v.id} className={v.cumplida ? "fila-cumplida" : ""}>
                  <td>
                    <strong>{v.nombre}</strong>
                    <p className="vacunas-descripcion">{v.descripcion}</p>
                  </td>
                  <td>{v.dosis}</td>
                  <td>
                    {v.fechaProgramada}
                    {!v.cumplida && v.diasRestantes !== null && (
                      <small className="vacunas-restantes">
                        {v.diasRestantes > 0
                          ? ` · faltan ${v.diasRestantes} días`
                          : " · vencida"}
                      </small>
                    )}
                  </td>
                  <td>{v.fechaAplicacion || "—"}</td>
                  <td>
                    <span
                      className={`vacunas-estado-badge ${v.estado.toLowerCase()}`}
                    >
                      {v.estado}
                    </span>
                  </td>
                  <td>{v.enfermedadPreviene}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="vacunas-section-card">
        <h3>Controles de niño sano</h3>
        <p className="modulo-subtitle">
          Controles de crecimiento y desarrollo sugeridos por la OMS/OPS para
          el primer año de vida.
        </p>
        <div className="vacunas-controles-grid">
          {planControles.map((c) => (
            <article
              key={c.id}
              className={`vacunas-control-card ${
                c.realizado ? "realizado" : "pendiente"
              }`}
            >
              <div className="vacunas-control-cabecera">
                <strong>{c.titulo}</strong>
                <span
                  className={`vacunas-estado-badge ${
                    c.realizado ? "aplicada" : "pendiente"
                  }`}
                >
                  {c.realizado ? "Realizado" : "Programado"}
                </span>
              </div>
              <p className="vacunas-control-fecha">
                Fecha sugerida: {c.fechaProgramada}
              </p>
              <p className="vacunas-control-descripcion">{c.descripcion}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="vacunas-section-card">
        <h3>Curva de crecimiento</h3>
        {crecimiento && crecimiento.clasificacion ? (
          <div className="vacunas-crecimiento-grid">
            <div className="vacunas-crecimiento-datos">
              <div>
                <span>Edad</span>
                <strong>
                  {crecimiento.edadEnMeses} meses
                </strong>
              </div>
              <div>
                <span>Peso</span>
                <strong>{crecimiento.ultimoControl.pesoKg} kg</strong>
              </div>
              <div>
                <span>Talla</span>
                <strong>{crecimiento.ultimoControl.tallaCm} cm</strong>
              </div>
              <div>
                <span>Perímetro cefálico</span>
                <strong>
                  {crecimiento.ultimoControl.perimetroCefalicoCm} cm
                </strong>
              </div>
              <div>
                <span>Último control</span>
                <strong>{crecimiento.ultimoControl.fecha}</strong>
              </div>
            </div>
            <div className="vacunas-crecimiento-percentiles">
              <h4>Clasificación percentilar (referencia OMS)</h4>
              <p>
                Categoría:{" "}
                <strong>{crecimiento.clasificacion.categoria}</strong>
              </p>
              <ul>
                <li>
                  P3: <strong>{crecimiento.clasificacion.p3?.toFixed(2)} kg</strong>
                </li>
                <li>
                  P15: <strong>{crecimiento.clasificacion.p15?.toFixed(2)} kg</strong>
                </li>
                <li>
                  P50: <strong>{crecimiento.clasificacion.p50?.toFixed(2)} kg</strong>
                </li>
                <li>
                  P85: <strong>{crecimiento.clasificacion.p85?.toFixed(2)} kg</strong>
                </li>
                <li>
                  P97: <strong>{crecimiento.clasificacion.p97?.toFixed(2)} kg</strong>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <p className="modulo-empty">
            Aún no se han registrado controles de niño sano para este bebé.
            Cuando se ingrese el primer control (peso, talla y perímetro
            cefálico), se mostrará la clasificación percentilar.
          </p>
        )}
      </section>
    </div>
  );
};

export default VacunasControles;
