import Swal from "sweetalert2";
import { client } from "./api-backend.ts";
const getTokenLocal = await localStorage.getItem("token");

export const apiUsuarios = {
  // Lista completa de usuarios
  getUsuarios: async function () {
    

    const response = await client.request({
      url: `/usuarios/`,
      method: "GET",
      headers: {
        Authorization: "bearer " + getTokenLocal,
        "content-type": "application/json",
      },
    });

    if (response) {
      // console.log(response.data);
      return response.data.respuesta;
    }
  },

  // Cargar usuario
  post: async function (datos: any) {
    const response = await client.request({
      url: `/usuarios/`,
      method: "POST",
      headers: {
        Authorization: "bearer " + getTokenLocal,
        "content-type": "application/json",
      },
      data: {
        nombre: datos.nombre,
        apellido: datos.apellido,
        email: datos.email,
        telefono: datos.telefono,
        dni: datos.dni,
        fecha_alta: datos.fecha_alta,
        fecha_baja: datos.fecha_baja,
        direccion: datos.direccion,
        foto_perfil: datos.foto_perfil,
        estado_hab_des: datos.estado_hab_des,
      },
    });

    if (response) {
      // console.log(response.data);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Asociado cargado con exito.",
        text: ``,
        showConfirmButton: false,
        timer: 2500,
      });
      return response.data;
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error al cargar asociado.",
        text: ``,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  },

  // Actualizar un usuario
  patch: async function (datos: any) {
    console.log(datos);
    const response = await client.request({
      url: `/usuarios/${datos.email}`,
      method: "PATCH",
      headers: {
        Authorization: "bearer " + getTokenLocal,
        "content-type": "application/json",
      },
      data: {
        estado_hab_des: datos.estado_hab_des,
        apellido: datos.apellido,
        nombre: datos.nombre,
        telefono: datos.telefono,
        dni: datos.dni,
        direccion: datos.direccion,
        habilitado: 1
      },
    });

    if (response) {
      // console.log(response.data);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Asociado actualizado con exito.",
        text: ``,
        showConfirmButton: false,
        timer: 2500,
      });
      return response.data;
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error al actualizar asociado.",
        text: ``,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  },

  // Buscar usuario usando su email
  getUserByEmail: async function (email: string) {
    const response = await client.request({
      url: `/usuarios/${email}`,
      method: "GET",
      headers: {
        Authorization: "bearer " + getTokenLocal,
        "content-type": "application/json",
      },
    });

    if (response) {
      // console.log(response.data);
      return response.data;
    }
  },

  // Borrar un usuario usando su email
  deleteUserByEmail: async function (email: String) {
    const response = await client.request({
        url: `/usuarios/${email}`,
        method: 'DELETE',
        headers: {
          Authorization: "bearer " + getTokenLocal,
          "content-type": "application/json",
        },
    });

    if (response) {
        // console.log(response.data);
    Swal.fire({
      position: "top-end",
      icon: "success",
      title:
        "Asociado borrado con exito.(Habilitar borrado en los archivos de api)",
      text: `${email}`,
      showConfirmButton: false,
      timer: 2500,
    });
        return response.data;
    }else{
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Error al borrar.',
        text: `Vuelva a intentarlo.`,
        showConfirmButton: false,
        timer: 2500
        })
    }
  },
  getInstructores: async function () {
    const response = await client.request({
      url: `/usuarios/instructores?a`,
      method: "GET",
      headers: {
        Authorization: "bearer " + getTokenLocal,
        "content-type": "application/json",
      },
    });

    if (response) {
      console.log(response);
      return response.data;
    }
  },
  getAsociados: async function () {
    const response = await client.request({
      url: `/usuarios/asociados`,
      method: "GET",
      headers: {
        Authorization: "bearer " + getTokenLocal,
        "content-type": "application/json",
      },
    });

    if (response) {
      // console.log(response.data.respuesta);
      return response.data.respuesta;
    }
  },
  // Saber si el usuario esta habilitado
  getHabilitado: async function (email: string, token: string) {
    const response = await client.request({
      url: `/usuarios/${email}`,
      method: "GET",
      headers: {
        Authorization: "bearer " + token,
        "content-type": "application/json",
      },
    });

    if (response) {
      // console.log(response.data);
      return response.data.respuesta.estado_hab_des;
    }
  },
  // Reabilitar usuario
  rehabilitar: async function (email: string, token: string) {
    // console.log(email);
    const response = await client.request({
      url: `/usuarios/${email}`,
      method: "PATCH",
      headers: {
        Authorization: "bearer " + token,
        "content-type": "application/json",
      },
      data: {
        estado_hab_des: 1
      },
    });

    if (response) {
      // console.log(response.data);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Has rehabilitado tu usuario.",
        text: `Vuelve a logearte para acceder al sistema.`,
        showConfirmButton: false,
        timer: 2500,
      });
      return response.data;
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error al rehabilitar asociado.",
        text: ``,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  },
  
  
};
