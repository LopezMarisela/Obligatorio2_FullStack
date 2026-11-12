import axios from "axios";
import { store } from "../redux/store.js";
import { cerrarSesionSlice } from "../redux/features/usersSlice.js";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL_BACKEND,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      store.dispatch(cerrarSesionSlice());
    }
    return Promise.reject(error);
  },
);


export const obtenerMensajeError = (
  error,
  mensajePorDefecto = "Ocurrió un error inesperado. Intentá de nuevo.",
) => {
  if (error.response?.data?.mensaje) {
    return error.response.data.mensaje;
  }
  if (error.request && !error.response) {
    return "No se pudo conectar con el servidor. Revisá tu conexión.";
  }
  return mensajePorDefecto;
};

export default api;
