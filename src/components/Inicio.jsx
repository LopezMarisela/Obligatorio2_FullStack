import { useEffect } from "react";
import Container from "react-bootstrap/Container";
import { useDispatch, useSelector } from "react-redux";
import AgregarViaje from "./AgregarViaje.jsx";
import FiltrosViajes from "./FiltrosViajes.jsx";
import Viajes from "./Viajes.jsx";
import InformeUso from "./InformeUso.jsx";
import GraficaViajes from "./GraficaViajes.jsx";
import { obtenerTotalViajesApi } from "../services/viajesServices.js";
import { seleccionarUsuario } from "../redux/features/usersSlice.js";
import {
  seleccionarRecargas,
  cargarTotalUsuarioSlice,
} from "../redux/features/viajesSlice.js";

const Inicio = () => {
  const dispatch = useDispatch();
  const usuario = useSelector(seleccionarUsuario);
  const recargas = useSelector(seleccionarRecargas);


  useEffect(() => {
    let cancelado = false;
    obtenerTotalViajesApi()
      .then((total) => {
        if (!cancelado) {
          dispatch(cargarTotalUsuarioSlice(total));
        }
      })
      .catch(() => {
      });
    return () => {
      cancelado = true;
    };
  }, [dispatch, recargas]);

  return (
    <Container>
      <h1 className="saludo">¿A dónde viajamos, {usuario?.name}?</h1>
      <p className="saludo-detalle">Tu bitácora de viajes.</p>

      <InformeUso />
      <AgregarViaje />

      <GraficaViajes />

      <h2 className="seccion-titulo">Mis viajes</h2>
      <FiltrosViajes />
      <Viajes />
    </Container>
  );
};

export default Inicio;
