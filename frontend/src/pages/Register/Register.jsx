import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import dtImage from "../../assets/DT.png";

const Register = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [datosPersonales, setDatosPersonales] = useState({
    nombreCompleto: "",
    edad: "",
    numeroIdentificacion: "",
    telefono: "",
    correo: "",
    password: "",
    confirmPassword: "",
  });

  const [sociodemografica, setSociodemografica] = useState({
    nivelEducativo: "",
    zonaResidencia: "",
    accesoCentroSalud: "",
    situacionEconomica: "",
  });

  const [condicionesCuidado, setCondicionesCuidado] = useState({
    relacionRecienNacido: "",
    primeraVezCuidando: "",
    cuidaSinApoyo: "",
    numeroNinosCuidado: "",
    apoyoFamiliar: "",
    apoyoPrincipal: "",
  });

  const [recienNacido, setRecienNacido] = useState({
    nombreBebe: "",
    fechaNacimiento: "",
    sexo: "",
    pesoNacer: "",
    edadGestacional: "",
  });

  const [datosClinicos, setDatosClinicos] = useState({
    tipoParto: "",
    complicacionesNacer: "",
    complicacion: "",
    hospitalizacionNeonatal: "",
    motivoHospitalizacion: "",
    duracionHospitalizacion: "",
    cuidadosEspeciales: "",
    tipoCuidadoRecibido: "",
  });

  const [consentimientoAceptado, setConsentimientoAceptado] = useState(false);
  const [consentimientoError, setConsentimientoError] = useState("");
  const [formError, setFormError] = useState("");

  const handlePersonalInputChange = (event) => {
    const { name, value } = event.target;

    setDatosPersonales((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormError("");
  };

  const handleOptionSelect = (field, value) => {
    setSociodemografica((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFormError("");
  };

  const optionClass = (field, value) => {
    return sociodemografica[field] === value
      ? "option-pill active"
      : "option-pill";
  };

  const handleCareOptionSelect = (field, value) => {
    setCondicionesCuidado((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFormError("");
  };

  const careOptionClass = (field, value) => {
    return condicionesCuidado[field] === value
      ? "option-pill active"
      : "option-pill";
  };

  const handleCareInputChange = (event) => {
    const { name, value } = event.target;

    setCondicionesCuidado((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormError("");
  };

  const formatFechaNacimiento = (value) => {
    const soloNumeros = value.replace(/\D/g, "").slice(0, 8);

    if (soloNumeros.length <= 2) {
      return soloNumeros;
    }

    if (soloNumeros.length <= 4) {
      return `${soloNumeros.slice(0, 2)}/${soloNumeros.slice(2)}`;
    }

    return `${soloNumeros.slice(0, 2)}/${soloNumeros.slice(
      2,
      4
    )}/${soloNumeros.slice(4)}`;
  };

  const handleBabyInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "fechaNacimiento") {
      setRecienNacido((prev) => ({
        ...prev,
        fechaNacimiento: formatFechaNacimiento(value),
      }));

      setFormError("");
      return;
    }

    setRecienNacido((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormError("");
  };

  const handleBabyOptionSelect = (field, value) => {
    setRecienNacido((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFormError("");
  };

  const babyOptionClass = (field, value) => {
    return recienNacido[field] === value
      ? "option-pill active"
      : "option-pill";
  };

  const handleClinicalOptionSelect = (field, value) => {
    setDatosClinicos((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      if (field === "complicacionesNacer" && value === "No") {
        updated.complicacion = "";
      }

      if (field === "hospitalizacionNeonatal" && value === "No") {
        updated.motivoHospitalizacion = "";
        updated.duracionHospitalizacion = "";
      }

      if (field === "cuidadosEspeciales" && value !== "Sí") {
        updated.tipoCuidadoRecibido = "";
      }

      return updated;
    });

    setFormError("");
  };

  const clinicalOptionClass = (field, value) => {
    return datosClinicos[field] === value
      ? "option-pill active"
      : "option-pill";
  };

  const handleClinicalInputChange = (event) => {
    const { name, value } = event.target;

    setDatosClinicos((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormError("");
  };

  const obtenerFechaNacimientoValida = () => {
    if (!recienNacido.fechaNacimiento) return null;

    const partes = recienNacido.fechaNacimiento.split("/");

    if (partes.length !== 3) return null;

    const dia = Number(partes[0]);
    const mes = Number(partes[1]);
    const anio = Number(partes[2]);

    if (!dia || !mes || !anio) return null;
    if (dia < 1 || dia > 31) return null;
    if (mes < 1 || mes > 12) return null;
    if (anio < 1900) return null;

    const fecha = new Date(anio, mes - 1, dia);

    if (
      fecha.getDate() !== dia ||
      fecha.getMonth() !== mes - 1 ||
      fecha.getFullYear() !== anio
    ) {
      return null;
    }

    return fecha;
  };

  const calcularDiasDesdeNacimiento = () => {
    const fechaNacimiento = obtenerFechaNacimientoValida();

    if (!fechaNacimiento) return null;

    const fechaActual = new Date();

    fechaNacimiento.setHours(0, 0, 0, 0);
    fechaActual.setHours(0, 0, 0, 0);

    const diferenciaMs = fechaActual.getTime() - fechaNacimiento.getTime();
    const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));

    return dias;
  };

  const calcularEdadActual = () => {
    const fechaNacimiento = obtenerFechaNacimientoValida();

    if (!fechaNacimiento) return "";

    const fechaActual = new Date();

    fechaNacimiento.setHours(0, 0, 0, 0);
    fechaActual.setHours(0, 0, 0, 0);

    if (fechaNacimiento > fechaActual) {
      return "Fecha no válida";
    }

    let años = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
    let meses = fechaActual.getMonth() - fechaNacimiento.getMonth();
    let dias = fechaActual.getDate() - fechaNacimiento.getDate();

    if (dias < 0) {
      meses -= 1;

      const ultimoDiaMesAnterior = new Date(
        fechaActual.getFullYear(),
        fechaActual.getMonth(),
        0
      ).getDate();

      dias += ultimoDiaMesAnterior;
    }

    if (meses < 0) {
      años -= 1;
      meses += 12;
    }

    if (años === 0 && meses === 0) {
      if (dias === 0) return "0 días";
      if (dias === 1) return "1 día";
      return `${dias} días`;
    }

    if (años === 0) {
      if (meses === 1 && dias === 0) return "1 mes";
      if (meses === 1) return `1 mes y ${dias} días`;
      if (dias === 0) return `${meses} meses`;
      return `${meses} meses y ${dias} días`;
    }

    if (meses === 0 && dias === 0) {
      return años === 1 ? "1 año" : `${años} años`;
    }

    if (meses === 0) {
      return años === 1
        ? `1 año y ${dias} días`
        : `${años} años y ${dias} días`;
    }

    if (dias === 0) {
      return años === 1
        ? `1 año y ${meses} meses`
        : `${años} años y ${meses} meses`;
    }

    return años === 1
      ? `1 año, ${meses} meses y ${dias} días`
      : `${años} años, ${meses} meses y ${dias} días`;
  };

  const clasificarEdadNeonatal = () => {
    const dias = calcularDiasDesdeNacimiento();

    if (dias === null) return "Pendiente";
    if (dias < 0) return "Fecha no válida";
    if (dias <= 28) return "Dentro del periodo neonatal";

    return "Fuera del periodo neonatal";
  };

  const clasificarPeso = () => {
    const peso = Number(recienNacido.pesoNacer);

    if (!peso) return "Pendiente";
    if (peso < 2500) return "Bajo peso";

    return "Adecuado";
  };

  const clasificarEdadGestacional = () => {
    const semanas = Number(recienNacido.edadGestacional);

    if (!semanas) return "Pendiente";
    if (semanas < 37) return "Prematuro";

    return "Término";
  };

  const validarPasoActual = () => {
    if (step === 1) {
      const {
        nombreCompleto,
        edad,
        numeroIdentificacion,
        telefono,
        correo,
        password,
        confirmPassword,
      } = datosPersonales;

      if (
        !nombreCompleto.trim() ||
        !edad.trim() ||
        !numeroIdentificacion.trim() ||
        !telefono.trim() ||
        !correo.trim() ||
        !password.trim() ||
        !confirmPassword.trim()
      ) {
        return "Debes completar todos los datos personales y de acceso para continuar.";
      }

      if (Number(edad) <= 0) {
        return "La edad debe ser mayor a 0.";
      }

      if (!correo.includes("@") || !correo.includes(".")) {
        return "Debes ingresar un correo electrónico válido.";
      }

      if (password.length < 6) {
        return "La contraseña debe tener al menos 6 caracteres.";
      }

      if (password !== confirmPassword) {
        return "Las contraseñas no coinciden. Verifica ambos campos.";
      }
    }

    if (step === 2) {
      const {
        nivelEducativo,
        zonaResidencia,
        accesoCentroSalud,
        situacionEconomica,
      } = sociodemografica;

      if (
        !nivelEducativo ||
        !zonaResidencia ||
        !accesoCentroSalud ||
        !situacionEconomica
      ) {
        return "Debes seleccionar todas las opciones de información sociodemográfica.";
      }
    }

    if (step === 3) {
      const {
        relacionRecienNacido,
        primeraVezCuidando,
        cuidaSinApoyo,
        numeroNinosCuidado,
        apoyoFamiliar,
        apoyoPrincipal,
      } = condicionesCuidado;

      if (
        !relacionRecienNacido ||
        !primeraVezCuidando ||
        !cuidaSinApoyo ||
        !numeroNinosCuidado ||
        !apoyoFamiliar ||
        !apoyoPrincipal
      ) {
        return "Debes completar todas las condiciones de cuidado para continuar.";
      }

      if (Number(numeroNinosCuidado) <= 0) {
        return "El número de hijos o niños bajo tu cuidado debe ser mayor a 0.";
      }
    }

    if (step === 4) {
      const { nombreBebe, fechaNacimiento, sexo, pesoNacer, edadGestacional } =
        recienNacido;

      if (
        !nombreBebe.trim() ||
        !fechaNacimiento.trim() ||
        !sexo ||
        !pesoNacer ||
        !edadGestacional
      ) {
        return "Debes completar todos los datos del recién nacido para continuar.";
      }

      if (!obtenerFechaNacimientoValida()) {
        return "Debes ingresar una fecha de nacimiento válida en formato dd/mm/aaaa.";
      }

      if (calcularDiasDesdeNacimiento() < 0) {
        return "La fecha de nacimiento no puede ser futura.";
      }

      if (Number(pesoNacer) <= 0) {
        return "El peso al nacer debe ser mayor a 0 gramos.";
      }

      if (Number(edadGestacional) <= 0) {
        return "La edad gestacional debe ser mayor a 0 semanas.";
      }
    }

    if (step === 5) {
      const {
        tipoParto,
        complicacionesNacer,
        complicacion,
        hospitalizacionNeonatal,
        motivoHospitalizacion,
        duracionHospitalizacion,
        cuidadosEspeciales,
        tipoCuidadoRecibido,
      } = datosClinicos;

      if (
        !tipoParto ||
        !complicacionesNacer ||
        !hospitalizacionNeonatal ||
        !cuidadosEspeciales
      ) {
        return "Debes completar los datos clínicos neonatales para continuar.";
      }

      if (complicacionesNacer === "Sí" && !complicacion) {
        return "Debes seleccionar cuál fue la complicación al nacer.";
      }

      if (
        hospitalizacionNeonatal === "Sí" &&
        (!motivoHospitalizacion.trim() || !duracionHospitalizacion)
      ) {
        return "Debes indicar el motivo y la duración de la hospitalización.";
      }

      if (cuidadosEspeciales === "Sí" && !tipoCuidadoRecibido) {
        return "Debes seleccionar el tipo de cuidado recibido.";
      }
    }

    if (step === 6 && !consentimientoAceptado) {
      return "Debes aceptar el consentimiento informado para finalizar el registro.";
    }

    return "";
  };

  const handleNext = () => {
    const error = validarPasoActual();

    if (error) {
      setFormError(error);

      if (step === 6) {
        setConsentimientoError(error);
      }

      return;
    }

    setFormError("");
    setConsentimientoError("");

    if (step < 6) {
      setStep(step + 1);
      return;
    }

    const usuarioRegistrado = {
      nombre: datosPersonales.nombreCompleto.trim(),
      nombreCompleto: datosPersonales.nombreCompleto.trim(),
      edad: datosPersonales.edad,
      numeroIdentificacion: datosPersonales.numeroIdentificacion,
      telefono: datosPersonales.telefono,
      correo: datosPersonales.correo,
      password: datosPersonales.password,
      datosPersonales,
      sociodemografica,
      condicionesCuidado,
      recienNacido: {
        ...recienNacido,
        edadActual: calcularEdadActual(),
        clasificacionEdadNeonatal: clasificarEdadNeonatal(),
        clasificacionPeso: clasificarPeso(),
        clasificacionEdadGestacional: clasificarEdadGestacional(),
      },
      datosClinicos,
      consentimientoAceptado,
    };

    localStorage.setItem("neocareUser", JSON.stringify(usuarioRegistrado));
    localStorage.setItem(
      "neocareRegisterData",
      JSON.stringify(usuarioRegistrado)
    );

    navigate("/evaluacion", {
      state: {
        user: usuarioRegistrado,
        registro: usuarioRegistrado,
      },
    });
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      setFormError("");
      setConsentimientoError("");
    }
  };

  return (
    <main className="register-page">
      <Header />

      <section className="register-screen">
        <header className="register-top no-back-button">
          <div className="register-title-area">
            <h1>Registro por pasos</h1>
            <p>Paso {step} de 6</p>
          </div>

          <div className="help-tooltip-wrapper">
            <button type="button" className="corner-button help">
              ?
            </button>

            <div className="help-tooltip">
              <div className="help-tooltip-icon">...</div>

              <div className="help-tooltip-text">
                <strong>¿Necesitas ayuda?</strong>
                <p>Estamos aquí para ayudarte.</p>
              </div>

              <button type="button" className="help-contact-button">
                Contáctanos <span>›</span>
              </button>
            </div>
          </div>
        </header>

        <section className="top-progress">
          {[1, 2, 3, 4, 5, 6].map((number) => (
            <div className="top-progress-item" key={number}>
              <button
                type="button"
                className={number <= step ? "top-step active" : "top-step"}
                tabIndex="-1"
              >
                {number}
              </button>

              {number < 6 && (
                <span
                  className={number < step ? "top-line active" : "top-line"}
                ></span>
              )}
            </div>
          ))}
        </section>

        <section className="register-main">
          <section className="register-card">
            <div className="card-illustration">
              <img
                src={dtImage}
                alt="Ilustración de datos personales"
                className="register-main-image"
              />
            </div>

            <div className="form-side">
              {step === 1 && (
                <>
                  <div className="register-card-title">
                    <h2>Datos personales y acceso</h2>
                  </div>

                  <form className="register-form">
                    <section className="register-form-section">
                      <div className="register-section-title">
                        <h3>Información personal</h3>
                        <p>
                          Ingresa los datos básicos de la madre o cuidadora
                          principal.
                        </p>
                      </div>

                      <label>
                        Nombre completo
                        <div className="input-box">
                          <input
                            type="text"
                            name="nombreCompleto"
                            value={datosPersonales.nombreCompleto}
                            onChange={handlePersonalInputChange}
                            placeholder="Escribe tu nombre completo"
                          />
                        </div>
                      </label>

                      <label>
                        Edad
                        <div className="input-box">
                          <input
                            type="number"
                            name="edad"
                            min="12"
                            max="60"
                            value={datosPersonales.edad}
                            onChange={handlePersonalInputChange}
                            placeholder="Escribe tu edad"
                          />
                        </div>
                      </label>

                      <label>
                        Número de identificación
                        <div className="input-box">
                          <input
                            type="text"
                            name="numeroIdentificacion"
                            value={datosPersonales.numeroIdentificacion}
                            onChange={handlePersonalInputChange}
                            placeholder="Ej. 1234567890"
                          />
                        </div>
                      </label>

                      <label>
                        Teléfono
                        <div className="input-box">
                          <input
                            type="tel"
                            name="telefono"
                            value={datosPersonales.telefono}
                            onChange={handlePersonalInputChange}
                            placeholder="Ej. 098 765 4321"
                          />
                        </div>
                      </label>
                    </section>

                    <section className="register-form-section access-section">
                      <div className="register-section-title">
                        <h3>Datos de acceso</h3>
                        <p>
                          Crea las credenciales que permitirán iniciar sesión en
                          la plataforma.
                        </p>
                      </div>

                      <label>
                        Correo electrónico
                        <div className="input-box">
                          <input
                            type="email"
                            name="correo"
                            value={datosPersonales.correo}
                            onChange={handlePersonalInputChange}
                            placeholder="Ej. correo@ejemplo.com"
                          />
                        </div>
                      </label>

                      <label>
                        Contraseña
                        <div className="input-box">
                          <input
                            type="password"
                            name="password"
                            value={datosPersonales.password}
                            onChange={handlePersonalInputChange}
                            placeholder="Crea una contraseña"
                          />
                        </div>
                      </label>

                      <label>
                        Confirmar contraseña
                        <div className="input-box">
                          <input
                            type="password"
                            name="confirmPassword"
                            value={datosPersonales.confirmPassword}
                            onChange={handlePersonalInputChange}
                            placeholder="Repite la contraseña"
                          />
                        </div>
                      </label>
                    </section>

                    <div className="secure-box">
                      <span>▣</span>
                      <p>
                        Tu información está segura y será utilizada solo para
                        apoyar el seguimiento neonatal.
                      </p>
                    </div>
                  </form>
                </>
              )}

              {step === 2 && (
                <div className="option-step">
                  <h2>Información sociodemográfica</h2>
                  <p>
                    Estos datos nos permiten ofrecerte recomendaciones adaptadas.
                  </p>

                  <div className="option-group">
                    <h3>Nivel educativo</h3>

                    <div className="option-row">
                      {["Ninguno", "Básico", "Medio", "Superior"].map(
                        (opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            className={optionClass("nivelEducativo", opcion)}
                            onClick={() =>
                              handleOptionSelect("nivelEducativo", opcion)
                            }
                          >
                            {opcion}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="option-group">
                    <h3>Zona de residencia</h3>

                    <div className="option-row">
                      {["Urbana", "Rural"].map((opcion) => (
                        <button
                          key={opcion}
                          type="button"
                          className={optionClass("zonaResidencia", opcion)}
                          onClick={() =>
                            handleOptionSelect("zonaResidencia", opcion)
                          }
                        >
                          {opcion}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="option-group">
                    <h3>¿Tienes acceso a un centro de salud cercano?</h3>

                    <div className="option-row">
                      {["Sí", "No"].map((opcion) => (
                        <button
                          key={opcion}
                          type="button"
                          className={optionClass("accesoCentroSalud", opcion)}
                          onClick={() =>
                            handleOptionSelect("accesoCentroSalud", opcion)
                          }
                        >
                          {opcion}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="option-group">
                    <h3>Situación económica del hogar</h3>

                    <div className="option-row">
                      {["Baja", "Media", "Alta"].map((opcion) => (
                        <button
                          key={opcion}
                          type="button"
                          className={optionClass(
                            "situacionEconomica",
                            opcion
                          )}
                          onClick={() =>
                            handleOptionSelect("situacionEconomica", opcion)
                          }
                        >
                          {opcion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="option-step">
                  <h2>Condiciones de cuidado</h2>
                  <p>
                    Estos datos permiten conocer el entorno de apoyo y cuidado
                    del recién nacido.
                  </p>

                  <div className="option-group">
                    <h3>¿Cuál es tu relación con el recién nacido?</h3>

                    <div className="option-row">
                      {[
                        "Madre",
                        "Padre",
                        "Abuela",
                        "Tía",
                        "Otro cuidador",
                      ].map((opcion) => (
                        <button
                          key={opcion}
                          type="button"
                          className={careOptionClass(
                            "relacionRecienNacido",
                            opcion
                          )}
                          onClick={() =>
                            handleCareOptionSelect(
                              "relacionRecienNacido",
                              opcion
                            )
                          }
                        >
                          {opcion}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="option-group">
                    <h3>¿Es tu primera vez cuidando a un recién nacido?</h3>

                    <div className="option-row">
                      {["Sí", "No"].map((opcion) => (
                        <button
                          key={opcion}
                          type="button"
                          className={careOptionClass(
                            "primeraVezCuidando",
                            opcion
                          )}
                          onClick={() =>
                            handleCareOptionSelect(
                              "primeraVezCuidando",
                              opcion
                            )
                          }
                        >
                          {opcion}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="option-group">
                    <h3>¿Cuidas al recién nacido sin apoyo constante?</h3>

                    <div className="option-row">
                      {["Sí", "No"].map((opcion) => (
                        <button
                          key={opcion}
                          type="button"
                          className={careOptionClass("cuidaSinApoyo", opcion)}
                          onClick={() =>
                            handleCareOptionSelect("cuidaSinApoyo", opcion)
                          }
                        >
                          {opcion}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="option-group">
                    <h3>Número de hijos o niños bajo tu cuidado</h3>
                    <p className="option-help">Incluye al recién nacido.</p>

                    <input
                      className="care-number-input"
                      type="number"
                      min="1"
                      name="numeroNinosCuidado"
                      value={condicionesCuidado.numeroNinosCuidado}
                      onChange={handleCareInputChange}
                      placeholder="Ej. 1"
                    />
                  </div>

                  <div className="option-group">
                    <h3>¿Cuentas con apoyo familiar o de otra persona?</h3>

                    <div className="option-row">
                      {["Sí", "No"].map((opcion) => (
                        <button
                          key={opcion}
                          type="button"
                          className={careOptionClass("apoyoFamiliar", opcion)}
                          onClick={() =>
                            handleCareOptionSelect("apoyoFamiliar", opcion)
                          }
                        >
                          {opcion}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="option-group">
                    <h3>¿Quién te apoya principalmente?</h3>

                    <div className="option-row">
                      {[
                        "Pareja",
                        "Familiar",
                        "Amiga/vecina",
                        "Personal de salud",
                        "Otro",
                      ].map((opcion) => (
                        <button
                          key={opcion}
                          type="button"
                          className={careOptionClass("apoyoPrincipal", opcion)}
                          onClick={() =>
                            handleCareOptionSelect("apoyoPrincipal", opcion)
                          }
                        >
                          {opcion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="option-step">
                  <h2>Datos del recién nacido</h2>
                  <p>
                    Registra la información básica del bebé para realizar una
                    clasificación inicial.
                  </p>

                  <div className="baby-form-grid">
                    <label>
                      Nombre del bebé
                      <input
                        className="baby-input"
                        type="text"
                        name="nombreBebe"
                        value={recienNacido.nombreBebe}
                        onChange={handleBabyInputChange}
                        placeholder="Escribe el nombre del bebé"
                      />
                    </label>

                    <label>
                      Fecha de nacimiento
                      <input
                        className="baby-input"
                        type="text"
                        name="fechaNacimiento"
                        value={recienNacido.fechaNacimiento}
                        onChange={handleBabyInputChange}
                        placeholder="dd/mm/aaaa"
                        maxLength="10"
                      />
                    </label>

                    <label>
                      Edad actual
                      <input
                        className="baby-input"
                        type="text"
                        value={calcularEdadActual()}
                        placeholder="Se calcula automáticamente"
                        readOnly
                      />
                    </label>

                    <div className="option-group baby-sex-group">
                      <h3>Sexo</h3>

                      <div className="option-row">
                        {["Masculino", "Femenino"].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            className={babyOptionClass("sexo", opcion)}
                            onClick={() =>
                              handleBabyOptionSelect("sexo", opcion)
                            }
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <label>
                      Peso al nacer
                      <input
                        className="baby-input"
                        type="number"
                        name="pesoNacer"
                        value={recienNacido.pesoNacer}
                        onChange={handleBabyInputChange}
                        placeholder="Ej. 3200"
                      />
                      <span className="input-helper">En gramos.</span>
                    </label>

                    <label>
                      Edad gestacional
                      <input
                        className="baby-input"
                        type="number"
                        name="edadGestacional"
                        value={recienNacido.edadGestacional}
                        onChange={handleBabyInputChange}
                        placeholder="Ej. 39"
                      />
                      <span className="input-helper">En semanas.</span>
                    </label>
                  </div>

                  <div className="baby-classification-card">
                    <h3>Clasificación inicial automática</h3>

                    <div className="classification-row">
                      <span>Edad neonatal:</span>
                      <strong>{clasificarEdadNeonatal()}</strong>
                    </div>

                    <div className="classification-row">
                      <span>Peso al nacer:</span>
                      <strong>{clasificarPeso()}</strong>
                    </div>

                    <div className="classification-row">
                      <span>Edad gestacional:</span>
                      <strong>{clasificarEdadGestacional()}</strong>
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="option-step clinical-step">
                  <h2>Datos clínicos neonatales</h2>
                  <p>
                    Registra los antecedentes del nacimiento para identificar
                    posibles condiciones que requieran mayor seguimiento.
                  </p>

                  <div className="option-group">
                    <h3>Tipo de parto</h3>

                    <div className="option-row">
                      {["Vaginal", "Cesárea", "Vaginal instrumentado"].map(
                        (opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            className={clinicalOptionClass(
                              "tipoParto",
                              opcion
                            )}
                            onClick={() =>
                              handleClinicalOptionSelect("tipoParto", opcion)
                            }
                          >
                            {opcion}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="option-group">
                    <h3>¿Hubo complicaciones al nacer?</h3>

                    <div className="option-row">
                      {["Sí", "No"].map((opcion) => (
                        <button
                          key={opcion}
                          type="button"
                          className={clinicalOptionClass(
                            "complicacionesNacer",
                            opcion
                          )}
                          onClick={() =>
                            handleClinicalOptionSelect(
                              "complicacionesNacer",
                              opcion
                            )
                          }
                        >
                          {opcion}
                        </button>
                      ))}
                    </div>
                  </div>

                  {datosClinicos.complicacionesNacer === "Sí" && (
                    <div className="option-group conditional-group">
                      <h3>¿Cuál fue la complicación?</h3>

                      <div className="option-row">
                        {[
                          "Dificultad respiratoria",
                          "Ictericia",
                          "Infección",
                          "Bajo peso",
                          "Problemas de alimentación",
                          "Otra",
                        ].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            className={clinicalOptionClass(
                              "complicacion",
                              opcion
                            )}
                            onClick={() =>
                              handleClinicalOptionSelect(
                                "complicacion",
                                opcion
                              )
                            }
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="option-group">
                    <h3>¿El bebé requirió hospitalización neonatal?</h3>

                    <div className="option-row">
                      {["Sí", "No"].map((opcion) => (
                        <button
                          key={opcion}
                          type="button"
                          className={clinicalOptionClass(
                            "hospitalizacionNeonatal",
                            opcion
                          )}
                          onClick={() =>
                            handleClinicalOptionSelect(
                              "hospitalizacionNeonatal",
                              opcion
                            )
                          }
                        >
                          {opcion}
                        </button>
                      ))}
                    </div>
                  </div>

                  {datosClinicos.hospitalizacionNeonatal === "Sí" && (
                    <>
                      <div className="option-group conditional-group">
                        <h3>Motivo de hospitalización</h3>

                        <textarea
                          className="clinical-textarea"
                          name="motivoHospitalizacion"
                          value={datosClinicos.motivoHospitalizacion}
                          onChange={handleClinicalInputChange}
                          placeholder="Describe brevemente el motivo"
                        />
                      </div>

                      <div className="option-group conditional-group">
                        <h3>Duración aproximada de la hospitalización</h3>

                        <div className="option-row">
                          {["1 día", "2 a 3 días", "Más de 3 días"].map(
                            (opcion) => (
                              <button
                                key={opcion}
                                type="button"
                                className={clinicalOptionClass(
                                  "duracionHospitalizacion",
                                  opcion
                                )}
                                onClick={() =>
                                  handleClinicalOptionSelect(
                                    "duracionHospitalizacion",
                                    opcion
                                  )
                                }
                              >
                                {opcion}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="option-group">
                    <h3>¿Requirió cuidados especiales al nacer?</h3>

                    <div className="option-row">
                      {["Sí", "No", "No lo sé"].map((opcion) => (
                        <button
                          key={opcion}
                          type="button"
                          className={clinicalOptionClass(
                            "cuidadosEspeciales",
                            opcion
                          )}
                          onClick={() =>
                            handleClinicalOptionSelect(
                              "cuidadosEspeciales",
                              opcion
                            )
                          }
                        >
                          {opcion}
                        </button>
                      ))}
                    </div>
                  </div>

                  {datosClinicos.cuidadosEspeciales === "Sí" && (
                    <div className="option-group conditional-group">
                      <h3>Tipo de cuidado recibido</h3>

                      <div className="option-row">
                        {[
                          "Oxígeno",
                          "Incubadora",
                          "Fototerapia",
                          "Antibióticos",
                          "Observación médica",
                          "Otro",
                        ].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            className={clinicalOptionClass(
                              "tipoCuidadoRecibido",
                              opcion
                            )}
                            onClick={() =>
                              handleClinicalOptionSelect(
                                "tipoCuidadoRecibido",
                                opcion
                              )
                            }
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="clinical-info-card">
                    <h3>Esta información ayuda al seguimiento</h3>
                    <p>
                      Los antecedentes del nacimiento permiten identificar si el
                      recién nacido requiere mayor vigilancia durante sus
                      primeros días de vida.
                    </p>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="consent-step">
                  <h2>Consentimiento informado</h2>

                  <div className="consent-card">
                    <p>
                      Al continuar, autorizas a NeoCare a registrar y almacenar
                      la información que proporciones sobre ti, el recién nacido
                      y su entorno de cuidado, con el propósito de apoyar el
                      seguimiento neonatal durante los primeros 28 días de vida.
                    </p>

                    <p>
                      La información personal, sociodemográfica y clínica
                      registrada será tratada de forma confidencial y utilizada
                      únicamente para generar una orientación inicial sobre el
                      nivel de seguimiento requerido. NeoCare no reemplaza la
                      valoración médica profesional ni constituye un diagnóstico
                      clínico. Ante cualquier signo de alarma, emergencia o duda
                      sobre el estado de salud del recién nacido, debes acudir a
                      un centro de salud o consultar con personal médico
                      calificado.
                    </p>

                    <p>
                      Puedes actualizar tu información o solicitar la eliminación
                      de tus datos cuando lo consideres necesario, de acuerdo con
                      las políticas de privacidad de la aplicación.
                    </p>
                  </div>

                  <label className="consent-checkbox">
                    <input
                      type="checkbox"
                      checked={consentimientoAceptado}
                      onChange={(event) => {
                        setConsentimientoAceptado(event.target.checked);

                        if (event.target.checked) {
                          setConsentimientoError("");
                          setFormError("");
                        }
                      }}
                    />

                    <span>
                      He leído y acepto los términos del consentimiento
                      informado.
                    </span>
                  </label>

                  {consentimientoError && (
                    <p className="consent-error">{consentimientoError}</p>
                  )}
                </div>
              )}
            </div>
          </section>
        </section>

        {formError && <p className="step-error">{formError}</p>}

        <footer
          className={
            step === 1 ? "register-actions first-step" : "register-actions"
          }
        >
          {step > 1 && (
            <button
              type="button"
              className="btn-secondary"
              onClick={handlePrevious}
            >
              ← Anterior
            </button>
          )}

          <button
            type="button"
            className={
              step === 6 && !consentimientoAceptado
                ? "btn-primary btn-disabled"
                : "btn-primary"
            }
            onClick={handleNext}
          >
            {step === 6 ? "Finalizar" : "Siguiente →"}
          </button>
        </footer>
      </section>

      <Footer />
    </main>
  );
};

export default Register;