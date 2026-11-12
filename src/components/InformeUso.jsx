import ProgressBar from "react-bootstrap/ProgressBar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { LIMITE_PLAN_PLUS } from "./AgregarViaje.jsx";
import { seleccionarUsuario } from "../redux/features/usersSlice.js";
import { seleccionarTotalUsuario } from "../redux/features/viajesSlice.js";

const InformeUso = () => {
  const usuario = useSelector(seleccionarUsuario);
  const total = useSelector(seleccionarTotalUsuario);


  if (usuario?.role === "administrador" || total === null) {
    return null;
  }

  if (usuario?.plan === "premium") {
    return (
      <section className="informe-uso" aria-label="Informe de uso">
        <h2 className="seccion-subtitulo">Tu uso del plan Premium</h2>
        <p className="informe-cantidad">
          <strong>{total}</strong> {total === 1 ? "viaje cargado" : "viajes cargados"}
        </p>
        <p className="texto-suave mb-0">Sin límite de viajes.</p>
      </section>
    );
  }

  const porcentaje = Math.min(100, Math.round((total / LIMITE_PLAN_PLUS) * 100));
  const limiteAlcanzado = total >= LIMITE_PLAN_PLUS;

  return (
    <section className="informe-uso" aria-label="Informe de uso">
      <h2 className="seccion-subtitulo">Tu uso del plan Plus</h2>
      <p className="informe-cantidad">
        <strong>{total}</strong> de {LIMITE_PLAN_PLUS} viajes ({porcentaje}%)
      </p>
      <ProgressBar
        now={porcentaje}
        variant={limiteAlcanzado ? "danger" : "success"}
        aria-label="Porcentaje de viajes usados"
      />
      <p className="texto-suave mt-2 mb-0">
        {limiteAlcanzado
          ? "Llegaste al límite. "
          : `Te quedan ${LIMITE_PLAN_PLUS - total} para llegar al límite. `}
        <Link to="/dashboard/plan">Cambiar a Premium</Link>
      </p>
    </section>
  );
};

export default InformeUso;
