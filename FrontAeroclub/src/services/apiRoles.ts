import { client } from "./api-backend.ts";
const getTokenLocal = localStorage.getItem("token");

export const apiRoles = {

  
  // Se obtienen todos los roles
  get: async function (email: any) {
    const response = await client.request({
      url: `roles/${email}`,
      method: "GET",
      headers: {
        Authorization: "bearer " + getTokenLocal,
        "content-type": "application/json",
      },
    });
    if (response) {
      // console.log(response.data);
      return response.data.roles;
    }
  },
  // Cargar rol
  post: async function (datos: any) {
    const response = await client.request({
      url: `/roles`,
      method: "POST",
      headers: {
        Authorization: "bearer " + getTokenLocal,
        "content-type": "application/json",
      },
      data: {
        email: datos.email,
        rol: datos.rol,
      },
    });

    if (response) {
      // console.log(response.data);
      return response.data;
    }
  },

  // Quitar rol
  delete: async function (datos: any) {
    const response = await client.request({
      url: `/roles`,
      method: "DELETE",
      headers: {
        Authorization: "bearer " + getTokenLocal,
        "content-type": "application/json",
      },
      data: {
        email: datos.email,
        rol: datos.rol,
      },
    });

    if (response) {
      // console.log(response.data);
      return response.data;
    }
  },
};
