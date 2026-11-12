import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { seleccionarUsuario } from "../redux/features/usersSlice.js";
import { useSesion } from "../utils/utils.js";

const Menu = () => {
  const usuario = useSelector(seleccionarUsuario);
  const { cerrarSesion } = useSesion();

  const handlerLogout = () => {
    cerrarSesion();
  };

  return (
    <header className="menu-app">
      <Container className="menu-app-contenido">
        <div>
          <h2 className="menu-app-titulo">Bitácora de Viajes</h2>
          <span className="menu-app-lema">Guardá, recordá, viajá.</span>
        </div>

        <nav className="menu-app-enlaces">
          <NavLink to="/dashboard" end>
            Mis viajes
          </NavLink>
          {usuario?.role === "administrador" ? (
            <NavLink to="/dashboard/categorias">Categorías</NavLink>
          ) : (
            <NavLink to="/dashboard/plan">Mi plan</NavLink>
          )}
        </nav>

        <div className="menu-app-acciones">
          <span className="menu-app-usuario">{usuario?.name}</span>
          {usuario?.role === "administrador" ? (
            <span className="etiqueta etiqueta-admin">Administrador</span>
          ) : (
            <span
              className={`etiqueta ${
                usuario?.plan === "premium"
                  ? "etiqueta-premium"
                  : "etiqueta-plus"
              }`}
            >
              Plan {usuario?.plan === "premium" ? "Premium" : "Plus"}
            </span>
          )}
          <button
            type="button"
            className="boton-logout"
            onClick={handlerLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </Container>
    </header>
  );
};

export default Menu;
