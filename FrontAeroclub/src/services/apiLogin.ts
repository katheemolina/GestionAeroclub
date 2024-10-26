import Swal from "sweetalert2";
import { client } from "./api-backend.ts";

const getTokenLocal = localStorage.getItem("token");

export const apiLogin = {
  // Lista completa de aeronaves

  get: async function () {
    const response = await client.request({
      url: `/auth/`,
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });
    if (response) {
      // console.log(response.data);
      return response.data.respuesta;
    }
  },

  // Crear usuario
  post: async function (datos: any) {
    console.log(datos);
    const response = await client.request({
      url: `/auth`,
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      data: {
        email: datos.email,
        nombre: datos.nombre,
        apellido: datos.apellido,
        telefono: datos.telefono,
        dni: datos.dni,
        direccion: datos.direccion
      },
    });
    // console.log(response.data.success);
    if (response.data.success) {
      // console.log(response.data);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title:
          "Usuario creado.",
        text: `Ya puedes acceder con el Email: ${datos.email}`,
        showConfirmButton: false,
        timer: 4500,
      });
      return response.data;
    }else{
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Error al crear usuario.',
        text: `${response.data.mensaje}`,
        showConfirmButton: false,
        timer: 4500
      })
    }
  },



  getByEmail: async function (email: string) {
    // console.log(email);
    const response = await client.request({
      url: `/auth/${email}`,
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });

    if (response) {
      // console.log(response.data);
      return response;
    }
  },
};
