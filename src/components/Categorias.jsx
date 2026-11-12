import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from "formik";

import Tipo from "./Tipo.jsx";
import { crearTipoApi } from "../services/tiposServices.js";
import { obtenerMensajeError } from "../services/api.js";
import { esquemaTipo } from "../utils/esquemasTipo.js";
import { seleccionarUsuario } from "../redux/features/usersSlice.js";
import {
  seleccionarTipos,
  agregarTipoSlice,
} from "../redux/features/tiposSlice.js";
import {
  aumentarContadorPeticiones,
  disminuirContadorPeticiones,
} from "../redux/features/loadingSlice.js";

const Categorias = () => {
  const dispatch = useDispatch();
  const usuario = useSelector(seleccionarUsuario);
  const tipos = useSelector(seleccionarTipos);
  const [errorApi, setErrorApi] = useState("");

  const formik = useFormik({
    initialValues: { nombre: "", descripcion: "" },
    validationSchema: esquemaTipo,
    onSubmit: async (valores, { resetForm }) => {
      setErrorApi("");
      try {
        dispatch(aumentarContadorPeticiones());
        const creado = await crearTipoApi({
          nombre: valores.nombre.trim(),
          descripcion: valores.descripcion.trim(),
        });
        dispatch(agregarTipoSlice(creado));
        toast.success("Categoría creada.");
        resetForm();
      } catch (error) {
        setErrorApi(
          obtenerMensajeError(error, "No se pudo crear la categoría."),
        );
      } finally {
        dispatch(disminuirContadorPeticiones());
      }
    },
  });

  if (usuario?.role !== "administrador") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Container className="contenedor-estrecho">
      <h1 className="saludo">Categorías de viaje</h1>
      <p className="saludo-detalle">
        Solo el administrador puede crearlas, editarlas y eliminarlas.
      </p>

      {errorApi && (
        <Alert variant="danger" role="alert">
          {errorApi}
        </Alert>
      )}

      <Form onSubmit={formik.handleSubmit} noValidate className="tarjeta-formulario mb-4">
        <h2 className="seccion-subtitulo">Nueva categoría</h2>
        <Form.Group className="mb-2" controlId="tipo-nuevo-nombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            name="nombre"
            value={formik.values.nombre}
            placeholder="Ej.: Playa"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.nombre && Boolean(formik.errors.nombre)}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.nombre}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="tipo-nuevo-descripcion">
          <Form.Label>Descripción (opcional)</Form.Label>
          <Form.Control
            name="descripcion"
            value={formik.values.descripcion}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={
              formik.touched.descripcion && Boolean(formik.errors.descripcion)
            }
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.descripcion}
          </Form.Control.Feedback>
        </Form.Group>
        <div className="text-end">
          <Button
            type="submit"
            variant="success"
            disabled={formik.isSubmitting || !(formik.isValid && formik.dirty)}
          >
            Agregar categoría
          </Button>
        </div>
      </Form>

      {tipos.length === 0 ? (
        <p className="texto-suave text-center">Todavía no hay categorías.</p>
      ) : (
        <ul className="lista-tipos">
          {tipos.map((tipo) => (
            <Tipo key={tipo.id} tipo={tipo} />
          ))}
        </ul>
      )}
    </Container>
  );
};

export default Categorias;
