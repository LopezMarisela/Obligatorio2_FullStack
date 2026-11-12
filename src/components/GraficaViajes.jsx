import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Grafica from "./Grafica.jsx";
import { obtenerTodosLosViajesApi } from "../services/viajesServices.js";
import { seleccionarRecargas } from "../redux/features/viajesSlice.js";
import {
  aumentarContadorPeticiones,
  disminuirContadorPeticiones,
} from "../redux/features/loadingSlice.js";

const contarPorCategoria = (acc, viaje) => {
  const nombre = viaje.tipoDeViaje?.nombre || "Sin categoría";
  acc[nombre] = (acc[nombre] || 0) + 1;
  return acc;
};

const GraficaViajes = () => {
  const dispatch = useDispatch();
  const recargas = useSelector(seleccionarRecargas);
  const [etiquetas, setEtiquetas] = useState([]);
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    let cancelado = false;

    const cargar = async () => {
      try {
        dispatch(aumentarContadorPeticiones());
        const viajes = await obtenerTodosLosViajesApi();
        if (cancelado) {
          return;
        }
        const conteo = viajes.reduce(contarPorCategoria, {});
        setEtiquetas(Object.keys(conteo));
        setDatos(Object.values(conteo));
      } catch {

      } finally {
        dispatch(disminuirContadorPeticiones());
      }
    };

    cargar();
    return () => {
      cancelado = true;
    };
  }, [dispatch, recargas]);

  if (datos.length === 0) {
    return null;
  }

  return (
    <section className="grafica-viajes" aria-label="Gráfico de viajes por categoría">
      <Grafica
        etiquetas={etiquetas}
        datos={datos}
        nombreGrafica="Viajes por categoría"
        nombreDatos="Cantidad de viajes"
      />
    </section>
  );
};

export default GraficaViajes;
