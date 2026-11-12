import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import CamposViaje from "./CamposViaje.jsx";
import ItinerarioViaje from "./ItinerarioViaje.jsx";
import ClimaViaje from "./ClimaViaje.jsx";
import {
  actualizarViajeApi,
  eliminarViajeApi,
} from "../services/viajesServices.js";
import { obtenerMensajeError } from "../services/api.js";
import { esquemaViaje, armarCuerpoViaje } from "../utils/esquemasViaje.js";
import {
  formatearFecha,
  aValorInputFecha,
  aEstrellas,
  miniaturaCloudinary,
} from "../utils/formato.js";
import { eliminarImagenApi } from "../services/imageServices.js";
import { seleccionarTipos } from "../redux/features/tiposSlice.js";
import {
  modificarViajeSlice,
  recargarViajesSlice,
} from "../redux/features/viajesSlice.js";
import {
  aumentarContadorPeticiones,
  disminuirContadorPeticiones,
} from "../redux/features/loadingSlice.js";


const Viaje = ({ viaje }) => {
  const dispatch = useDispatch();
  const tipos = useSelector(seleccionarTipos);

  const [editando, setEditando] = useState(false);
  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false);
  const [errorApi, setErrorApi] = useState("");
  // Panel desplegado debajo de la tarjeta: null, "itinerario" o "clima".
  const [panel, setPanel] = useState(null);
  const alternarPanel = (nombre) => setPanel(panel === nombre ? null : nombre);

  const formik = useFormik({
    initialValues: {
      titulo: viaje.titulo,
      destino: viaje.destino,
      fechaInicio: aValorInputFecha(viaje.fechaInicio),
      fechaFin: aValorInputFecha(viaje.fechaFin),
      tipoDeViaje: viaje.tipoDeViaje?.id || "",
      calificacion: viaje.calificacion ? String(viaje.calificacion) : "",
      notas: viaje.notas || "",
      imagenUrl: viaje.imagenUrl || "",
      imagenPublicId: viaje.imagenPublicId || "",
    },
    validationSchema: esquemaViaje,

    enableReinitialize: true,
    onSubmit: async (valores) => {
      setErrorApi("");
      try {
        dispatch(aumentarContadorPeticiones());

        const actualizado = await actualizarViajeApi(
          viaje.id,
          armarCuerpoViaje(valores),
        );
        dispatch(modificarViajeSlice(actualizado));
        toast.success("Viaje actualizado.");
        setEditando(false);
      } catch (error) {
        setErrorApi(
          obtenerMensajeError(error, "No se pudo actualizar el viaje."),
        );
      } finally {
        dispatch(disminuirContadorPeticiones());
      }
    },
  });

  const cancelarEdicion = () => {

    const nueva = formik.values.imagenPublicId;
    if (nueva && nueva !== (viaje.imagenPublicId || "")) {
      eliminarImagenApi(nueva).catch(() => {});
    }
    formik.resetForm();
    setErrorApi("");
    setEditando(false);
  };

  const eliminar = async () => {
    try {
      dispatch(aumentarContadorPeticiones());
      await eliminarViajeApi(viaje.id);
      toast.success("Viaje eliminado.");
      setConfirmandoBorrado(false);
  
      dispatch(recargarViajesSlice());
    } catch (error) {
      setConfirmandoBorrado(false);
      toast.error(obtenerMensajeError(error, "No se pudo eliminar el viaje."));
    } finally {
      dispatch(disminuirContadorPeticiones());
    }
  };

  if (editando) {
    return (
      <Card className="tarjeta-viaje">
        <Card.Body>
          <h3 className="seccion-subtitulo">Editar viaje</h3>
          {errorApi && (
            <Alert variant="danger" role="alert">
              {errorApi}
            </Alert>
          )}
          <Form onSubmit={formik.handleSubmit} noValidate>
            <CamposViaje
              formik={formik}
              tipos={tipos}
              prefijo={`edit-${viaje.id}`}
              imagenYaGuardada={viaje.imagenPublicId || ""}
            />
            <div className="d-flex gap-2 justify-content-end">
              <Button variant="outline-secondary" onClick={cancelarEdicion}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="success"
                disabled={formik.isSubmitting || !(formik.isValid && formik.dirty)}
              >
                Guardar cambios
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="tarjeta-viaje">
      {viaje.imagenUrl && (
        <Card.Img
          variant="top"
          src={miniaturaCloudinary(viaje.imagenUrl)}
          alt={`Foto de ${viaje.titulo}`}
          className="viaje-imagen"
        />
      )}
      <Card.Body>
        <div className="viaje-cabecera">
          <div>
            <Card.Title as="h3" className="viaje-titulo">
              {viaje.titulo}
            </Card.Title>
            <div className="viaje-destino">{viaje.destino}</div>
          </div>
          {viaje.tipoDeViaje && (
            <Badge bg="" className="etiqueta-categoria">
              {viaje.tipoDeViaje.nombre}
            </Badge>
          )}
        </div>

        <div className="viaje-fechas">
          {formatearFecha(viaje.fechaInicio)} → {formatearFecha(viaje.fechaFin)}
        </div>

        {viaje.calificacion && (
          <div
            className="viaje-estrellas"
            aria-label={`Calificación ${viaje.calificacion} de 5`}
          >
            {aEstrellas(viaje.calificacion)}
          </div>
        )}

        {viaje.notas && <Card.Text className="viaje-notas">{viaje.notas}</Card.Text>}

        <div className="viaje-acciones">
          <Button
            variant="outline-success"
            size="sm"
            onClick={() => setEditando(true)}
          >
            Editar
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => setConfirmandoBorrado(true)}
          >
            Eliminar
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => alternarPanel("itinerario")}
          >
            Itinerario IA
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => alternarPanel("clima")}
          >
            Clima
          </Button>
        </div>

        {panel === "itinerario" && <ItinerarioViaje viaje={viaje} />}
        {panel === "clima" && <ClimaViaje viaje={viaje} />}
      </Card.Body>

      <Modal
        show={confirmandoBorrado}
        onHide={() => setConfirmandoBorrado(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Eliminar viaje</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que querés eliminar «{viaje.titulo}»? Esta acción no se puede
          deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setConfirmandoBorrado(false)}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminar}>
            Sí, eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default Viaje;
