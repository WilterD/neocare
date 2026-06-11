import React, { createContext, useContext, useEffect, useState } from "react";
import { getBebes, getToken } from "../services/api.js";

const BebeActivoContext = createContext(null);

export const BebeActivoProvider = ({ children }) => {
  const [bebes, setBebes] = useState([]);
  const [bebeActivoId, setBebeActivoId] = useState(
    () => localStorage.getItem("bebeActivoId") || null
  );

  const cargarBebes = async () => {
    if (!getToken()) return;
    try {
      const data = await getBebes();
      const lista = data.bebes || [];
      setBebes(lista);
      if (lista.length === 0) return;

      const stored = localStorage.getItem("bebeActivoId");
      const found = lista.find((b) => String(b.id) === stored);
      const id = found ? stored : String(lista[lista.length - 1].id);
      setBebeActivoId(id);
      localStorage.setItem("bebeActivoId", id);
    } catch {
      /* sin sesión */
    }
  };

  useEffect(() => {
    cargarBebes();
  }, []);

  const seleccionarBebe = (id) => {
    setBebeActivoId(String(id));
    localStorage.setItem("bebeActivoId", String(id));
  };

  const bebeActivo = bebes.find((b) => String(b.id) === String(bebeActivoId)) || bebes[bebes.length - 1];

  return (
    <BebeActivoContext.Provider value={{ bebes, bebeActivo, bebeActivoId, seleccionarBebe, cargarBebes }}>
      {children}
    </BebeActivoContext.Provider>
  );
};

export const useBebeActivo = () => useContext(BebeActivoContext);
