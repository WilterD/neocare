import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import "./Bebes.css";



import Header2 from "../../components/Header2/Header2.jsx";

import Footer from "../../components/Footer/Footer.jsx";

import SidebarNeoCare from "../../components/SidebarNeoCare/SidebarNeoCare.jsx";

import { crearBebe } from "../../services/api.js";

import {

  formatFechaNacimiento,

  validarFechaNacimiento,

} from "../../utils/fechaNacimiento.js";



const BebeNuevo = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({

    nombreBebe: "",

    fechaNacimiento: "",

    sexo: "Masculino",

    pesoNacer: "",

    edadGestacional: "",

    tipoParto: "Vaginal",

    complicacionesNacer: "No",

    hospitalizacionNeonatal: "No",

    cuidadosEspeciales: "No",

  });

  const [error, setError] = useState("");



  const handleChange = (e) => {

    const { name, value } = e.target;

    setError("");

    setForm({

      ...form,

      [name]:

        name === "fechaNacimiento" ? formatFechaNacimiento(value) : value,

    });

  };



  const handleSubmit = async (e) => {

    e.preventDefault();



    const fechaError = validarFechaNacimiento(form.fechaNacimiento);

    if (fechaError) {

      setError(fechaError);

      return;

    }



    const pesoNum = Number(form.pesoNacer);

    if (pesoNum < 500 || pesoNum > 6000) {

      setError("El peso al nacer debe estar entre 500 y 6000 gramos.");

      return;

    }



    const egNum = Number(form.edadGestacional);

    if (egNum < 20 || egNum > 45) {

      setError("La edad gestacional debe estar entre 20 y 45 semanas.");

      return;

    }



    try {

      const data = await crearBebe(form);

      navigate(`/bebes/${data.bebe.id}`);

    } catch (err) {

      setError(err.message);

    }

  };



  return (

    <main className="bebes-page-wrapper">

      <Header2 />

      <section className="bebes-desktop">

        <SidebarNeoCare className="bebes" activePath="/bebes" />

        <section className="bebes-main-panel">

          <h1>Registrar nuevo bebé</h1>

          <form className="neo-form bebes-form-card" onSubmit={handleSubmit}>

            <label className="neo-form-field">

              Nombre del bebé

              <input

                name="nombreBebe"

                value={form.nombreBebe}

                onChange={handleChange}

                required

              />

            </label>

            <label className="neo-form-field">

              Fecha nacimiento (dd/mm/aaaa)

              <input

                name="fechaNacimiento"

                value={form.fechaNacimiento}

                onChange={handleChange}

                placeholder="dd/mm/aaaa"

                inputMode="numeric"

                required

              />

            </label>

            <label className="neo-form-field">

              Peso al nacer (g)

              <input

                name="pesoNacer"

                type="number"

                min="500"

                max="6000"

                value={form.pesoNacer}

                onChange={handleChange}

                required

              />

            </label>

            <label className="neo-form-field">

              Edad gestacional (sem)

              <input

                name="edadGestacional"

                type="number"

                min="20"

                max="45"

                value={form.edadGestacional}

                onChange={handleChange}

                required

              />

            </label>

            <label className="neo-form-field">

              Sexo

              <select name="sexo" value={form.sexo} onChange={handleChange}>

                <option>Masculino</option>

                <option>Femenino</option>

              </select>

            </label>

            {error && <p className="neo-form-error">{error}</p>}

            <div className="neo-form-actions">

              <button type="submit" className="neo-btn-primary">

                Guardar bebé

              </button>

              <button

                type="button"

                className="neo-btn-secondary"

                onClick={() => navigate("/bebes")}

              >

                Cancelar

              </button>

            </div>

          </form>

        </section>

      </section>

      <Footer />

    </main>

  );

};



export default BebeNuevo;


