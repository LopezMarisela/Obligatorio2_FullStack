import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  iniciarSesionSlice,
  cerrarSesionSlice,
} from "../redux/features/usersSlice.js";
import {
  guardarSesion,
  borrarSesion,
  programarVencimiento,
} from "./sesion.js";

export const useSesion = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cerrarSesion = (mensaje) => {
    borrarSesion();
    dispatch(cerrarSesionSlice());
    navigate("/login", { replace: true });
    if (mensaje) {
      toast.info(mensaje);
    }
  };

  const iniciarSesion = (token, usuario) => {
    guardarSesion(token, usuario);
    dispatch(iniciarSesionSlice(usuario));
    programarVencimiento(token, () =>
      cerrarSesion("Tu sesión venció. Iniciá sesión nuevamente."),
    );
  };

  return { iniciarSesion, cerrarSesion };
};
