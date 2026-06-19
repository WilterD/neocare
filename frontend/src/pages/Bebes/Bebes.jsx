import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Bebes.css";

import Header2 from "../../components/Header2/Header2.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import SidebarNeoCare from "../../components/SidebarNeoCare/SidebarNeoCare.jsx";

import datosBebeImage from "../../assets/DatosBebe.png";
import evaluacionImage from "../../assets/Evaluacion.png";
import saImage from "../../assets/SA.png";
import ramaImage from "../../assets/RAMA.png";
import qsImage from "../../assets/QS.png";
import ageImage from "../../assets/EdadB.png";
import inicioImage from "../../assets/Inicio.png";
import libretaImage from "../../assets/Libreta.png";

import { listarBebes } from "../../services/api.js";

const RISK_META = {
  Bajo: { color: "#6fa04f", label: "Riesgo bajo" },
  Moderado: { color: "#e0a64a", label: "Riesgo medio" },
  Alto: { color: "#c64a4a", label: "Riesgo alto" },
};

const normalizeText = (v) =>
  String(v || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const Bebes = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [bebes, setBebes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroRiesgo, setFiltroRiesgo] = useState("todos");

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
        const data = await listarBebes();
        setBebes(data.bebes || []);
      } catch (err) {
        console.error("Error al listar bebés:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const bebesFiltrados = useMemo(() => {
    const t = normalizeText(searchTerm);
    return bebes.filter((b) => {
      const matchSearch =
        !t ||
        normalizeText(b.nombreBebe).includes(t) ||
        normalizeText(b.madre?.nombre).includes(t) ||
        normalizeText(b.sexo).includes(t) ||
        normalizeText(b.tipoParto).includes(t);
      const matchRiesgo =
        filtroRiesgo === "todos" ||
        (b.ultimaEvaluacion?.nivel || "sin-clasificar") === filtroRiesgo;
      return matchSearch && matchRiesgo;
    });
  }, [bebes, searchTerm, filtroRiesgo]);

  const stats = useMemo(() => {
    return {
      total: bebes.length,
      bajo: bebes.filter((b) => b.ultimaEvaluacion?.nivel === "Bajo").length,
      moderado: bebes.filter(
        (b) => b.ultimaEvaluacion?.nivel === "Moderado"
      ).length,
      alto: bebes.filter((b) => b.ultimaEvaluacion?.nivel === "Alto").length,
      sinClasificar: bebes.filter((b) => !b.ultimaEvaluacion).length,
    };
  }, [bebes]);

  const irADetalle = (id) => navigate(`/bebes/${id}`);

  return (
    <main className="bebes-page-wrapper">
      <Header2 user={usuario} />

      <section className="bebes-desktop">
        <SidebarNeoCare className="bebes" activePath="/bebes" />

        <section className="bebes-main-panel">
          <header className="bebes-title-row">
            <div className="bebes-title-left">
              <h1>Todos los bebés</h1>
              <p>
                Listado completo de recién nacidos registrados en NeoCare.
                Selecciona uno para ver su seguimiento, triaje y controles.
              </p>
            </div>

            <div className="bebes-title-actions">
              <label className="bebes-search-box">
                <span>⌕</span>
                <input
                  type="text"
                  placeholder="Buscar por nombre, madre o sexo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </label>
              <button
                type="button"
                className="bebes-help-button"
                aria-label="Ayuda"
                onClick={() => navigate("/contacto")}
              >
                ?
              </button>
            </div>
          </header>

          <section className="bebes-stats-grid">
            <article className="bebes-stat-card total">
              <img src={datosBebeImage} alt="Bebés" />
              <div>
                <span>Total registrados</span>
                <strong>{stats.total}</strong>
              </div>
            </article>
            <article className="bebes-stat-card bajo">
              <img src={ramaImage} alt="Riesgo bajo" />
              <div>
                <span>Riesgo bajo</span>
                <strong>{stats.bajo}</strong>
              </div>
            </article>
            <article className="bebes-stat-card moderado">
              <img src={saImage} alt="Riesgo medio" />
              <div>
                <span>Riesgo medio</span>
                <strong>{stats.moderado}</strong>
              </div>
            </article>
            <article className="bebes-stat-card alto">
              <img src={qsImage} alt="Riesgo alto" />
              <div>
                <span>Riesgo alto</span>
                <strong>{stats.alto}</strong>
              </div>
            </article>
          </section>

          <section className="bebes-filter-row">
            <span className="bebes-filter-label">Filtrar por nivel de riesgo:</span>
            <button
              type="button"
              className={
                filtroRiesgo === "todos"
                  ? "bebes-filter-button active"
                  : "bebes-filter-button"
              }
              onClick={() => setFiltroRiesgo("todos")}
            >
              Todos
            </button>
            <button
              type="button"
              className={
                filtroRiesgo === "Bajo"
                  ? "bebes-filter-button active bajo"
                  : "bebes-filter-button"
              }
              onClick={() => setFiltroRiesgo("Bajo")}
            >
              Riesgo bajo
            </button>
            <button
              type="button"
              className={
                filtroRiesgo === "Moderado"
                  ? "bebes-filter-button active moderado"
                  : "bebes-filter-button"
              }
              onClick={() => setFiltroRiesgo("Moderado")}
            >
              Riesgo medio
            </button>
            <button
              type="button"
              className={
                filtroRiesgo === "Alto"
                  ? "bebes-filter-button active alto"
                  : "bebes-filter-button"
              }
              onClick={() => setFiltroRiesgo("Alto")}
            >
              Riesgo alto
            </button>
            <button
              type="button"
              className={
                filtroRiesgo === "sin-clasificar"
                  ? "bebes-filter-button active sin"
                  : "bebes-filter-button"
              }
              onClick={() => setFiltroRiesgo("sin-clasificar")}
            >
              Sin clasificar
            </button>
          </section>

          {loading && (
            <div className="bebes-state-card">
              <p>Cargando bebés registrados...</p>
            </div>
          )}

          {error && !loading && (
            <div className="bebes-state-card error">
              <p>⚠ No se pudo cargar el listado: {error}</p>
              <button
                type="button"
                className="bebes-retry-button"
                onClick={() => window.location.reload()}
              >
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && bebesFiltrados.length === 0 && (
            <div className="bebes-state-card">
              <img src={libretaImage} alt="Sin bebés" />
              <p>No hay bebés que coincidan con los filtros aplicados.</p>
            </div>
          )}

          {!loading && !error && bebesFiltrados.length > 0 && (
            <section className="bebes-grid">
              {bebesFiltrados.map((bebe) => {
                const nivel = bebe.ultimaEvaluacion?.nivel || null;
                const metaNivel = nivel ? RISK_META[nivel] : null;
                return (
                  <article
                    key={bebe.id}
                    className="bebe-card"
                    onClick={() => irADetalle(bebe.id)}
                  >
                    <header className="bebe-card-header">
                      <span className="bebe-card-avatar">
                        <img src={datosBebeImage} alt={bebe.nombreBebe} />
                      </span>
                      <div className="bebe-card-titles">
                        <h3>{bebe.nombreBebe}</h3>
                        <p>
                          {bebe.edadActual} · {bebe.sexo}
                        </p>
                      </div>
                      {metaNivel ? (
                        <span
                          className="bebe-card-pill"
                          style={{ background: metaNivel.color }}
                        >
                          {metaNivel.label}
                        </span>
                      ) : (
                        <span className="bebe-card-pill muted">
                          Sin clasificar
                        </span>
                      )}
                    </header>

                    <div className="bebe-card-body">
                      <div className="bebe-card-row">
                        <span>Madre / Cuidador</span>
                        <strong>{bebe.madre?.nombre || "—"}</strong>
                      </div>
                      <div className="bebe-card-row">
                        <span>Fecha de nacimiento</span>
                        <strong>{bebe.fechaNacimiento || "—"}</strong>
                      </div>
                      <div className="bebe-card-row">
                        <span>Peso al nacer</span>
                        <strong>
                          {bebe.pesoAlNacer
                            ? `${Number(bebe.pesoAlNacer).toFixed(2)} kg`
                            : "—"}
                        </strong>
                      </div>
                      <div className="bebe-card-row">
                        <span>Edad gestacional</span>
                        <strong>
                          {bebe.edadGestacional
                            ? `${bebe.edadGestacional} sem`
                            : "—"}
                        </strong>
                      </div>
                      <div className="bebe-card-row">
                        <span>Tipo de parto</span>
                        <strong>{bebe.tipoParto || "—"}</strong>
                      </div>
                      <div className="bebe-card-row">
                        <span>Última evaluación</span>
                        <strong>
                          {bebe.ultimaEvaluacion
                            ? `${bebe.ultimaEvaluacion.fecha} · ${bebe.ultimaEvaluacion.puntuacion} pts`
                            : "Pendiente"}
                        </strong>
                      </div>
                    </div>

                    <footer className="bebe-card-footer">
                      <button
                        type="button"
                        className="bebe-card-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          irADetalle(bebe.id);
                        }}
                      >
                        Ver módulos educativos
                      </button>
                      <img src={evaluacionImage} alt="Ver" />
                    </footer>
                  </article>
                );
              })}
            </section>
          )}

          <section className="bebes-info-card">
            <img src={inicioImage} alt="Información" />
            <div>
              <h3>Acerca de este módulo</h3>
              <p>
                Desde el listado puedes ver todos los recién nacidos
                registrados en NeoCare, su clasificación de riesgo más reciente
                y acceder a sus <strong>módulos educativos</strong>:
                Sistema de triaje neonatal, Seguimiento diario del recién
                nacido y Vacunas y controles del bebé.
              </p>
            </div>
          </section>
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default Bebes;
