import { createSlice } from "@reduxjs/toolkit";
import { cerrarSesionSlice } from "./usersSlice.js";

export const VIAJES_POR_PAGINA = 6;

export const filtrosVacios = {
  destino: "",
  tipoDeViaje: "",
  desde: "",
  hasta: "",
  calificacionMin: "",
};


const initialState = {
  lista: [],
  paginacion: { page: 1, limit: VIAJES_POR_PAGINA, total: 0, totalPages: 0 },
  paginaActual: 1,
  filtros: filtrosVacios,
  totalUsuario: null,
  recargas: 0,
};

const viajesSlice = createSlice({
  name: "viajesSlice",
  initialState,
  reducers: {
    cargarViajesSlice: (state, action) => {
      const { viajes, paginacion } = action.payload;
      state.lista = viajes;
      state.paginacion = paginacion;
    },
    modificarViajeSlice: (state, action) => {
      const viajeModificado = action.payload;
      const indice = state.lista.findIndex((v) => v.id === viajeModificado.id);
      if (indice !== -1) {
        state.lista[indice] = viajeModificado;
      }
    },
    cambiarPaginaSlice: (state, action) => {
      state.paginaActual = action.payload;
    },
    modificarFiltrosSlice: (state, action) => {
      state.filtros = action.payload;
      state.paginaActual = 1;
    },
    limpiarFiltrosSlice: (state) => {
      state.filtros = filtrosVacios;
      state.paginaActual = 1;
    },
    cargarTotalUsuarioSlice: (state, action) => {
      state.totalUsuario = action.payload;
    },
    recargarViajesSlice: (state) => {
      state.recargas = state.recargas + 1;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(cerrarSesionSlice, () => initialState);
  },
});

export const {
  cargarViajesSlice,
  modificarViajeSlice,
  cambiarPaginaSlice,
  modificarFiltrosSlice,
  limpiarFiltrosSlice,
  cargarTotalUsuarioSlice,
  recargarViajesSlice,
} = viajesSlice.actions;
export default viajesSlice.reducer;


export const seleccionarViajes = (state) => state.viajesSlice.lista;
export const seleccionarPaginacion = (state) => state.viajesSlice.paginacion;
export const seleccionarPaginaActual = (state) => state.viajesSlice.paginaActual;
export const seleccionarFiltros = (state) => state.viajesSlice.filtros;
export const seleccionarTotalUsuario = (state) => state.viajesSlice.totalUsuario;
export const seleccionarRecargas = (state) => state.viajesSlice.recargas;
