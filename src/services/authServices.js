import api from "./api.js";


export const loginApi = async (dataLogin) => {
  const response = await api.post("/auth/login", dataLogin);
  return response.data;
};

export const registroApi = async (dataRegistro) => {
  const response = await api.post("/auth/registro", dataRegistro);
  return response.data;
};
