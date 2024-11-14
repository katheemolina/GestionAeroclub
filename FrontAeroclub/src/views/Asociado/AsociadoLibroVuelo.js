import React, { useEffect, useState } from 'react';
import "./Styles/AsociadoLibroVuelo.css"
import { obtenerLibroDeVueloPorUsuario } from '../../services/vuelosApi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useUser } from '../../context/UserContext';
import SearchIcon from '@mui/icons-material/Search'; //icono de detalles
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PantallaCarga from '../../components/PantallaCarga';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';

        
function AsociadoLibroVuelo() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { usuarioId } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener vuelos
        const vuelosResponse = await obtenerLibroDeVueloPorUsuario(usuarioId);
        setData(vuelosResponse); // Suponiendo que los datos son directamente utilizables

      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
      setLoading(false); // Cambia el estado de carga
    };

    fetchData();
  }, [usuarioId]);

  // Para manejo de dialog de vista de detalles
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  
  const openDialog = (rowData) => {
      setSelectedRowData(rowData);
      setDialogVisible(true);
  };
  
  const closeDialog = () => {
      setDialogVisible(false);
  };

  if (loading) {
    return <PantallaCarga/>
  }
  return (
    <div className="background">
      <div className="titulo-btn">
        <header className="header">
          <h1>Libro de Vuelo</h1>
        </header>
      </div>
      <DataTable 
        value={data} 
        paginator rows={15} 
        rowsPerPageOptions={[10, 15, 25, 50]} 
        filterDisplay="row"
        scrollable
        scrollHeight="800px"
        >
        <Column field="fecha" header="Fecha" sortable filter filterPlaceholder="Buscar por fecha"  filterMatchMode="contains" dataType="date" showFilterMenu={false} filterType='date' showClearButton={false} ></Column>
        <Column field="matricula" header="Aeronave" sortable filter filterPlaceholder="Buscar por aeronave" filterMatchMode="contains" showFilterMenu={false}  showClearButton={false} ></Column>
        <Column field="origen" header="Origen" sortable filter filterPlaceholder="Busar por origen" filterMatchMode="contains" showFilterMenu={false}  showClearButton={false} ></Column>
        <Column field="destino" header="Destino" sortable filter filterPlaceholder="Buscar por destino" filterMatchMode="contains" showFilterMenu={false}  showClearButton={false} ></Column> 
        {/* <Column field="hora_salida" header="Salida" sortable filter filterPlaceholder="Buscar por salida" filterMatchMode="contains" showFilterMenu={false}  showClearButton={false} ></Column> */}
        {/* <Column field="hora_llegada" header="Llegada" sortable filter filterPlaceholder="Buscar por llegada" filterMatchMode="contains" showFilterMenu={false}  showClearButton={false} ></Column>  */}
        <Column field="tiempo_vuelo" header="Tiempo" sortable filter filterPlaceholder="Buscar por tiempo" filterMatchMode="contains" showFilterMenu={false}  showClearButton={false} ></Column>
        {/* <Column field="finalidad" header="Finalidad" sortable filter filterPlaceholder="Buscar por finalidad" filterMatchMode="contains" showFilterMenu={false}  showClearButton={false} ></Column> */}
        <Column field="instruccion" header="Instruccion" sortable filter filterPlaceholder="Buscar por instrucción" filterMatchMode="contains" showFilterMenu={false}  showClearButton={false} ></Column> 
        {/* <Column field="aterrizajes" header="Aterrizajes" sortable filter filterPlaceholder="Buscar por aterrizajes" filterMatchMode="contains" showFilterMenu={false} showClearButton={false}  ></Column> */}
        <Column header="Acciones"
          body={(rowData) => (
              <div className='acciones'>

              {/* Botón de detalles */}
              <Tooltip title="Ver detalles">
              <IconButton color="primary" aria-label="view-details" onClick={() => openDialog(rowData)}>
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
                    <div className='p-fluid details-dialog'>
                        <Card><p><strong>Fecha:</strong> {selectedRowData.fecha}</p></Card>
                        <Card><p><strong>Aeronave:</strong> {selectedRowData.matricula}</p></Card>
                        <Card><p><strong>Origen:</strong> {selectedRowData.origen}</p></Card>
                        <Card><p><strong>Destino:</strong> {selectedRowData.destino}</p></Card>
                        <Card><p><strong>Hora de salida:</strong> {selectedRowData.hora_salida}</p></Card>
                        <Card><p><strong>Hora de llegada:</strong> {selectedRowData.hora_llegada}</p></Card>
                        <Card><p><strong>Tiempo de vuelo:</strong> {selectedRowData.Tiempo}</p></Card>
                        <Card><p><strong>Finalidad:</strong> {selectedRowData.finalidad}</p></Card>
                        <Card><p><strong>Instrucción:</strong> {selectedRowData.instruccion}</p></Card>
                        <Card><p><strong>Cantidad de aterrizajes:</strong> {selectedRowData.aterrizajes}</p></Card>
                    </div>
                </div>
                )}
        </Dialog>

    </div>
  );
}

export default AsociadoLibroVuelo;