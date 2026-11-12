import api from "./api.js";


export const subirImagenApi = async (base64) => {
  const response = await api.post("/images", { file: base64 });
  return response.data;
};


export const eliminarImagenApi = async (publicId) => {
  await api.delete("/images", { params: { publicId } });
};
