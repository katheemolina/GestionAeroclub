import React, { useEffect, useState } from 'react';
import "./Styles/AsociadoLibroVuelo.css";
import { obtenerLibroDeVueloPorUsuario, totalesHorasVueloPorUsuario } from '../../services/vuelosApi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useUser } from '../../context/UserContext';
import PantallaCarga from '../../components/PantallaCarga';
import { toast } from 'react-toastify';
import KpiBox from '../../components/KpiBox';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';

function AsociadoLibroVuelo() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { usuarioId } = useUser();
  const [kpiData, setKpiData] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  // Formatear fecha a DD/MM/AAAA
  const formatearFecha = (fecha) => {
    const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const fechaCorregida = new Date(fecha + "T00:00:00"); // Asegurar que se tome en la zona horaria local
    return fechaCorregida.toLocaleDateString('es-ES', opciones).replace(/\//g, '/');
  };

  // Plantilla para mostrar la fecha 
  const plantillaFecha = (rowData) => {
    return formatearFecha(rowData.fecha);
  };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vuelosResponse = await obtenerLibroDeVueloPorUsuario(usuarioId);
        setData(vuelosResponse);
        console.log("Vuelos por usuario: ",vuelosResponse)

        const kpiResponse = await totalesHorasVueloPorUsuario(usuarioId);
        if (kpiResponse && kpiResponse.length > 0) {
          const primerElemento = kpiResponse[0];
          setKpiData([
            { title: 'Total tiempo de vuelo', value: primerElemento.total_horas_voladas },
            { title: 'Tiempo histórico', value: primerElemento.horas_historicas },
            { title: 'Último mes', value: primerElemento.horas_voladas_ultimo_mes },
            ...kpiResponse.map(item => ({
              title: `Volado en ${item.matricula}`,
              value: `${item.tiempo}`
            }))
          ]);
        }
        
      } catch (error) {
        toast.error("Error al obtener datos: " + error);
      }
      setLoading(false);
    };
    
    fetchData();
  }, [usuarioId]);

  if (loading) {
    return <PantallaCarga />;
  }

  return (
    <div className="background">
      <header className="header">
        <h1>Libro de Vuelo</h1>
      </header>
      <KpiBox data={kpiData} />
      <DataTable value={data} paginator rows={15} scrollable scrollHeight="800px">
        <Column field="fecha" header="Fecha" sortable body={plantillaFecha}/>
        <Column field="matricula" header="Aeronave" sortable />
        <Column field="origen" header="Origen" sortable />
        <Column field="destino" header="Destino" sortable />
        <Column field="tiempo_vuelo" header="Tiempo de vuelo" sortable filter filterPlaceholder="Buscar por tiempo de vuelo" filterMatchMode="contains" showFilterMenu={false}
                    body={(rowData) => `${rowData.tiempo_vuelo} hs`}   ></Column>
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
              {/*
              <div className="detail-card">
                <span className="detail-label">Instructor</span>
                <span className="detail-value">{selectedFlight.instructor || 'No aplica'}</span>
              </div>
              */}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default AsociadoLibroVuelo;
