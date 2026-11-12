import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
import { modificarViajeSlice } from "../redux/features/viajesSlice.js";

import { generarItinerarioApi } from "../services/viajesServices.js";
import { obtenerMensajeError } from "../services/api.js";
import {
  aumentarContadorPeticiones,
  disminuirContadorPeticiones,
} from "../redux/features/loadingSlice.js";

const ItinerarioViaje = ({ viaje }) => {
  const dispatch = useDispatch();
  const [itinerario, setItinerario] = useState(viaje.itinerarioSugerido || "");
  const [generadoPorIA, setGeneradoPorIA] = useState(true);
  const [errorApi, setErrorApi] = useState("");

  const generar = async () => {
    setErrorApi("");
    try {
      dispatch(aumentarContadorPeticiones());
      const resultado = await generarItinerarioApi(viaje.id);
      setItinerario(resultado.itinerario);
      setGeneradoPorIA(resultado.generadoPorIA);
      if (resultado.generadoPorIA) {
        dispatch(
          modificarViajeSlice({ ...viaje, itinerarioSugerido: resultado.itinerario }),
        );
      }
    } catch (error) {
      setErrorApi(
        obtenerMensajeError(error, "No se pudo generar el itinerario."),
      );
    } finally {
      dispatch(disminuirContadorPeticiones());
    }
  };

  return (
    <div className="panel-viaje">
      {errorApi && (
        <Alert variant="danger" role="alert">
          {errorApi}
        </Alert>
      )}

      {itinerario && !generadoPorIA && (
        <Alert variant="warning">
          La IA no estaba disponible, así que este es un itinerario genérico.
          Podés intentar de nuevo más tarde.
        </Alert>
      )}

      {itinerario && <div className="itinerario-texto">{itinerario}</div>}

      <Button variant="success" size="sm" onClick={generar}>
        {itinerario ? "Generar de nuevo" : "Generar itinerario con IA"}
      </Button>
    </div>
  );
};

export default ItinerarioViaje;
