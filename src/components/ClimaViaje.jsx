import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";
import { useDispatch } from "react-redux";

import { obtenerClimaApi } from "../services/viajesServices.js";
import { obtenerMensajeError } from "../services/api.js";
import { formatearFecha } from "../utils/formato.js";
import {
  aumentarContadorPeticiones,
  disminuirContadorPeticiones,
} from "../redux/features/loadingSlice.js";

const ClimaViaje = ({ viaje }) => {
  const dispatch = useDispatch();
  const [clima, setClima] = useState(null);
  const [errorApi, setErrorApi] = useState("");

  useEffect(() => {
    let cancelado = false;

    const cargar = async () => {
      try {
        dispatch(aumentarContadorPeticiones());
        const datos = await obtenerClimaApi(viaje.id);
        if (!cancelado) {
          setClima(datos);
        }
      } catch (error) {
        if (!cancelado) {
          setErrorApi(
            obtenerMensajeError(error, "No se pudo obtener el clima."),
          );
        }
      } finally {
        dispatch(disminuirContadorPeticiones());
      }
    };

    cargar();
    return () => {
      cancelado = true;
    };
  }, [dispatch, viaje.id]);

  if (errorApi) {
    return (
      <div className="panel-viaje">
        <Alert variant="warning" role="alert" className="mb-0">
          {errorApi}
        </Alert>
      </div>
    );
  }

  if (!clima) {
    return <div className="panel-viaje texto-suave">Consultando el clima...</div>;
  }

  return (
    <div className="panel-viaje">
      <p className="mb-2">
        <strong>
          {clima.ubicacion.nombre}, {clima.ubicacion.pais}
        </strong>
        <br />
        <span className="texto-suave">{clima.mensaje}</span>
      </p>
      <Table size="sm" responsive className="mb-0">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Clima</th>
            <th>Mín.</th>
            <th>Máx.</th>
            <th>Lluvia</th>
          </tr>
        </thead>
        <tbody>
          {clima.dias.map((dia) => (
            <tr key={dia.fecha}>
              <td>{formatearFecha(dia.fecha)}</td>
              <td>{dia.descripcion}</td>
              <td>{dia.temperaturaMinima}°</td>
              <td>{dia.temperaturaMaxima}°</td>
              <td>{dia.precipitacionMm} mm</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ClimaViaje;
