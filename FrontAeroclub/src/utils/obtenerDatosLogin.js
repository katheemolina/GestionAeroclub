/*
funcion q devuelve los datos del usuario decodificados 
*/
export default function ObtenerDatosPostLogin(token) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token format");
  }

  const decodeBase64 = (str) => {
    const binary = atob(str);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder("utf-8").decode(bytes);
  };

  const header = JSON.parse(decodeBase64(parts[0]));
  const payload = JSON.parse(decodeBase64(parts[1]));
  
  return { header, payload };
}
