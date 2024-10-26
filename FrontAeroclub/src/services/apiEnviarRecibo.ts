import Swal from "sweetalert2";
import { client } from "./api-backend";
const getTokenLocal = await localStorage.getItem("token");

export const apiEnviarRecibo =  {
    // Enviar recibo al email del gestor
  get: async function (nroRecibo: number) {
    const response = await client.request({
      url: `/recibo-pdf/${nroRecibo}`,
      method: "GET",
      headers: {
        Authorization: "bearer " + getTokenLocal,
        "content-type": "application/json",
      },
    });

    if (response.data.success) {
        // console.log(response.data);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Recibo enviado satisfactoriamente.",
          text: ``,
          showConfirmButton: false,
          timer: 2500,
        });
        return response.data;
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error al enviar el recibo.",
          text: `${response.data.mensaje}`,
          showConfirmButton: false,
          timer: 2500,
        });
      }
  },
};

