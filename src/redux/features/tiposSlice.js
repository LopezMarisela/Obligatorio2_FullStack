import { createSlice } from "@reduxjs/toolkit";
import { cerrarSesionSlice } from "./usersSlice.js";


const initialState = {
  lista: [],
};

const tiposSlice = createSlice({
  name: "tiposSlice",
  initialState,
  reducers: {
    cargarTiposSlice: (state, action) => {
      state.lista = action.payload;
    },
    agregarTipoSlice: (state, action) => {
      state.lista.push(action.payload);
      state.lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
    },
    modificarTipoSlice: (state, action) => {
      const tipoModificado = action.payload;
      const indice = state.lista.findIndex((t) => t.id === tipoModificado.id);
      if (indice !== -1) {
        state.lista[indice] = tipoModificado;
        state.lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
      }
    },
    borrarTipoSlice: (state, action) => {
      const id = action.payload;
      state.lista = state.lista.filter((t) => t.id !== id);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(cerrarSesionSlice, () => initialState);
  },
});

export const {
  cargarTiposSlice,
  agregarTipoSlice,
  modificarTipoSlice,
  borrarTipoSlice,
} = tiposSlice.actions;
export default tiposSlice.reducer;

export const seleccionarTipos = (state) => state.tiposSlice.lista;
