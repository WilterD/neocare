import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../components/AppShell/AppShell.jsx";
import { getPerfilMe, updatePerfilMe } from "../../services/api.js";
import "../../styles/modulePage.css";

const PerfilEditar = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getPerfilMe().then((d) => {
      const r = d.registro || {};
      setForm({
        nombre: r.datosPersonales?.nombreCompleto,
        edad: r.datosPersonales?.edad,
        telefono: r.datosPersonales?.telefono,
        nivelEducativo: r.sociodemografica?.nivelEducativo,
        zonaResidencia: r.sociodemografica?.zonaResidencia,
        accesoCentroSalud: r.sociodemografica?.accesoCentroSalud,
        situacionEconomica: r.sociodemografica?.situacionEconomica,
        numeroNinosCuidado: r.condicionesCuidado?.numeroNinosCuidado,
        apoyoFamiliar: r.condicionesCuidado?.apoyoFamiliar,
        apoyoPrincipal: r.condicionesCuidado?.apoyoPrincipal,
        primeraVezCuidando: r.condicionesCuidado?.primeraVezCuidando,
        cuidaSinApoyo: r.condicionesCuidado?.cuidaSinApoyo,
      });
    });
  }, []);

  const guardar = async (e) => {
    e.preventDefault();
    await updatePerfilMe(form);
    setMsg("Perfil actualizado.");
    setTimeout(() => navigate("/perfil"), 1500);
  };

  return (
    <AppShell title="Editar perfil">
      <form className="module-form" onSubmit={guardar}>
        {["nombre", "edad", "telefono", "nivelEducativo", "zonaResidencia", "situacionEconomica", "apoyoPrincipal"].map((k) => (
          <label key={k}>{k}
            <input value={form[k] || ""} onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))} />
          </label>
        ))}
        <button type="submit" className="module-btn">Guardar</button>
      </form>
      {msg && <p className="module-success">{msg}</p>}
    </AppShell>
  );
};

export default PerfilEditar;
