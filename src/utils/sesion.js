import { jwtDecode } from "jwt-decode";


let temporizadorId = null;

export const cancelarVencimiento = () => {
  clearTimeout(temporizadorId);
  temporizadorId = null;
};


export const guardarSesion = (token, usuario) => {
  localStorage.setItem("token", token);
  localStorage.setItem("usuario", JSON.stringify(usuario));
};

export const borrarSesion = () => {
  cancelarVencimiento();
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
};


export const programarVencimiento = (token, alVencer) => {
  cancelarVencimiento();

  try {
    const { exp } = jwtDecode(token);
    if (!exp) {
      return;
    }
    const milisegundosRestantes = exp * 1000 - Date.now();
    if (milisegundosRestantes <= 0) {
      alVencer();
      return;
    }
    temporizadorId = setTimeout(alVencer, milisegundosRestantes);
  } catch {
    alVencer();
  }
};
