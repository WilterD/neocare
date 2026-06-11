import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

import { BebeActivoProvider } from "./context/BebeActivoContext.jsx";



import Welcome from "./pages/Welcome/Welcome.jsx";

import Register from "./pages/Register/Register.jsx";

import Login from "./pages/Login/Login.jsx";

import Services from "./pages/Services/Services.jsx";

import About from "./pages/About/About.jsx";

import Contact from "./pages/Contact/Contact.jsx";

import UserHome from "./pages/UserHome/UserHome.jsx";

import Evaluation from "./pages/Evaluation/Evaluation.jsx";

import Resultado from "./pages/Resultado/Resultado.jsx";

import Perfil from "./pages/Perfil/Perfil.jsx";

import PerfilEditar from "./pages/Perfil/PerfilEditar.jsx";

import Educacion from "./pages/Educacion/Educacion.jsx";

import EducacionDetalle from "./pages/Educacion/EducacionDetalle.jsx";

import Historial from "./pages/Historial/Historial.jsx";

import HistorialDetalle from "./pages/Historial/HistorialDetalle.jsx";

import OlvideContrasena from "./pages/Auth/OlvideContrasena.jsx";

import RestablecerContrasena from "./pages/Auth/RestablecerContrasena.jsx";

import AuthCallback from "./pages/Auth/AuthCallback.jsx";

import Triaje from "./pages/Triaje/Triaje.jsx";

import Seguimiento from "./pages/Seguimiento/Seguimiento.jsx";

import BitacoraBebe from "./pages/BitacoraBebe/BitacoraBebe.jsx";

import Vacunas from "./pages/Vacunas/Vacunas.jsx";

import Controles from "./pages/Controles/Controles.jsx";

import Diario from "./pages/Diario/Diario.jsx";

import EPDS from "./pages/EPDS/EPDS.jsx";

import Testimonios from "./pages/Testimonios/Testimonios.jsx";

import Notificaciones from "./pages/Notificaciones/Notificaciones.jsx";

import BebeNuevo from "./pages/Bebes/BebeNuevo.jsx";



const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;



function App() {

  return (

    <BrowserRouter>

      <BebeActivoProvider>

        <Routes>

          <Route path="/" element={<Welcome />} />

          <Route path="/registro" element={<Register />} />

          <Route path="/login" element={<Login />} />

          <Route path="/servicios" element={<Services />} />

          <Route path="/nosotros" element={<About />} />

          <Route path="/contacto" element={<Contact />} />

          <Route path="/testimonios" element={<Testimonios />} />

          <Route path="/olvide-contrasena" element={<OlvideContrasena />} />

          <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />

          <Route path="/auth/callback" element={<AuthCallback />} />



          <Route path="/inicio" element={<P><UserHome /></P>} />

          <Route path="/evaluacion" element={<P><Evaluation /></P>} />

          <Route path="/resultado" element={<P><Resultado /></P>} />

          <Route path="/perfil" element={<P><Perfil /></P>} />

          <Route path="/perfil/editar" element={<P><PerfilEditar /></P>} />

          <Route path="/educacion" element={<Educacion />} />

          <Route path="/educacion/:id" element={<EducacionDetalle />} />

          <Route path="/historial" element={<P><Historial /></P>} />

          <Route path="/historial/:id" element={<P><HistorialDetalle /></P>} />

          <Route path="/triaje" element={<P><Triaje /></P>} />

          <Route path="/seguimiento" element={<P><Seguimiento /></P>} />

          <Route path="/bitacora-bebe" element={<P><BitacoraBebe /></P>} />

          <Route path="/vacunas" element={<P><Vacunas /></P>} />

          <Route path="/controles" element={<P><Controles /></P>} />

          <Route path="/diario-emocional" element={<P><Diario /></P>} />

          <Route path="/epds" element={<P><EPDS /></P>} />

          <Route path="/notificaciones" element={<P><Notificaciones /></P>} />

          <Route path="/bebes/nuevo" element={<P><BebeNuevo /></P>} />

        </Routes>

      </BebeActivoProvider>

    </BrowserRouter>

  );

}



export default App;

