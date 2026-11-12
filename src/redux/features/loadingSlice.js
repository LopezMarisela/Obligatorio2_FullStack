import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contadorPeticiones: 0,
};

const loadingSlice = createSlice({
  name: "loadingSlice",
  initialState,
  reducers: {
    aumentarContadorPeticiones: (state) => {
      state.contadorPeticiones = state.contadorPeticiones + 1;
    },
    disminuirContadorPeticiones: (state) => {
      if (state.contadorPeticiones > 0) {
        state.contadorPeticiones = state.contadorPeticiones - 1;
      }
    },
  },
});

export const { aumentarContadorPeticiones, disminuirContadorPeticiones } =
  loadingSlice.actions;
export default loadingSlice.reducer;
