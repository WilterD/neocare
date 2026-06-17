import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./BebeDetalle.css";

import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import SidebarNeoCare from "../../components/SidebarNeoCare/SidebarNeoCare.jsx";

import datosBebeImage from "../../assets/DatosBebe.png";
import qsImage from "../../assets/QS.png";
import saImage from "../../assets/SA.png";
import realizarEImage from "../../assets/RealizarE.png";
import vacuImage from "../../assets/VACU.png";
import controlImage from "../../assets/CONTROL.png";
import ramaImage from "../../assets/RAMA.png";
import evaluacionImage from "../../assets/Evaluacion.png";
import flechImage from "../../assets/FLECH.png";
import ageImage from "../../assets/EdadB.png";

import { obtenerModuloEducativo } from "../../services/api.js";
import TriajeNeonatal from "./modulos/TriajeNeonatal.jsx";
import SeguimientoDiario from "./modulos/SeguimientoDiario.jsx";
import VacunasControles from "./modulos/VacunasControles.jsx";

const TABS = [
  { id: "triaje", label: "Sistema de triaje neonatal", icon: qsImage, modulo: TriajeNeonatal },
  { id: "seguimiento", label: "Seguimiento diario del recién nacido", icon: realizarEImage, modulo: SeguimientoDiario },
  { id: "vacunas", label: "Vacunas y controles del bebé", icon: vacuImage, modulo: VacunasControles },
];

const COLOR = {
  Bajo: "#6fa04f",
  Moderado: "#e0a64a",
  Alto: "#c64a4a",
};

const BebeDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabActiva, setTabActiva] = useState("triaje");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("neocareUser");
      if (stored) setUsuario(JSON.parse(stored));
    } catch (e) {
      console.error("Error leyendo usuario:", e);
    }
  }, []);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await obtenerModuloEducativo(id);
        setData(response);
      } catch (err) {
        console.error("Error al cargar módulo educativo:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) cargar();
  }, [id]);

  const TabActual = TABS.find((t) => t.id === tabActiva)?.modulo || null;
  const nivelRiesgo = data?.triaje?.ultimaEvaluacion?.nivel || null;
  const colorNivel = nivelRiesgo ? COLOR[nivelRiesgo] : "#77717b";

  return (
    <main className="bebe-detalle-page-wrapper">
      <Header2 user={usuario} />

      <section className="bebe-detalle-desktop">
        <SidebarNeoCare className="bebe-detalle" activePath="/bebes" />

        <section className="bebe-detalle-main-panel">
          <header className="bebe-detalle-topbar">
            <button
              type="button"
              className="bebe-detalle-back-button"
              onClick={() => navigate("/bebes")}
            >
              <img src={flechImage} alt="Volver" className="flip" />
              Volver al listado
            </button>
          </header>

          {loading && (
            <div className="bebe-detalle-state">
              <p>Cargando información del bebé y sus módulos educativos...</p>
            </div>
          )}

          {error && !loading && (
            <div className="bebe-detalle-state error">
              <p>⚠ No se pudo cargar la información: {error}</p>
              <button
                type="button"
                className="bebe-detalle-retry"
                onClick={() => window.location.reload()}
              >
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && data && (
            <>
              <section className="bebe-detalle-hero">
                <div className="bebe-detalle-hero-info">
                  <span className="bebe-detalle-hero-label">
                    Recién nacido
                  </span>
                  <h1>{data.bebe?.nombre}</h1>
                  <div className="bebe-detalle-hero-meta">
                    <span>
                      <img src={ageImage} alt="Edad" />
                      {data.bebe?.edadActual}
                    </span>
                    <span>
                      <img src={datosBebeImage} alt="Sexo" />
                      {data.bebe?.sexo}
                    </span>
                    <span>
                      <img src={ramaImage} alt="Peso al nacer" />
                      {data.bebe?.pesoAlNacer
                        ? `${Number(data.bebe.pesoAlNacer).toFixed(2)} kg`
                        : "—"}
                    </span>
                    <span>
                      <img src={evaluacionImage} alt="Edad gestacional" />
                      {data.bebe?.edadGestacional
                        ? `${data.bebe.edadGestacional} sem`
                        : "—"}
                    </span>
                  </div>
                </div>

                <div
                  className="bebe-detalle-hero-riesgo"
                  style={{ borderColor: colorNivel }}
                >
                  <span
                    className="bebe-detalle-hero-riesgo-pill"
                    style={{ background: colorNivel }}
                  >
                    {nivelRiesgo
                      ? `Riesgo ${nivelRiesgo.toLowerCase()}`
                      : "Sin clasificar"}
                  </span>
                  <p>
                    {nivelRiesgo
                      ? "Resultado del último triaje registrado."
                      : "Este bebé aún no tiene triaje registrado."}
                  </p>
                </div>
              </section>

              <nav className="bebe-detalle-tabs" role="tablist">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={tabActiva === t.id}
                    className={
                      tabActiva === t.id
                        ? "bebe-detalle-tab active"
                        : "bebe-detalle-tab"
                    }
                    onClick={() => setTabActiva(t.id)}
                  >
                    <img src={t.icon} alt={t.label} />
                    <span>{t.label}</span>
                  </button>
                ))}
              </nav>

              <section className="bebe-detalle-modulo" role="tabpanel">
                {tabActiva === "triaje" && (
                  <TriajeNeonatal data={data.triaje} />
                )}
                {tabActiva === "seguimiento" && (
                  <SeguimientoDiario data={data.seguimiento} />
                )}
                {tabActiva === "vacunas" && (
                  <VacunasControles data={data.vacunasControles} />
                )}
              </section>
            </>
          )}
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default BebeDetalle;
