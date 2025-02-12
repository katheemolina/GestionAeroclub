import React, { useEffect, useRef, useState } from "react";
import { obtenerTodosLosRecibos, anularRecibo } from "../../services/recibosApi";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "../../styles/datatable-style.css";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdministradorRecibos({ idUsuario = 0 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recibosResponse = await obtenerTodosLosRecibos(idUsuario);
        const recibosImpagos = recibosResponse.filter(
          (recibo) => recibo.estado === "Impago"
        );
        setData(recibosImpagos);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [idUsuario]);

  const handleAnularRecibo = async (idRecibo) => {
    const result = await anularRecibo(idRecibo);
    //console.log("Respuesta del backend:", result); // Para depuración

    if (result.status === "success") { // Cambiado de `success` a `status`
        toast.success("Recibo anulado correctamente.");
        setData((prevData) =>
            prevData.filter((recibo) => recibo.numero_recibo !== idRecibo)
        );
    } else {
        toast.error("No se pudo anular el recibo.");
    }
};


  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="background">
      <ToastContainer />
      <header className="header">
        <h1>Recibos</h1>
      </header>

      <DataTable value={data} paginator rows={15} scrollable scrollHeight="800px">
        <Column field="fecha" header="Fecha" sortable className="columna-ancho-min" />
        <Column field="usuario" header="Asociado" sortable className="columna-ancho-min" />
        <Column field="numero_recibo" header="N° Recibo" sortable className="columna-ancho-min" />
        <Column field="tipo_recibo" header="Tipo de recibo" sortable className="columna-ancho-min" />
        <Column
          field="estado"
          header="Estado"
          sortable
          className="columna-ancho-min"

          
        />
        <Column
          field="importe_total"
          header="Importe"
          sortable
          className="columna-ancho-min"
          body={(rowData) => `$ ${rowData.importe_total}`}
        />
        <Column
          header="Acciones"
          className="columna-ancho-min"
          body={(rowData) => (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <IconButton
              color="primary"
              title="Eliminar recibo"
              onClick={() => handleAnularRecibo(rowData.numero_recibo)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
            
          )}
        />
      </DataTable>
    </div>
  );
}

export default AdministradorRecibos;
