import React, { useState } from "react";

import {

  actualizarVacunaBebe,

  guardarControlBebe,

} from "../../../services/api.js";



const hoyIso = () => new Date().toISOString().slice(0, 10);



const VacunasControles = ({ data, bebeId, onSaved }) => {

  const [controlForm, setControlForm] = useState({

    fechaControl: "",

    pesoKg: "",

    tallaCm: "",

    perimetroCefalicoCm: "",

    observaciones: "",

  });

  const [guardando, setGuardando] = useState(false);

  const [msg, setMsg] = useState(null);

  const [vacunaModal, setVacunaModal] = useState(null);

  const [fechaAplicacion, setFechaAplicacion] = useState(hoyIso());

  const [modalError, setModalError] = useState("");

  const [guardandoVacuna, setGuardandoVacuna] = useState(false);



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



  const abrirModalVacuna = (vacuna) => {

    setVacunaModal(vacuna);

    setFechaAplicacion(hoyIso());

    setModalError("");

  };



  const cerrarModalVacuna = () => {

    if (guardandoVacuna) return;

    setVacunaModal(null);

    setModalError("");

  };



  const confirmarVacuna = async (e) => {

    e.preventDefault();

    if (!vacunaModal || !bebeId) return;



    if (fechaAplicacion > hoyIso()) {

      setModalError("La fecha de aplicación no puede ser futura.");

      return;

    }



    setGuardandoVacuna(true);

    setModalError("");

    try {

      await actualizarVacunaBebe(bebeId, {

        nombreVacuna: vacunaModal.nombre,

        dosis: vacunaModal.dosis,

        fechaAplicacion,

        estado: "Aplicada",

      });

      setVacunaModal(null);

      onSaved?.();

    } catch (err) {

      setModalError(err.message);

    } finally {

      setGuardandoVacuna(false);

    }

  };



  const handleControlSubmit = async (e) => {

    e.preventDefault();

    if (!bebeId) return;



    if (controlForm.fechaControl > hoyIso()) {

      setMsg("La fecha del control no puede ser futura.");

      return;

    }



    setGuardando(true);

    setMsg(null);

    try {

      await guardarControlBebe(bebeId, {

        ...controlForm,

        pesoKg: Number(controlForm.pesoKg),

        tallaCm: Number(controlForm.tallaCm),

        perimetroCefalicoCm: Number(controlForm.perimetroCefalicoCm),

      });

      setControlForm({

        fechaControl: "",

        pesoKg: "",

        tallaCm: "",

        perimetroCefalicoCm: "",

        observaciones: "",

      });

      setMsg("Control registrado correctamente.");

      onSaved?.();

    } catch (err) {

      setMsg(err.message);

    } finally {

      setGuardando(false);

    }

  };



  return (

    <div className="modulo-vacunas">

      {vacunaModal && (

        <div

          className="neo-modal-overlay"

          role="presentation"

          onClick={cerrarModalVacuna}

        >

          <div

            className="neo-modal"

            role="dialog"

            aria-modal="true"

            aria-labelledby="vacuna-modal-title"

            onClick={(e) => e.stopPropagation()}

          >

            <h4 id="vacuna-modal-title">Marcar vacuna aplicada</h4>

            <p>

              <strong>{vacunaModal.nombre}</strong> ({vacunaModal.dosis})

            </p>

            <form className="neo-form" onSubmit={confirmarVacuna}>

              <label className="neo-form-field">

                Fecha de aplicación

                <input

                  type="date"

                  required

                  max={hoyIso()}

                  value={fechaAplicacion}

                  onChange={(e) => {

                    setFechaAplicacion(e.target.value);

                    setModalError("");

                  }}

                />

              </label>

              {modalError && <p className="neo-form-error">{modalError}</p>}

              <div className="neo-form-actions">

                <button

                  type="submit"

                  className="neo-btn-primary neo-btn-sm"

                  disabled={guardandoVacuna}

                >

                  {guardandoVacuna ? "Guardando..." : "Confirmar"}

                </button>

                <button

                  type="button"

                  className="neo-btn-secondary neo-btn-sm"

                  onClick={cerrarModalVacuna}

                  disabled={guardandoVacuna}

                >

                  Cancelar

                </button>

              </div>

            </form>

          </div>

        </div>

      )}



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

                <th>Acción</th>

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

                  <td>

                    {!v.cumplida && bebeId && (

                      <button

                        type="button"

                        className="neo-btn-outline neo-btn-sm"

                        onClick={() => abrirModalVacuna(v)}

                      >

                        Marcar aplicada

                      </button>

                    )}

                  </td>

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



        {bebeId && (

          <form className="vacunas-control-form" onSubmit={handleControlSubmit}>

            <h4>Registrar control de niño sano</h4>

            <label>

              Fecha

              <input

                type="date"

                required

                max={hoyIso()}

                value={controlForm.fechaControl}

                onChange={(e) =>

                  setControlForm({ ...controlForm, fechaControl: e.target.value })

                }

              />

            </label>

            <label>

              Peso (kg)

              <input

                type="number"

                step="0.01"

                required

                value={controlForm.pesoKg}

                onChange={(e) =>

                  setControlForm({ ...controlForm, pesoKg: e.target.value })

                }

              />

            </label>

            <label>

              Talla (cm)

              <input

                type="number"

                step="0.1"

                required

                value={controlForm.tallaCm}

                onChange={(e) =>

                  setControlForm({ ...controlForm, tallaCm: e.target.value })

                }

              />

            </label>

            <label>

              Perímetro cefálico (cm)

              <input

                type="number"

                step="0.1"

                required

                value={controlForm.perimetroCefalicoCm}

                onChange={(e) =>

                  setControlForm({

                    ...controlForm,

                    perimetroCefalicoCm: e.target.value,

                  })

                }

              />

            </label>

            <label>

              Observaciones

              <textarea

                value={controlForm.observaciones}

                onChange={(e) =>

                  setControlForm({ ...controlForm, observaciones: e.target.value })

                }

              />

            </label>

            {msg && (

              <p className={msg.includes("correctamente") ? "modulo-msg" : "neo-form-error"}>

                {msg}

              </p>

            )}

            <button type="submit" className="neo-btn-primary" disabled={guardando}>

              {guardando ? "Guardando..." : "Guardar control"}

            </button>

          </form>

        )}

      </section>

    </div>

  );

};



export default VacunasControles;


