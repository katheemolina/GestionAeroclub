import React, { useEffect, useState } from 'react';
import { obtenerTodosLosItinerarios } from '../../services/vuelosApi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search'; //icono de detalles
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PantallaCarga from '../../components/PantallaCarga';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';


function InstructorVuelosPorUsuario({idUsuario = 1}){
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const location = useLocation();  // Hook para obtener el estado de la navegación
    const { user } = location.state || {};  // Accedemos al estado pasad
    
    const [filters, setFilters] = useState({
        'usuario': { value: user.usuario, matchMode: 'contains' },
      });

    useEffect(() => {
        const fetchData = async () => {
        try {
            // Obtener vuelos
            const vuelosResponse = await obtenerTodosLosItinerarios();
            setData(vuelosResponse);
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
        setLoading(false); // Cambia el estado de carga
        };

        fetchData();
    }, [idUsuario]);
    
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

    
  const navigate = useNavigate(); // Inicializa el hook de navegación

  const handleBackClick = () => {
    navigate('/instructor/Asociados'); // Redirige a la ruta deseada
  };
    
    if (loading) {
      return <PantallaCarga/>
    }
    return (
        <div className="background">
        <header className="header">
          {/* Botón Habilitar Usuario */}
      <Tooltip title="Ver Asociados">
        <IconButton 
          color="primary" 
          aria-label="Atras" 
          className="back-button" 
          onClick={handleBackClick} // Agrega el manejador de clics
        >
          <ArrowBackIcon />
        </IconButton>
      </Tooltip>
          <h1>Vuelos</h1>
        </header>
        <DataTable 
        value={data} 
        paginator rows={15} 
        rowsPerPageOptions={[10, 15, 25, 50]} 
        removableSort 
        filters={filters}
        filterDisplay="row"
        scrollable
        scrollHeight="800px"
        >
        <Column field="fecha" header="Fecha" sortable filter filterPlaceholder="Buscar por fecha"  filterMatchMode="contains" dataType="date" showFilterMenu={false}  ></Column>
        <Column field="matricula" header="Aeronave" sortable filter filterPlaceholder="Busar por aeronave" filterMatchMode="contains" showFilterMenu={false}  ></Column>
        <Column field="usuario" header="Usuario" sortable filter value='asd' filterPlaceholder="Buscar por usuario" filterMatchMode="contains" showFilterMenu={false}  ></Column>
        <Column field="origen" header="Origen" sortable filter filterPlaceholder="Busar por usuario" filterMatchMode="contains" showFilterMenu={false}  ></Column>
        <Column field="destino" header="Destino" sortable filter filterPlaceholder="Buscar por número" filterMatchMode="contains" showFilterMenu={false}  ></Column>
        <Column field="tiempo_vuelo" header="Tiempo de vuelo" sortable filter filterPlaceholder="Buscar por tiempo de vuelo" filterMatchMode="contains" showFilterMenu={false}
                    body={(rowData) => `${rowData.tiempo_vuelo} hs`}   ></Column>
        <Column field="instruccion" header="Instruccion" sortable filter filterPlaceholder="Buscar por instruccion" filterMatchMode="contains" showFilterMenu={false}  ></Column>
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

export default InstructorVuelosPorUsuario;