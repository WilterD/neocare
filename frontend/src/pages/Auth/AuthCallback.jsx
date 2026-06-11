import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPerfilMe } from "../../services/api.js";
import { persistSession } from "../../utils/mapRegistroPayload.js";

const AuthCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    const nombre = params.get("nombre");
    if (!token) {
      navigate("/login?error=oauth");
      return;
    }
    localStorage.setItem("token", token);
    getPerfilMe()
      .then((data) => {
        persistSession({
          token,
          usuario: { id: data.madre.id, nombre: data.madre.nombre || nombre, correo: data.madre.correo_electronico },
          registro: data.registro,
        });
        navigate("/inicio");
      })
      .catch(() => navigate("/inicio"));
  }, [params, navigate]);

  return <p style={{ textAlign: "center", marginTop: "3rem" }}>Iniciando sesión con Google...</p>;
};

export default AuthCallback;
