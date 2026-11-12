import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";

import { registroApi } from "../services/authServices.js";
import { obtenerMensajeError } from "../services/api.js";
import { useSesion } from "../utils/utils.js";
import {
  aumentarContadorPeticiones,
  disminuirContadorPeticiones,
} from "../redux/features/loadingSlice.js";

const esquemaRegistro = Yup.object({
  name: Yup.string()
    .trim()
    .required("El nombre es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(60, "El nombre no puede superar los 60 caracteres"),
  username: Yup.string()
    .required("El nombre de usuario es obligatorio")
    .matches(
      /^[a-zA-Z0-9]+$/,
      "El nombre de usuario solo puede tener letras y números",
    )
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(30, "El nombre de usuario no puede superar los 30 caracteres"),
  email: Yup.string()
    .required("El correo electrónico es obligatorio")
    .email("El correo electrónico no tiene un formato válido"),
  password: Yup.string()
    .required("La contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "La contraseña debe tener al menos una mayúscula, una minúscula y un número",
    ),
  confirmPassword: Yup.string()
    .required("Debés repetir la contraseña")
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden"),
});

const Registro = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { iniciarSesion } = useSesion();

  const [errorApi, setErrorApi] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: esquemaRegistro,

    onSubmit: async (valores) => {
      setErrorApi("");
      try {
        dispatch(aumentarContadorPeticiones());

        const resultado = await registroApi({
          name: valores.name.trim(),
          username: valores.username,
          email: valores.email,
          password: valores.password,
          confirmPassword: valores.confirmPassword,
        });

        iniciarSesion(resultado.token, resultado.user);

        toast.success("¡Cuenta creada correctamente! Ya estás dentro.");
        navigate("/dashboard");
      } catch (error) {
        setErrorApi(
          obtenerMensajeError(error, "No se pudo completar el registro."),
        );
      } finally {
        dispatch(disminuirContadorPeticiones());
      }
    },
  });

  const esInvalido = (campo) =>
    formik.touched[campo] && Boolean(formik.errors[campo]);

  const botonDeshabilitado =
    formik.isSubmitting || !(formik.isValid && formik.dirty);

  return (
    <div className="auth-pagina">
      <Card className="auth-card auth-card-ancha">
        <Card.Body>
          <h1 className="auth-titulo">Creá tu cuenta</h1>
          <p className="auth-subtitulo">
            Empezás con el plan Plus (hasta 4 viajes)
          </p>

          {errorApi && (
            <Alert variant="danger" role="alert">
              {errorApi}
            </Alert>
          )}

          <Form onSubmit={formik.handleSubmit} noValidate>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formik.values.name}
                placeholder="Ej.: Ana López"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={esInvalido("name")}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Nombre de usuario</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formik.values.username}
                placeholder="Ej.: analopez"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={esInvalido("username")}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.username}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formik.values.email}
                placeholder="Ej.: ana@correo.com"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={esInvalido("email")}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formik.values.password}
                placeholder="Mínimo 8 caracteres"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={esInvalido("password")}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Repetir contraseña</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                placeholder="Repetí la contraseña"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={esInvalido("confirmPassword")}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              variant="success"
              type="submit"
              className="w-100"
              disabled={botonDeshabilitado}
            >
              {formik.isSubmitting ? "Registrando..." : "Registrarme"}
            </Button>
          </Form>

          <p className="auth-enlace">
            ¿Ya tenés cuenta? <Link to="/login">Ingresá</Link>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Registro;
