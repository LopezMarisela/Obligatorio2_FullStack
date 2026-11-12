import { useId, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { subirImagenApi, eliminarImagenApi } from "../services/imageServices.js";
import { obtenerMensajeError } from "../services/api.js";
import { prepararImagen, TIPOS_IMAGEN_PERMITIDOS } from "../utils/imagen.js";
import {
  aumentarContadorPeticiones,
  disminuirContadorPeticiones,
} from "../redux/features/loadingSlice.js";

const SubirImagen = ({
  imagenUrl,
  imagenPublicId,
  handleImgURL,
  handleImgPublicId,
  imagenYaGuardada = "",
}) => {
  const dispatch = useDispatch();
  const inputId = useId();
  const [subiendo, setSubiendo] = useState(false);

  const handleArchivo = async (evento) => {
    const archivo = evento.target.files?.[0];
    evento.target.value = ""; 
    if (!archivo) {
      return;
    }
    if (!TIPOS_IMAGEN_PERMITIDOS.includes(archivo.type)) {
      toast.error("Elegí una imagen JPG, PNG o WebP.");
      return;
    }

    setSubiendo(true);
    try {
      dispatch(aumentarContadorPeticiones());
      const base64 = await prepararImagen(archivo);
      const resultado = await subirImagenApi(base64);

      await borrarSiEsNueva();

      handleImgURL(resultado.secure_url);
      handleImgPublicId(resultado.public_id);
    } catch (error) {
      toast.error(obtenerMensajeError(error, "No se pudo subir la imagen."));
    } finally {
      dispatch(disminuirContadorPeticiones());
      setSubiendo(false);
    }
  };

  const borrarSiEsNueva = async () => {
    if (imagenPublicId && imagenPublicId !== imagenYaGuardada) {
      try {
        await eliminarImagenApi(imagenPublicId);
      } catch {
       
      }
    }
  };

  const quitar = async () => {
    setSubiendo(true);
    await borrarSiEsNueva();
    handleImgURL("");
    handleImgPublicId("");
    setSubiendo(false);
  };

  return (
    <Form.Group className="mb-3" controlId={inputId}>
      <Form.Label>Foto (opcional)</Form.Label>

      {imagenUrl && (
        <div className="mb-2">
          <img src={imagenUrl} alt="Vista previa del viaje" className="vista-previa-imagen" />
        </div>
      )}

      <div className="d-flex gap-2 align-items-center flex-wrap">
        <Form.Control
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleArchivo}
          disabled={subiendo}
          className="entrada-archivo"
        />
        {imagenUrl && (
          <Button variant="outline-danger" size="sm" onClick={quitar} disabled={subiendo}>
            Quitar foto
          </Button>
        )}
      </div>
      {subiendo && <div className="texto-suave mt-1">Subiendo imagen...</div>}
    </Form.Group>
  );
};

export default SubirImagen;
