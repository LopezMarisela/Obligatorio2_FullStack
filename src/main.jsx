import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/estilos.css";

import { store } from "./redux/store.js";
import Rutas from "./components/Rutas.jsx";
import SpinnerGlobal from "./components/SpinnerGlobal.jsx";


createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <SpinnerGlobal />
    <ToastContainer position="top-right" autoClose={4000} />
    <Rutas />
  </Provider>,
);
