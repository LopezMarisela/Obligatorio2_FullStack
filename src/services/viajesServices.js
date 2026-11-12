import api from "./api.js";

const limpiarParametros = (params) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, valor]) => valor !== "" && valor !== null && valor !== undefined,
    ),
  );


export const listarViajesApi = async (params = {}, signal) => {
  const response = await api.get("/viajes", {
    params: limpiarParametros(params),
    signal,
  });
  return response.data;
};


export const obtenerTotalViajesApi = async (signal) => {
  const data = await listarViajesApi({ page: 1, limit: 1 }, signal);
  return data.paginacion.total;
};


export const crearViajeApi = async (viaje) => {
  const response = await api.post("/viajes", viaje);
  return response.data;
};


export const actualizarViajeApi = async (idViaje, cambios) => {
  const response = await api.patch(`/viajes/${idViaje}`, cambios);
  return response.data;
};


export const eliminarViajeApi = async (idViaje) => {
  await api.delete(`/viajes/${idViaje}`);
};


export const obtenerTodosLosViajesApi = async (signal) => {
  const todos = [];
  let pagina = 1;
  let totalPaginas = 1;
  do {
    const data = await listarViajesApi({ page: pagina, limit: 50 }, signal);
    todos.push(...data.viajes);
    totalPaginas = data.paginacion.totalPages;
    pagina += 1;
  } while (pagina <= totalPaginas);
  return todos;
};


export const generarItinerarioApi = async (idViaje) => {
  const response = await api.post(`/viajes/${idViaje}/itinerario`);
  return response.data;
};


export const obtenerClimaApi = async (idViaje) => {
  const response = await api.get(`/viajes/${idViaje}/clima`);
  return response.data;
};
