import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../components/AppShell/AppShell.jsx";
import { useBebeActivo } from "../../context/BebeActivoContext.jsx";
import { crearBebe } from "../../services/api.js";
import "../../styles/modulePage.css";

const BebeNuevo = () => {
  const navigate = useNavigate();
  const { cargarBebes } = useBebeActivo();
  const [bebe, setBebe] = useState({ nombreBebe: "", fechaNacimiento: "", sexo: "Masculino", pesoNacer: "", edadGestacional: "" });
  const [dc, setDc] = useState({ tipoParto: "Vaginal", complicacionesNacer: "No", hospitalizacionNeonatal: "No", cuidadosEspeciales: "No" });

  const guardar = async (e) => {
    e.preventDefault();
    await crearBebe({ bebe, datosClinicos: dc });
    await cargarBebes();
    navigate("/inicio");
  };

  return (
    <AppShell title="Registrar bebé">
      <form className="module-form" onSubmit={guardar}>
        <label>Nombre<input value={bebe.nombreBebe} onChange={(e) => setBebe((p) => ({ ...p, nombreBebe: e.target.value }))} required /></label>
        <label>Fecha nacimiento (dd/mm/aaaa)<input value={bebe.fechaNacimiento} onChange={(e) => setBebe((p) => ({ ...p, fechaNacimiento: e.target.value }))} required /></label>
        <label>Peso (g)<input type="number" value={bebe.pesoNacer} onChange={(e) => setBebe((p) => ({ ...p, pesoNacer: e.target.value }))} required /></label>
        <label>Edad gestacional<input type="number" value={bebe.edadGestacional} onChange={(e) => setBebe((p) => ({ ...p, edadGestacional: e.target.value }))} required /></label>
        <button type="submit" className="module-btn">Registrar</button>
      </form>
    </AppShell>
  );
};

export default BebeNuevo;
