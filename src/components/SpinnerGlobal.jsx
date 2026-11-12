import { useSelector } from "react-redux";
import Spinner from "react-bootstrap/Spinner";


const obtenerContadorPeticiones = (state) =>
  state.loadingSlice.contadorPeticiones;

const SpinnerGlobal = () => {
  const cargando = useSelector(obtenerContadorPeticiones) > 0;

  if (!cargando) {
    return null;
  }

  return (
    <div className="spinner-global">
      <Spinner animation="border" variant="success" />
      <span>Cargando...</span>
    </div>
  );
};

export default SpinnerGlobal;
