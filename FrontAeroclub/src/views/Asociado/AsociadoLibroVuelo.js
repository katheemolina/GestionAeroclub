import React, { useEffect, useState, useRef } from 'react';
import "./Styles/AsociadoLibroVuelo.css";
import { obtenerLibroDeVueloPorUsuario } from '../../services/vuelosApi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown'; // Para los filtros de Dropdown
import { useUser } from '../../context/UserContext';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PantallaCarga from '../../components/PantallaCarga';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { toast } from 'react-toastify';
import { Button } from 'primereact/button';

function AsociadoLibroVuelo() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { usuarioId } = useUser();

  // Opciones de filtros
  const [aeronaves, setAeronaves] = useState([]);
  const [instruccionFiltro, setInstruccionFiltro] = useState(null);
  const [aeronaveFiltro, setAeronaveFiltro] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vuelosResponse = await obtenerLibroDeVueloPorUsuario(usuarioId);
        setData(vuelosResponse);

        // Extraer opciones únicas para aeronaves
        const matriculasUnicas = [...new Set(vuelosResponse.map((vuelo) => vuelo.matricula))];
        setAeronaves([
          { label: 'Seleccione una Aeronave', value: ' ' }, // Ítem adicional
          ...matriculasUnicas.map((matricula) => ({ label: matricula, value: matricula }))
        ]);
        
      } catch (error) {
        toast.error("Error al obtener datos:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [usuarioId]);

  // Para manejo del diálogo
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const openDialog = (rowData) => {
    setSelectedRowData(rowData);
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
  };

  const formatearFecha = (fecha) => {
    const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

  // Para mostrar la fecha 
  const plantillaFecha = (rowData) => {
    return formatearFecha(rowData.fecha);
  };

  //Eventos para Filtros
  const onInstruccionChange = (e, options) => {
    setInstruccionFiltro(e.value);
    options.filterApplyCallback(e.value); // Aplica el filtro
  };

  const onAeronaveChange = (e, options) => {
    setAeronaveFiltro(e.value);
    options.filterApplyCallback(e.value); // Aplica el filtro
  };

  const OpcionesInstruccion = [
    { label: "Sí", value: "Si" },
    { label: "No", value: "No" },
    { label: "Seleccione instrucción", value: " "}
  ]
  
    const dt = useRef(null);
    const clearFilters = () => {
      if (dt.current) {
        dt.current.reset(); // Limpia los filtros de la tabla
      }
  
      // Resetea los estados de los filtros
      setInstruccionFiltro('');
      setAeronaveFiltro('');
    };
  

  if (loading) {
    return <PantallaCarga />;
  }

  return (
    <div className="background">
      <div className="titulo-btn">
        <header className="header">
          <h1>Libro de Vuelo</h1>
        </header>
      </div>
      
      <DataTable
        ref={dt}
        value={data}
        paginator
        rows={15}
        rowsPerPageOptions={[10, 15, 25, 50]}
        scrollable
        scrollHeight="800px"
        filterDisplay="row"
        
      >
      <Column
        field="fecha" 
        header="Fecha" 
        sortable 
        filter 
        filterPlaceholder="Buscar por fecha" 
        filterMatchMode="contains" 
        dataType="date" 
        showFilterMenu={false} 
        filterType='date' 
        showClearButton={false} 
        body={plantillaFecha}
        >
        </Column>
        <Column
          field="matricula"
          header="Aeronave"
          sortable
          filter
          showFilterMenu={false}
          style={{width: '200px'}}
          filterElement={(options) => (
            <Dropdown
              value={aeronaveFiltro}
              options={aeronaves}
              onChange={(e) => onAeronaveChange(e, options)}
              placeholder="Seleccione aeronave"
              style={{ width: '100%', height: '40px',  padding: '10px'}}
            />
          )
          }
        />
        <Column field="origen" header="Origen" sortable filter filterPlaceholder="Busar por origen" filterMatchMode="contains" showFilterMenu={false} showClearButton={false} ></Column>
        <Column field="destino" header="Destino" sortable filter filterPlaceholder="Buscar por destino" filterMatchMode="contains" showFilterMenu={false} showClearButton={false} ></Column>
        <Column field="tiempo_vuelo" header="Tiempo" sortable filter filterPlaceholder="Buscar por tiempo" filterMatchMode="contains" showFilterMenu={false} showClearButton={false} ></Column>
        
        <Column
      field="instruccion"
      header="Instrucción"
      style={{ width: '150px' }}
      sortable
      filter
      showAddButton={false}
      filterField="instruccion"
      showFilterMenu={false}
      filterElement={(options) => (
        <Dropdown
          value={instruccionFiltro}
          options={OpcionesInstruccion}
          onChange={(e) => onInstruccionChange(e, options)}
          placeholder="Seleccione instrucción"
          style={{ width: '100%', height: '40px',  padding: '10px'}}
        />
      )
    }
      />
        <Column
          header={"Acciones"}
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
            <div className="acciones">
              <Tooltip title="Ver detalles">
                <IconButton
                  color="primary"
                  aria-label="view-details"
                  onClick={() => openDialog(rowData)}
                >
                  <SearchIcon />
                </IconButton>
              </Tooltip>
            </div>
          )}
        />
      </DataTable>

      <Dialog header="Detalles del Vuelo" visible={dialogVisible} style={{ width: '400px' }} onHide={closeDialog}>
        {selectedRowData && (
          <div>
            <div className="p-fluid details-dialog">
              <Card><p><strong>Fecha:</strong> {selectedRowData.fecha}</p></Card>
              <Card><p><strong>Aeronave:</strong> {selectedRowData.matricula}</p></Card>
              <Card><p><strong>Origen:</strong> {selectedRowData.origen}</p></Card>
              <Card><p><strong>Destino:</strong> {selectedRowData.destino}</p></Card>
              <Card><p><strong>Hora de salida:</strong> {selectedRowData.hora_salida}</p></Card>
              <Card><p><strong>Hora de llegada:</strong> {selectedRowData.hora_llegada}</p></Card>
              <Card><p><strong>Tiempo de vuelo:</strong> {selectedRowData.tiempo_vuelo}</p></Card>
              <Card><p><strong>Finalidad:</strong> {selectedRowData.finalidad}</p></Card>
              <Card><p><strong>Instrucción:</strong> {selectedRowData.instruccion}</p></Card>
              <Card><p><strong>Aterrizajes:</strong> {selectedRowData.aterrizajes}</p></Card>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default AsociadoLibroVuelo;
