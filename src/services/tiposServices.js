import api from "./api.js";


export const listarTiposApi = async (signal) => {
  const response = await api.get("/tipos-de-viaje", { signal });
  return response.data;
};


export const crearTipoApi = async (tipo) => {
  const response = await api.post("/tipos-de-viaje", tipo);
  return response.data;
};


export const actualizarTipoApi = async (idTipoViaje, cambios) => {
  const response = await api.patch(`/tipos-de-viaje/${idTipoViaje}`, cambios);
  return response.data;
};


export const eliminarTipoApi = async (idTipoViaje) => {
  await api.delete(`/tipos-de-viaje/${idTipoViaje}`);
};
