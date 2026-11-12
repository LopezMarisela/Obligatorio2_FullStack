
export const formatearFecha = (fechaIso) => {
  if (!fechaIso) {
    return "";
  }
  return new Date(fechaIso).toLocaleDateString("es-UY", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};


export const aValorInputFecha = (fechaIso) => {
  if (!fechaIso) {
    return "";
  }
  return new Date(fechaIso).toISOString().slice(0, 10);
};


export const aEstrellas = (calificacion) => {
  if (!calificacion) {
    return "";
  }
  return "★".repeat(calificacion) + "☆".repeat(5 - calificacion);
};


export const miniaturaCloudinary = (url) => {
  if (!url || !url.includes("/upload/")) {
    return url;
  }
  return url.replace("/upload/", "/upload/c_fill,w_800,h_400,q_auto,f_auto/");
};
