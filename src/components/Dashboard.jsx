import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Menu from "./Menu.jsx";
import { seleccionarUsuario } from "../redux/features/usersSlice.js";
import { programarVencimiento } from "../utils/sesion.js";
import { useSesion } from "../utils/utils.js";
import { listarTiposApi } from "../services/tiposServices.js";
import { obtenerMensajeError } from "../services/api.js";
import { cargarTiposSlice } from "../redux/features/tiposSlice.js";
import {
  aumentarContadorPeticiones,
  disminuirContadorPeticiones,
} from "../redux/features/loadingSlice.js";


const Dashboard = () => {
  const dispatch = useDispatch();
  const usuario = useSelector(seleccionarUsuario);
  const { cerrarSesion } = useSesion();
  const usuarioId = usuario?.id;


  useEffect(() => {
    if (!usuarioId) {
      return;
    }
    let cancelado = false;
    const cargarTipos = async () => {
      try {
        dispatch(aumentarContadorPeticiones());
        const tipos = await listarTiposApi();
        if (!cancelado) {
          dispatch(cargarTiposSlice(tipos));
        }
      } catch (error) {
        if (!cancelado) {
          toast.error(
            obtenerMensajeError(error, "No se pudieron cargar las categorías."),
          );
        }
      } finally {
        dispatch(disminuirContadorPeticiones());
      }
    };
    cargarTipos();
    return () => {
      cancelado = true;
    };
  }, [dispatch, usuarioId]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !usuario) {
      cerrarSesion();
      return;
    }


    programarVencimiento(token, () =>
      cerrarSesion("Tu sesión venció. Iniciá sesión nuevamente."),
    );

  }, [usuario]);

  if (!usuario) {
    return null;
  }

  return (
    <>
      <Menu />
      <main className="contenido">
        <Outlet />
      </main>
    </>
  );
};

export default Dashboard;
