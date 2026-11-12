import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from "formik";

import CamposViaje from "./CamposViaje.jsx";
import { crearViajeApi } from "../services/viajesServices.js";
import { eliminarImagenApi } from "../services/imageServices.js";
import { obtenerMensajeError } from "../services/api.js";
import { esquemaViaje, armarCuerpoViaje } from "../utils/esquemasViaje.js";
import { seleccionarUsuario } from "../redux/features/usersSlice.js";
import { seleccionarTipos } from "../redux/features/tiposSlice.js";
import {
  seleccionarTotalUsuario,
  recargarViajesSlice,
} from "../redux/features/viajesSlice.js";
import {
  aumentarContadorPeticiones,
  disminuirContadorPeticiones,
} from "../redux/features/loadingSlice.js";

export const LIMITE_PLAN_PLUS = 4;

const valoresIniciales = {
  titulo: "",
  destino: "",
  fechaInicio: "",
  fechaFin: "",
  tipoDeViaje: "",
  calificacion: "",
  notas: "",
  imagenUrl: "",
  imagenPublicId: "",
};

const AgregarViaje = () => {
  const dispatch = useDispatch();
  const usuario = useSelector(seleccionarUsuario);
  const tipos = useSelector(seleccionarTipos);
  const totalUsuario = useSelector(seleccionarTotalUsuario);

  const [abierto, setAbierto] = useState(false);
  const [errorApi, setErrorApi] = useState("");

  const esPlus = usuario?.role !== "administrador" && usuario?.plan === "plus";
  const limiteAlcanzado =
    esPlus && totalUsuario !== null && totalUsuario >= LIMITE_PLAN_PLUS;

  const formik = useFormik({
    initialValues: valoresIniciales,
    validationSchema: esquemaViaje,
    onSubmit: async (valores, { resetForm }) => {
      setErrorApi("");
      try {
        dispatch(aumentarContadorPeticiones());
        await crearViajeApi(armarCuerpoViaje(valores));

        toast.success("¡Viaje agregado a tu bitácora!");
        resetForm();
        setAbierto(false);
      } catch (error) {
        setErrorApi(obtenerMensajeError(error, "No se pudo guardar el viaje."));
      } finally {
        dispatch(disminuirContadorPeticiones());
        dispatch(recargarViajesSlice());
      }
    },
  });

  const botonDeshabilitado =
    formik.isSubmitting || !(formik.isValid && formik.dirty);

  const cancelar = async () => {
    if (formik.values.imagenPublicId) {
      eliminarImagenApi(formik.values.imagenPublicId).catch(() => {});
    }
    formik.resetForm();
    setErrorApi("");
    setAbierto(false);
  };

  if (limiteAlcanzado) {
    return (
      <Alert variant="warning" className="aviso-limite" role="alert">
        <strong>Llegaste al límite de tu plan Plus</strong> ({LIMITE_PLAN_PLUS}{" "}
        de {LIMITE_PLAN_PLUS} viajes). Para seguir agregando viajes{" "}
        <Link to="/dashboard/plan">pasate al plan Premium</Link>.
      </Alert>
    );
  }

  if (!abierto) {
    return (
      <div className="text-center mb-4">
        <Button
          variant="success"
          size="lg"
          onClick={() => setAbierto(true)}
          disabled={tipos.length === 0}
        >
          + Agregar viaje
        </Button>
        {tipos.length === 0 && (
          <p className="texto-suave mt-2 mb-0">
            Todavía no hay categorías cargadas. Pedile al administrador que
            cree alguna.
          </p>
        )}
      </div>
    );
  }

  return (
    <Card className="tarjeta-formulario mb-4">
      <Card.Body>
        <h2 className="seccion-titulo">Nuevo viaje</h2>

        {errorApi && (
          <Alert variant="danger" role="alert">
            {errorApi}
          </Alert>
        )}

        <Form onSubmit={formik.handleSubmit} noValidate>
          <CamposViaje formik={formik} tipos={tipos} prefijo="nuevo" />

          <div className="d-flex gap-2 justify-content-end">
            <Button variant="outline-secondary" onClick={cancelar}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="success"
              disabled={botonDeshabilitado}
            >
              Guardar viaje
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AgregarViaje;
