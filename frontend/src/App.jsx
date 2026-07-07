import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";

import Welcome from "./pages/Welcome/Welcome.jsx";
import Register from "./pages/Register/Register.jsx";
import Login from "./pages/Login/Login.jsx";
import Services from "./pages/Services/Services.jsx";
import Evaluation from "./pages/Evaluation/Evaluation.jsx";
import About from "./pages/About/About.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import Result from "./pages/Result/Result.jsx";
import Education from "./pages/Education/Education.jsx";

import History from "./pages/History/History.jsx";
import AllEvaluations from "./pages/AllEvaluations/AllEvaluations.jsx";
import Home from "./pages/Home/Home.jsx";
import Profile from "./pages/Profile/Profile.jsx";

import Bebes from "./pages/Bebes/Bebes.jsx";
import BebeNuevo from "./pages/Bebes/BebeNuevo.jsx";
import BebeDetalle from "./pages/BebeDetalle/BebeDetalle.jsx";
import BitacoraBebe from "./pages/BitacoraBebe/BitacoraBebe.jsx";
import EducacionTriaje from "./pages/EducacionTriaje/EducacionTriaje.jsx";
import EducacionSeguimiento from "./pages/EducacionSeguimiento/EducacionSeguimiento.jsx";
import EducacionVacunas from "./pages/EducacionVacunas/EducacionVacunas.jsx";
import TopicDetail from "./pages/TopicDetail/TopicDetail.jsx";

import Testimonios from "./pages/Testimonios/Testimonios.jsx";
import Diario from "./pages/Diario/Diario.jsx";
import EPDS from "./pages/EPDS/EPDS.jsx";
import Notificaciones from "./pages/Notificaciones/Notificaciones.jsx";
import OlvideContrasena from "./pages/Auth/OlvideContrasena.jsx";
import RestablecerContrasena from "./pages/Auth/RestablecerContrasena.jsx";

const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/olvide-contrasena" element={<OlvideContrasena />} />
        <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />
        <Route path="/servicios" element={<Services />} />
        <Route path="/nosotros" element={<About />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/testimonios" element={<Testimonios />} />

        <Route path="/resultado" element={<P><Result /></P>} />
        <Route path="/educacion" element={<P><Education /></P>} />
        <Route path="/educacion/triaje" element={<P><EducacionTriaje /></P>} />
        <Route path="/educacion/seguimiento" element={<P><EducacionSeguimiento /></P>} />
        <Route path="/educacion/vacunas-controles" element={<P><EducacionVacunas /></P>} />
        <Route path="/educacion/tema/:id" element={<P><TopicDetail /></P>} />

        <Route path="/historial" element={<P><History /></P>} />
        <Route path="/inicio" element={<P><Home /></P>} />
        <Route path="/perfil" element={<P><Profile /></P>} />
        <Route path="/historial/evaluaciones" element={<P><AllEvaluations /></P>} />
        <Route path="/evaluacion" element={<P><Evaluation /></P>} />

        <Route path="/bebes" element={<P><Bebes /></P>} />
        <Route path="/bebes/nuevo" element={<P><BebeNuevo /></P>} />
        <Route path="/bebes/:id" element={<P><BebeDetalle /></P>} />
        <Route path="/bebes/:id/bitacora" element={<P><BitacoraBebe /></P>} />

        <Route path="/diario" element={<P><Diario /></P>} />
        <Route path="/epds" element={<P><EPDS /></P>} />
        <Route path="/notificaciones" element={<P><Notificaciones /></P>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
