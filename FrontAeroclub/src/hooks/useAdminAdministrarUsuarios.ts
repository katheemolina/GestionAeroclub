import { useState } from "react";
import { Usuarios } from "../types";

export function useAdminAdministrarUsuarios() {
  //aca tiene que llamar a la api para que te traiga el user
  //el id lo vamos a obtener de un state global
  const usuario: Usuarios = {
    nombre: "Juan",
    apellido: "García",
    nombreCompleto: "García Juan",
    email: "juan.perez@example.com",
    telefono: 5551234567,
    dni: 123456789,
    fechaAlta: "2023-10-30",
    fechaBaja: "N/A",
    direccion: "Calle Principal 123",
    fotoPerfil: "perfil1.jpg",
  };

  return {
    usuario,
  };
}
