/*
funcion q devuelve los datos del usuario decodificados obtenidos mediante el clientId
por ejemplo para mostrar su nombre
*/
export default function ObtenerDatosPostLogin(token) {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token format");
    }
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    return { header, payload };
  }