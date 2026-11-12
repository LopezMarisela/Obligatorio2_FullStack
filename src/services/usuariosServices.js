import api from "./api.js";


export const cambiarAPremiumApi = async () => {
  const response = await api.patch("/usuarios/plan");
  return response.data;
};
