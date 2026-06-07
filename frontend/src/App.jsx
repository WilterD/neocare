import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome/Welcome.jsx";
import Register from "./pages/Register/Register.jsx";
import Login from "./pages/Login/Login.jsx";
import Services from "./pages/Services/Services.jsx";
import Evaluation from "./pages/Evaluation/Evaluation.jsx";
import UserHome from "./pages/UserHome/UserHome.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/servicios" element={<Services />} />

        {/* Pantallas internas */}
        <Route path="/inicio" element={<UserHome />} />
        <Route path="/evaluacion" element={<Evaluation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;