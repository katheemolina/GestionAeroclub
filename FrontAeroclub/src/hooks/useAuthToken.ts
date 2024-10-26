import { useState, useEffect } from "react";
import { resolverToken } from "../api/apiCalls";
import { useRecoilState } from "recoil";
import { usuarioEnSesion } from "../atomos/atoms";

export function useAuthToken() {
  //este recoil es un estado global para transmitir el usuario con el email y roles que viene
  //del back luego de resolver el token
  const [userSesion, setUserSesion] = useRecoilState(usuarioEnSesion);

  async function decodificarToken() {
    // Simula obtener el token de algún lugar (por ejemplo, del almacenamiento local)
    const getTokenLocal = await localStorage.getItem("token");

    if (getTokenLocal) {
      // Verificar el token
      const resResolverToken = await resolverToken();

      // console.log("respuesta de resolver el token: ", resResolverToken);

      if (resResolverToken.success) {
        // console.log("este es el token:", resResolverToken.dataToken);

        setUserSesion({
          email: resResolverToken.dataToken.email,
          roles: resResolverToken.dataToken.roles,
        });
      } else {
        console.log(resResolverToken.dataToken);
      }
    }
  }

  //const [token, setToken] = useState(null);

  // Efecto para decodificar el token cuando el componente se monta
  /*
  const decodificarToken = useEffect(() => {
    decodeTokenAsync();
  }, []);*/

  return { decodificarToken };
}
