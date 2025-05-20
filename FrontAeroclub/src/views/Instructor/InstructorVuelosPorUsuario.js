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
            console.log("vuelos: ",vuelosResponse)
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
        setLoading(false); // Cambia el estado de carga
        };

        fetchData();
    }, [idUsuario]);
    
    // Para manejo de dialog de vista de detalles
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState(null);
    
    const handleViewDetails = (rowData) => {
      setSelectedFlight(rowData);
      setDialogVisible(true);
    };
    
    const actionTemplate = (rowData) => {
      return (
        <Tooltip title="Ver detalles del vuelo">
          <IconButton color="primary" onClick={() => handleViewDetails(rowData)}>
            <SearchIcon />
          </IconButton>
        </Tooltip>
      );
    };

    // Formatear fecha a DD/MM/AAAA
    const formatearFecha = (fecha) => {
      const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
      const fechaCorregida = new Date(fecha + "T00:00:00"); // Asegurar que se tome en la zona horaria local
      return fechaCorregida.toLocaleDateString('es-ES', opciones).replace(/\//g, '/');
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
        <Column body={actionTemplate} header="Acciones" style={{ width: '80px' }} />
      </DataTable>

      <Dialog 
              header="Detalles del Vuelo" 
              visible={dialogVisible} 
              style={{ width: '500px' }} 
              onHide={() => setDialogVisible(false)}
              className="flight-details-dialog"
            >
              {selectedFlight && (
                <div className="flight-details-container">
                  <div className="flight-details-header">
                    <div className="flight-date-container">
                      <span className="detail-label">Fecha del vuelo: </span>
                      <span className="flight-date">{formatearFecha(selectedFlight.fecha)}</span>
                    </div>
                    
                    <div className="flight-route">
                      <div className="route-point">
                        <span className="point-label">Origen</span>
                        <span className="point-value">{selectedFlight.origen}</span>
                      </div>
                      <span className="route-arrow">→</span>
                      <div className="route-point">
                        <span className="point-label">Destino</span>
                        <span className="point-value">{selectedFlight.destino}</span>
                      </div>
                    </div>
      
                    <div className="aircraft-info">
                      <span className="detail-label">Aeronave</span>
                      <span className="aircraft-value">{selectedFlight.matricula}</span>
                    </div>
                  </div>
      
                  <div className="flight-details-grid">
                    <div className="detail-card">
                      <span className="detail-label">Hora Salida</span>
                      <span className="detail-value">{selectedFlight.hora_salida}</span>
                    </div>
                    <div className="detail-card">
                      <span className="detail-label">Hora Llegada</span>
                      <span className="detail-value">{selectedFlight.hora_llegada}</span>
                    </div>
                    <div className="detail-card">
                      <span className="detail-label">Tiempo de Vuelo</span>
                      <span className="detail-value">{selectedFlight.tiempo_vuelo}</span>
                    </div>
                    <div className="detail-card">
                      <span className="detail-label">Finalidad</span>
                      <span className="detail-value">{selectedFlight.finalidad}</span>
                    </div>
                    <div className="detail-card">
                      <span className="detail-label">Instrucción</span>
                      <span className="detail-value">{selectedFlight.instruccion}</span>
                    </div>
                    <div className="detail-card">
                      <span className="detail-label">Aterrizajes</span>
                      <span className="detail-value">{selectedFlight.aterrizajes || "0"}</span>
                    </div>
                  </div>
                </div>
              )}
            </Dialog>

      </div>
    );
}

export default InstructorVuelosPorUsuario;