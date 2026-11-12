import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login.jsx";
import Registro from "./Registro.jsx";
import Dashboard from "./Dashboard.jsx";
import Inicio from "./Inicio.jsx";
import Categorias from "./Categorias.jsx";
import CambioPlan from "./CambioPlan.jsx";

const Rutas = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<Inicio />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="plan" element={<CambioPlan />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Rutas;
