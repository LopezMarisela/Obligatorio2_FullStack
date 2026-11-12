import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

import { seleccionarTipos } from "../redux/features/tiposSlice.js";
import {
  seleccionarFiltros,
  modificarFiltrosSlice,
  limpiarFiltrosSlice,
  filtrosVacios,
} from "../redux/features/viajesSlice.js";

const esquemaFiltros = Yup.object({
  destino: Yup.string().max(100, "Máximo 100 caracteres"),
  desde: Yup.string(),
  hasta: Yup.string().test(
    "hasta-no-anterior",
    "La fecha «hasta» no puede ser anterior a «desde»",
    function (valor) {
      const { desde } = this.parent;
      return !valor || !desde || valor >= desde;
    },
  ),
});

const FiltrosViajes = () => {
  const dispatch = useDispatch();
  const tipos = useSelector(seleccionarTipos);
  const filtros = useSelector(seleccionarFiltros);

  const formik = useFormik({
    initialValues: filtros,
    validationSchema: esquemaFiltros,
    onSubmit: (valores) => {
      dispatch(
        modificarFiltrosSlice({ ...valores, destino: valores.destino.trim() }),
      );
    },
  });

  const limpiar = () => {
    formik.resetForm({ values: filtrosVacios });
    dispatch(limpiarFiltrosSlice());
  };

  return (
    <Form onSubmit={formik.handleSubmit} noValidate className="filtros-viajes">
      <Row className="g-2 align-items-end">
        <Col lg={3} md={6}>
          <Form.Group controlId="filtro-destino">
            <Form.Label>Destino</Form.Label>
            <Form.Control
              type="text"
              name="destino"
              value={formik.values.destino}
              placeholder="Ej.: Roma"
              onChange={formik.handleChange}
            />
          </Form.Group>
        </Col>
        <Col lg={3} md={6}>
          <Form.Group controlId="filtro-categoria">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              name="tipoDeViaje"
              value={formik.values.tipoDeViaje}
              onChange={formik.handleChange}
            >
              <option value="">Todas</option>
              {tipos.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col lg={2} md={4}>
          <Form.Group controlId="filtro-desde">
            <Form.Label>Desde</Form.Label>
            <Form.Control
              type="date"
              name="desde"
              value={formik.values.desde}
              onChange={formik.handleChange}
            />
          </Form.Group>
        </Col>
        <Col lg={2} md={4}>
          <Form.Group controlId="filtro-hasta">
            <Form.Label>Hasta</Form.Label>
            <Form.Control
              type="date"
              name="hasta"
              value={formik.values.hasta}
              onChange={formik.handleChange}
              isInvalid={Boolean(formik.errors.hasta)}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.hasta}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col lg={2} md={4}>
          <Form.Group controlId="filtro-calificacion">
            <Form.Label>Calificación mínima</Form.Label>
            <Form.Select
              name="calificacionMin"
              value={formik.values.calificacionMin}
              onChange={formik.handleChange}
            >
              <option value="">Cualquiera</option>
              <option value="1">1 o más</option>
              <option value="2">2 o más</option>
              <option value="3">3 o más</option>
              <option value="4">4 o más</option>
              <option value="5">5</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <div className="d-flex gap-2 justify-content-end mt-3">
        <Button variant="outline-secondary" onClick={limpiar}>
          Limpiar filtros
        </Button>
        <Button type="submit" variant="success" disabled={!formik.isValid}>
          Filtrar
        </Button>
      </div>
    </Form>
  );
};

export default FiltrosViajes;
