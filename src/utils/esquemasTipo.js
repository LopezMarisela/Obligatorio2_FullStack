import * as Yup from "yup";


export const esquemaTipo = Yup.object({
  nombre: Yup.string()
    .trim()
    .required("El nombre de la categoría es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres"),
  descripcion: Yup.string().max(
    200,
    "La descripción no puede superar los 200 caracteres",
  ),
});
