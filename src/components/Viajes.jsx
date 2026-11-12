import { useEffect } from "react";
import Col from "react-bootstrap/Col";
import Pagination from "react-bootstrap/Pagination";
import Row from "react-bootstrap/Row";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Viaje from "./Viaje.jsx";
import { listarViajesApi } from "../services/viajesServices.js";
import { obtenerMensajeError } from "../services/api.js";
import {
  VIAJES_POR_PAGINA,
  seleccionarViajes,
  seleccionarPaginacion,
  seleccionarPaginaActual,
  seleccionarFiltros,
  seleccionarRecargas,
  cargarViajesSlice,
  cambiarPaginaSlice,
} from "../redux/features/viajesSlice.js";
import {
  aumentarContadorPeticiones,
  disminuirContadorPeticiones,
} from "../redux/features/loadingSlice.js";

const Viajes = () => {
  const dispatch = useDispatch();
  const viajes = useSelector(seleccionarViajes);
  const paginacion = useSelector(seleccionarPaginacion);
  const paginaActual = useSelector(seleccionarPaginaActual);
  const filtros = useSelector(seleccionarFiltros);
  const recargas = useSelector(seleccionarRecargas);

  useEffect(() => {

    let cancelado = false;

    const cargar = async () => {
      try {
        dispatch(aumentarContadorPeticiones());
        const resultado = await listarViajesApi({
          page: paginaActual,
          limit: VIAJES_POR_PAGINA,
          ...filtros,
        });
        if (cancelado) {
          return;
        }

        if (resultado.viajes.length === 0 && paginaActual > 1) {
          dispatch(cambiarPaginaSlice(paginaActual - 1));
          return;
        }
        dispatch(cargarViajesSlice(resultado));
      } catch (error) {
        if (!cancelado) {
          toast.error(
            obtenerMensajeError(error, "No se pudieron cargar los viajes."),
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
  }, [dispatch, paginaActual, filtros, recargas]);

  const hayFiltros = Object.values(filtros).some((valor) => valor !== "");

  if (viajes.length === 0) {
    return (
      <p className="texto-suave text-center my-5">
        {hayFiltros
          ? "No hay viajes que coincidan con los filtros."
          : "Todavía no cargaste ningún viaje. ¡Agregá el primero!"}
      </p>
    );
  }

  return (
    <>
      <p className="texto-suave">
        {paginacion.total} {paginacion.total === 1 ? "viaje" : "viajes"}
      </p>

      <Row className="g-3">
        {viajes.map((viaje) => (
          <Col key={viaje.id} lg={6}>
            <Viaje viaje={viaje} />
          </Col>
        ))}
      </Row>

      {paginacion.totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
          <Pagination.Prev
            disabled={paginaActual === 1}
            onClick={() => dispatch(cambiarPaginaSlice(paginaActual - 1))}
          />
          {Array.from({ length: paginacion.totalPages }, (_, i) => i + 1).map(
            (numero) => (
              <Pagination.Item
                key={numero}
                active={numero === paginaActual}
                onClick={() => dispatch(cambiarPaginaSlice(numero))}
              >
                {numero}
              </Pagination.Item>
            ),
          )}
          <Pagination.Next
            disabled={paginaActual === paginacion.totalPages}
            onClick={() => dispatch(cambiarPaginaSlice(paginaActual + 1))}
          />
        </Pagination>
      )}
    </>
  );
};

export default Viajes;
