import { configureStore } from "@reduxjs/toolkit";
import usersSlice from "./features/usersSlice.js";
import loadingSlice from "./features/loadingSlice.js";
import viajesSlice from "./features/viajesSlice.js";
import tiposSlice from "./features/tiposSlice.js";


export const store = configureStore({
  reducer: {
    usersSlice,
    loadingSlice,
    viajesSlice,
    tiposSlice,
  },
});
