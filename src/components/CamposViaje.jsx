import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import SubirImagen from "./SubirImagen.jsx";

const CamposViaje = ({ formik, tipos, prefijo = "viaje", imagenYaGuardada = "" }) => {
  const esInvalido = (campo) =>
    formik.touched[campo] && Boolean(formik.errors[campo]);

  return (
    <>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId={`${prefijo}-titulo`}>
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              name="titulo"
              value={formik.values.titulo}
              placeholder="Ej.: Vacaciones en Roma"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={esInvalido("titulo")}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.titulo}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId={`${prefijo}-destino`}>
            <Form.Label>Destino</Form.Label>
            <Form.Control
              type="text"
              name="destino"
              value={formik.values.destino}
              placeholder="Ej.: Roma"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={esInvalido("destino")}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.destino}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId={`${prefijo}-fechaInicio`}>
            <Form.Label>Fecha de inicio</Form.Label>
            <Form.Control
              type="date"
              name="fechaInicio"
              value={formik.values.fechaInicio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={esInvalido("fechaInicio")}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.fechaInicio}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId={`${prefijo}-fechaFin`}>
            <Form.Label>Fecha de fin</Form.Label>
            <Form.Control
              type="date"
              name="fechaFin"
              value={formik.values.fechaFin}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={esInvalido("fechaFin")}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.fechaFin}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId={`${prefijo}-tipoDeViaje`}>
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              name="tipoDeViaje"
              value={formik.values.tipoDeViaje}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={esInvalido("tipoDeViaje")}
            >
              <option value="">Elegí una categoría</option>
              {tipos.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formik.errors.tipoDeViaje}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId={`${prefijo}-calificacion`}>
            <Form.Label>Calificación (opcional)</Form.Label>
            <Form.Select
              name="calificacion"
              value={formik.values.calificacion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Sin calificar</option>
              <option value="1">1 - Muy malo</option>
              <option value="2">2 - Malo</option>
              <option value="3">3 - Bueno</option>
              <option value="4">4 - Muy bueno</option>
              <option value="5">5 - Excelente</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <SubirImagen
        imagenUrl={formik.values.imagenUrl}
        imagenPublicId={formik.values.imagenPublicId}
        handleImgURL={(url) => formik.setFieldValue("imagenUrl", url)}
        handleImgPublicId={(id) => formik.setFieldValue("imagenPublicId", id)}
        imagenYaGuardada={imagenYaGuardada}
      />

      <Form.Group className="mb-3" controlId={`${prefijo}-notas`}>
        <Form.Label>Notas (opcional)</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="notas"
          value={formik.values.notas}
          placeholder="Recuerdos, lugares que visitaste, recomendaciones..."
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={esInvalido("notas")}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.notas}
        </Form.Control.Feedback>
      </Form.Group>
    </>
  );
};

export default CamposViaje;
