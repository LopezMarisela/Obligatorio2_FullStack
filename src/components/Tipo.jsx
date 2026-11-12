import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { esquemaTipo } from "../utils/esquemasTipo.js";
import {
  actualizarTipoApi,
  eliminarTipoApi,
} from "../services/tiposServices.js";
import { obtenerMensajeError } from "../services/api.js";
import {
  modificarTipoSlice,
  borrarTipoSlice,
} from "../redux/features/tiposSlice.js";
import {
  aumentarContadorPeticiones,
  disminuirContadorPeticiones,
} from "../redux/features/loadingSlice.js";

const Tipo = ({ tipo }) => {
  const dispatch = useDispatch();
  const [editando, setEditando] = useState(false);
  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false);

  const formik = useFormik({
    initialValues: { nombre: tipo.nombre, descripcion: tipo.descripcion || "" },
    validationSchema: esquemaTipo,
  
    enableReinitialize: true,
    onSubmit: async (valores) => {
      try {
        dispatch(aumentarContadorPeticiones());
        const actualizado = await actualizarTipoApi(tipo.id, {
          nombre: valores.nombre.trim(),
          descripcion: valores.descripcion.trim(),
        });
        dispatch(modificarTipoSlice(actualizado));
        toast.success("Categoría actualizada.");
        setEditando(false);
      } catch (error) {
        toast.error(
          obtenerMensajeError(error, "No se pudo actualizar la categoría."),
        );
      } finally {
        dispatch(disminuirContadorPeticiones());
      }
    },
  });

  const eliminar = async () => {
    try {
      dispatch(aumentarContadorPeticiones());
      await eliminarTipoApi(tipo.id);
      dispatch(borrarTipoSlice(tipo.id));
      toast.success("Categoría eliminada.");
    } catch (error) {
 
      toast.error(
        obtenerMensajeError(error, "No se pudo eliminar la categoría."),
      );
    } finally {
      setConfirmandoBorrado(false);
      dispatch(disminuirContadorPeticiones());
    }
  };

  if (editando) {
    return (
      <li className="fila-tipo">
        <Form onSubmit={formik.handleSubmit} noValidate className="fila-tipo-form">
          <Form.Group controlId={`tipo-nombre-${tipo.id}`}>
            <Form.Label className="visually-hidden">Nombre</Form.Label>
            <Form.Control
              name="nombre"
              value={formik.values.nombre}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.nombre && Boolean(formik.errors.nombre)}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.nombre}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId={`tipo-descripcion-${tipo.id}`}>
            <Form.Label className="visually-hidden">Descripción</Form.Label>
            <Form.Control
              name="descripcion"
              value={formik.values.descripcion}
              placeholder="Descripción (opcional)"
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
          <div className="d-flex gap-2">
            <Button
              type="submit"
              size="sm"
              variant="success"
              disabled={formik.isSubmitting || !(formik.isValid && formik.dirty)}
            >
              Guardar
            </Button>
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() => {
                formik.resetForm();
                setEditando(false);
              }}
            >
              Cancelar
            </Button>
          </div>
        </Form>
      </li>
    );
  }

  return (
    <li className="fila-tipo">
      <div>
        <strong>{tipo.nombre}</strong>
        {tipo.descripcion && (
          <span className="texto-suave"> — {tipo.descripcion}</span>
        )}
      </div>
      <div className="d-flex gap-2">
        <Button
          size="sm"
          variant="outline-success"
          onClick={() => setEditando(true)}
        >
          Editar
        </Button>
        <Button
          size="sm"
          variant="outline-danger"
          onClick={() => setConfirmandoBorrado(true)}
        >
          Eliminar
        </Button>
      </div>

      <Modal
        show={confirmandoBorrado}
        onHide={() => setConfirmandoBorrado(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Eliminar categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que querés eliminar la categoría «{tipo.nombre}»?
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
    </li>
  );
};

export default Tipo;
