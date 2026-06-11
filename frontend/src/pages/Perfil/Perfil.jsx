import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../components/AppShell/AppShell.jsx";
import { getPerfilMe } from "../../services/api.js";
import "./Perfil.css";
import "../../styles/modulePage.css";

const Perfil = () => {
  const navigate = useNavigate();
  const [registro, setRegistro] = useState(null);

  useEffect(() => {
    getPerfilMe()
      .then((d) => setRegistro(d.registro))
      .catch(() => {
        const r = localStorage.getItem("neocareRegisterData");
        if (r) setRegistro(JSON.parse(r));
      });
  }, []);

  const dp = registro?.datosPersonales || {};
  const sd = registro?.sociodemografica || {};

  return (
    <AppShell title="Mi perfil">
      {!registro ? <p>Cargando...</p> : (
        <>
          <ul className="perfil-list">
            <li><strong>Nombre:</strong> {dp.nombreCompleto}</li>
            <li><strong>Correo:</strong> {dp.correo}</li>
            <li><strong>Teléfono:</strong> {dp.telefono}</li>
            <li><strong>Edad:</strong> {dp.edad} años</li>
            <li><strong>Educación:</strong> {sd.nivelEducativo}</li>
            <li><strong>Zona:</strong> {sd.zonaResidencia}</li>
          </ul>
          <button type="button" className="module-btn" onClick={() => navigate("/perfil/editar")}>Editar perfil</button>
        </>
      )}
    </AppShell>
  );
};

export default Perfil;
