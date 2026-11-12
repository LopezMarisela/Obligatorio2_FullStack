import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { cambiarAPremiumApi } from "../services/usuariosServices.js";
import { obtenerMensajeError } from "../services/api.js";
import { useSesion } from "../utils/utils.js";
import { seleccionarUsuario } from "../redux/features/usersSlice.js";
import {
  aumentarContadorPeticiones,
  disminuirContadorPeticiones,
} from "../redux/features/loadingSlice.js";

const CambioPlan = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const usuario = useSelector(seleccionarUsuario);
  const { iniciarSesion } = useSesion();

  const [confirmando, setConfirmando] = useState(false);
  const [errorApi, setErrorApi] = useState("");

  if (usuario?.role === "administrador") {
    return <Navigate to="/dashboard" replace />;
  }

  const esPremium = usuario?.plan === "premium";

  const cambiar = async () => {
    setErrorApi("");
    try {
      dispatch(aumentarContadorPeticiones());
      const resultado = await cambiarAPremiumApi();
      iniciarSesion(resultado.token, resultado.user);
      toast.success("¡Ahora tenés el plan Premium!");
      navigate("/dashboard");
    } catch (error) {
      setErrorApi(obtenerMensajeError(error, "No se pudo cambiar de plan."));
    } finally {
      setConfirmando(false);
      dispatch(disminuirContadorPeticiones());
    }
  };

  return (
    <Container className="contenedor-estrecho">
      <h1 className="saludo">Tu plan</h1>

      {errorApi && (
        <Alert variant="danger" role="alert">
          {errorApi}
        </Alert>
      )}

      <div className="planes">
        <Card className={`tarjeta-plan ${!esPremium ? "plan-actual" : ""}`}>
          <Card.Body>
            <h2 className="seccion-subtitulo">Plus</h2>
            <p>Hasta 4 viajes en tu bitácora.</p>
            {!esPremium && <span className="etiqueta etiqueta-plus">Tu plan actual</span>}
          </Card.Body>
        </Card>
        <Card className={`tarjeta-plan ${esPremium ? "plan-actual" : ""}`}>
          <Card.Body>
            <h2 className="seccion-subtitulo">Premium</h2>
            <p>Viajes ilimitados.</p>
            {esPremium ? (
              <span className="etiqueta etiqueta-premium">Tu plan actual</span>
            ) : (
              <Button variant="success" onClick={() => setConfirmando(true)}>
                Cambiar a Premium
              </Button>
            )}
          </Card.Body>
        </Card>
      </div>

      <Modal show={confirmando} onHide={() => setConfirmando(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cambiar a Premium</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Querés pasar al plan Premium? Vas a poder cargar viajes sin límite.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setConfirmando(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={cambiar}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CambioPlan;
