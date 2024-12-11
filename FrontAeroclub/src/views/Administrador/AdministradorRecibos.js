import React, { useEffect, useRef, useState } from "react";
import { obtenerTodosLosRecibos } from "../../services/recibosApi";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "../../styles/datatable-style.css"; // Estilado para la tabla
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import PantallaCarga from "../../components/PantallaCarga";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dropdown } from 'primereact/dropdown'; 
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';



function AdministradorRecibos({ idUsuario = 0 }) {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtroEstado, setFiltroEstado] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recibosResponse = await obtenerTodosLosRecibos(idUsuario);
        setData(recibosResponse);
        //console.log(recibosResponse)
      } catch (error) {
        //console.error("Error al obtener datos:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [idUsuario]);
 
  const estados = [
    { label: 'Pago', value: 'Pago' },
    { label: 'Impago', value: 'Impago' },
    { label: 'Seleccione estado', value: ' ' }
  ];
  const onEstadoChange = (e, options) => {
    setFiltroEstado(e.value);
    options.filterApplyCallback(e.value); // Aplica el filtro
  };

  
  const plantillaFecha = (rowData) => {
    const fecha = new Date(rowData.fecha);
    const formatoFecha = fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    });
    const formatoHora = fecha.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    return `${formatoFecha} ${formatoHora}`;
  };

  const estadoPagoTemplate = (rowData) => (
    <span
      style={{
        fontWeight: "bold",
        color: rowData.estado === "Pago" ? "rgb(76, 175, 80)" : "rgb(169, 70, 70)",
      }}
    >
      {rowData.estado}
    </span>
  );

  const dt = useRef(null);
    const clearFilters = () => {
      if (dt.current) {
        dt.current.reset(); // Limpia los filtros de la tabla
      }
      setFiltroEstado('');
    };

  if (loading) {
    return <PantallaCarga />;
  }
  return (
    <div className="background">
      <ToastContainer />
      <header className="header">
        <h1>Recibos</h1>
      </header>
      <DataTable
      ref={dt}
        value={data}
        paginator
        rows={15}
        rowsPerPageOptions={[10, 15, 25, 50]}
        removableSort
        filterDisplay="row"
        scrollable
        scrollHeight="800px"
        sortField="numero_recibo"
        sortOrder={-1}
      >
        
        <Column
          field="fecha"
          header="Fecha"
          sortable
          filter
          filterPlaceholder="Buscar por fecha"
          filterMatchMode="contains"
          filterType='date' 
          showFilterMenu={false}
          className="columna-ancho-min"
          body={plantillaFecha}
        />
        <Column
          field="usuario"
          header="Asociado"
          sortable
          filter
          filterPlaceholder="Buscar por asociado"
          filterMatchMode="contains"
          showFilterMenu={false}
          className="columna-ancho-min"
        />
        <Column
          field="numero_recibo"
          header="N° Recibo"
          sortable
          filter
          filterPlaceholder="Buscar por número"
          filterMatchMode="contains"
          showFilterMenu={false}
          className="columna-ancho-min"
        />
        <Column
          field="tipo_recibo"
          header="Tipo de recibo"
          sortable
          filter
          filterPlaceholder="Buscar por tipo"
          filterMatchMode="contains"
          showFilterMenu={false}
          className="columna-ancho-min"
        />
        <Column
      field="estado"
      header="Estado"
      sortable
      filter
      style={{width: '150px'}}
      filterField="estado"
      showFilterMenu={false}
      body={estadoPagoTemplate}
      filterElement={(options) => (
        <Dropdown
          value={filtroEstado}
          options={estados}
          onChange={(e) => onEstadoChange(e, options)}
          placeholder="Seleccione estado"
          className="p-column-filter"
          style={{ width: '100%', height: '40px',  padding: '10px'}}
        />
      )}
      
      
      className="columna-ancho-min"
    />
        <Column
          field="importe_total"
          header="Importe"
          sortable
          filter
          filterPlaceholder="Buscar por importe"
          filterMatchMode="contains"
          showFilterMenu={false}
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
          body={(rowData) => (
            <IconButton
              
              color="primary"
              title="Ver Recibo"
            >
              <DeleteIcon />
            </IconButton>
          )}
          header="Acciones"
          className="columna-ancho-min"
        />
      </DataTable>

    </div>
    
  );
}

export default AdministradorRecibos;