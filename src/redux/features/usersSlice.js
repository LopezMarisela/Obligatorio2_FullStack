import { createSlice } from "@reduxjs/toolkit";


const leerUsuarioGuardado = () => {
  try {
    const usuarioGuardado = localStorage.getItem("usuario");
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  } catch {
    return null;
  }
};


const initialState = {
  usuario: leerUsuarioGuardado(),
};

const usersSlice = createSlice({
  name: "usersSlice",
  initialState,
  reducers: {
    iniciarSesionSlice: (state, action) => {
      state.usuario = action.payload;
    },
    cerrarSesionSlice: (state) => {
      state.usuario = null;
    },
  },
});

export const { iniciarSesionSlice, cerrarSesionSlice } = usersSlice.actions;
export default usersSlice.reducer;


export const seleccionarUsuario = (state) => state.usersSlice.usuario;
