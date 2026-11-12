import * as Yup from "yup";


export const esquemaViaje = Yup.object({
  titulo: Yup.string()
    .trim()
    .required("El título es obligatorio")
    .min(2, "El título debe tener al menos 2 caracteres")
    .max(100, "El título no puede superar los 100 caracteres"),
  destino: Yup.string()
    .trim()
    .required("El destino es obligatorio")
    .min(2, "El destino debe tener al menos 2 caracteres")
    .max(100, "El destino no puede superar los 100 caracteres"),
  fechaInicio: Yup.string().required("La fecha de inicio es obligatoria"),
  fechaFin: Yup.string()
    .required("La fecha de fin es obligatoria")

    .test(
      "fin-no-anterior",
      "La fecha de fin no puede ser anterior a la de inicio",
      function (valor) {
        const { fechaInicio } = this.parent;
        return !valor || !fechaInicio || valor >= fechaInicio;
      },
    ),
  tipoDeViaje: Yup.string().required("Elegí una categoría"),
  calificacion: Yup.string().oneOf(["", "1", "2", "3", "4", "5"]),
  notas: Yup.string().max(2000, "Las notas no pueden superar los 2000 caracteres"),
});


export const armarCuerpoViaje = (valores) => {
  const cuerpo = {
    titulo: valores.titulo.trim(),
    destino: valores.destino.trim(),
    fechaInicio: valores.fechaInicio,
    fechaFin: valores.fechaFin,
    notas: (valores.notas || "").trim(),
    tipoDeViaje: valores.tipoDeViaje,

    imagenUrl: valores.imagenUrl || "",
    imagenPublicId: valores.imagenPublicId || "",
  };
  if (valores.calificacion) {
    cuerpo.calificacion = Number(valores.calificacion);
  }
  return cuerpo;
};
