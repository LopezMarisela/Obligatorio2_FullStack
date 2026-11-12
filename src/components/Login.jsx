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

import { loginApi } from "../services/authServices.js";
import { obtenerMensajeError } from "../services/api.js";
import { useSesion } from "../utils/utils.js";
import {
  aumentarContadorPeticiones,
  disminuirContadorPeticiones,
} from "../redux/features/loadingSlice.js";

const esquemaLogin = Yup.object({
  identificador: Yup.string()
    .trim()
    .required("Ingresá tu usuario o email")
    .min(3, "El usuario debe tener al menos 3 caracteres"),
  password: Yup.string()
    .required("La contraseña es obligatoria")
    .min(3, "La contraseña debe tener al menos 3 caracteres")
    .max(30, "La contraseña no puede superar los 30 caracteres"),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { iniciarSesion } = useSesion();

  const [errorApi, setErrorApi] = useState("");

  const formik = useFormik({
    initialValues: {
      identificador: "",
      password: "",
    },

    validationSchema: esquemaLogin,

    onSubmit: async (valores) => {
      setErrorApi("");
      try {
        dispatch(aumentarContadorPeticiones());

        const resultado = await loginApi({
          identificador: valores.identificador.trim(),
          password: valores.password,
        });

        iniciarSesion(resultado.token, resultado.user);

        toast.success(`¡Bienvenido/a, ${resultado.user.name}!`);
        navigate("/dashboard");
      } catch (error) {
        setErrorApi(
          obtenerMensajeError(error, "No se pudo iniciar sesión. Revisá tus datos."),
        );
      } finally {
        dispatch(disminuirContadorPeticiones());
      }
    },
  });

  const camposVacios =
    formik.values.identificador.trim() === "" || formik.values.password === "";

  return (
    <div className="auth-pagina">
      <Card className="auth-card">
        <Card.Body>
          <h1 className="auth-titulo">Bitácora de Viajes</h1>
          <p className="auth-subtitulo">Ingresá para ver tus viajes</p>

          {errorApi && (
            <Alert variant="danger" role="alert">
              {errorApi}
            </Alert>
          )}

          <Form onSubmit={formik.handleSubmit} noValidate>
            <Form.Group className="mb-3" controlId="identificador">
              <Form.Label>Usuario o email</Form.Label>
              <Form.Control
                type="text"
                name="identificador"
                value={formik.values.identificador}
                placeholder="Ingresá tu usuario o email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.identificador &&
                  Boolean(formik.errors.identificador)
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.identificador}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formik.values.password}
                placeholder="Ingresá tu contraseña"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.password && Boolean(formik.errors.password)
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              variant="success"
              type="submit"
              className="w-100"
              disabled={formik.isSubmitting || camposVacios}
            >
              {formik.isSubmitting ? "Ingresando..." : "Ingresar"}
            </Button>
          </Form>

          <p className="auth-enlace">
            ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
