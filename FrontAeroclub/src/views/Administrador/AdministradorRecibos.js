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
   const [estadoFiltro, setEstadoFiltro] = useState(null);

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

const dt = useRef(null);
    const clearFilters = () => {
        if (dt.current) {
        dt.current.reset(); // Limpia los filtros de la tabla
    }
    setEstadoFiltro('');
    }


    const plantillaFecha = (rowData) => {
      return formatearFecha(rowData.fecha);
    };

    const formatearFecha = (fecha) => {
      const date = new Date(fecha);
      const dia = String(date.getDate()).padStart(2, '0');
      const mes = String(date.getMonth() + 1).padStart(2, '0');
      const año = date.getFullYear();
      const horas = String(date.getHours()).padStart(2, '0');
      const minutos = String(date.getMinutes()).padStart(2, '0');
      const segundos = String(date.getSeconds()).padStart(2, '0');
      return `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;
    };


    const OpcionesEstados = [
      { label: "Impago", value: "impago" },
      { label: "Pago", value: "pago" },
      { label: "Seleccione un estado", value: " "}
  ]

  const onEstadoChange = (e, options) => {
      setEstadoFiltro(e.value);
      options.filterApplyCallback(e.value); // Aplica el filtro
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

      <DataTable value={data} paginator rows={15} scrollable scrollHeight="800px" filterDisplay="row" ref={dt}>
        <Column filter sorteable showFilterMenu={false} filterType='date' body={plantillaFecha} filterPlaceholder='Buscar por Fecha' field="fecha" header="Fecha" sortable className="columna-ancho-min" />
        <Column filter filterMatchMode='contains' sorteable showFilterMenu={false} filterPlaceholder='Buscar por Asociado' field="usuario" header="Asociado" sortable className="columna-ancho-min" />
        <Column filter filterMatchMode='contains' sorteable showFilterMenu={false} filterPlaceholder='Buscar por Recibo' field="numero_recibo" header="N° Recibo" sortable className="columna-ancho-min" />
        <Column filter sorteable showFilterMenu={false} filterPlaceholder='Buscar por Tipo' field="tipo_recibo" header="Tipo de recibo" sortable className="columna-ancho-min" />
        <Column
          filter
          sorteable showFilterMenu={false}
          filterPlaceholder='Buscar por Estado'
          filterElement={(options) => (
                              <Dropdown value={estadoFiltro} options={OpcionesEstados} onChange={(e) => onEstadoChange(e, options)} placeholder="Seleccione un estado" 
                                  style={{ width: '100%', height: '40px',  padding: '10px'}}/>)}
          field="estado"
          header="Estado"
          sortable
          className="columna-ancho-min"

          
        />
        <Column
          filter
          sorteable showFilterMenu={false}
          filterPlaceholder='Buscar por Importe'
          field="importe_total"
          header="Importe"
          sortable
          className="columna-ancho-min"
          body={(rowData) => `$ ${rowData.importe_total}`}
        />
        <Column
          filter
          showFilterMenu={false}
           filterElement={
                                  <Button
                                  label="Limpiar"
                                  onClick={clearFilters}
                                  style={{ width: '100%', height: '40px',  padding: '10px'}}
                                  />
                                  } 
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
