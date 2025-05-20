import React, { useEffect, useRef, useState } from 'react';
import { obtenerTodosLosItinerarios } from '../../services/vuelosApi';
import './Styles/GestorVuelos.css'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import PantallaCarga from '../../components/PantallaCarga';

import SearchIcon from '@mui/icons-material/Search'; //icono de detalles
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

function GestorVuelos(){
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
        try {
            // Obtener vuelos
            const vuelosResponse = await obtenerTodosLosItinerarios();
            //console.log("Vuelos:", vuelosResponse)
            setData(vuelosResponse);
            
        } catch (error) {
            //console.error("Error al obtener datos:", error);
        }
        setLoading(false); // Cambia el estado de carga
        };

        fetchData();
    }, []);
    
    // Para manejo de dialog de vista de detalles
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    
    const openDialog = (rowData) => {
        setSelectedRowData(rowData);
        setDialogVisible(true);
        //console.log(rowData)
    };
    
    const closeDialog = () => {
        setDialogVisible(false);
    };

    // Formatear fecha a DD/MM/AAAA
    const formatearFecha = (fecha) => {
        const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const fechaCorregida = new Date(fecha + "T00:00:00"); // Asegurar que se tome en la zona horaria local
        return fechaCorregida.toLocaleDateString('es-ES', opciones);
    };

    // Plantilla para mostrar la fecha 
    const plantillaFecha = (rowData) => {
        return formatearFecha(rowData.fecha);
    };


    const dt = useRef(null);
    const clearFilters = () => {
      if (dt.current) {
        dt.current.reset(); // Limpia los filtros de la tabla
      }
      
    };

    if (loading) {
        return <PantallaCarga/>
    }
    return (
    <div className="background">
        <header className="header">
            <h1>Vuelos</h1>
        </header>
        <DataTable 
        ref={dt}
            value={data} 
            paginator rows={15} 
            rowsPerPageOptions={[10, 15, 25, 50]} 
            removableSort 
            filterDisplay="row"
            scrollable
            scrollHeight="800px"
            >
            <Column field="fecha" header="Fecha" sortable filter filterPlaceholder="Buscar por fecha"  filterMatchMode="contains"  filterType='date' showFilterMenu={false} body={plantillaFecha}  ></Column>
            <Column field="matricula" header="Aeronave" sortable filter filterPlaceholder="Busar por aeronave" filterMatchMode="contains" showFilterMenu={false}  ></Column>
            <Column field="usuario" header="Asociado" sortable filter filterPlaceholder="Buscar por Asociado" filterMatchMode="contains" showFilterMenu={false}  ></Column>
            <Column field="origen" header="Origen" sortable filter filterPlaceholder="Busar por origen" filterMatchMode="contains" showFilterMenu={false}  ></Column>
            <Column field="destino" header="Destino" sortable filter filterPlaceholder="Buscar por destino" filterMatchMode="contains" showFilterMenu={false}  ></Column>
            <Column field="tiempo_vuelo" header="Tiempo de vuelo" sortable filter filterPlaceholder="Buscar por tiempo de vuelo" filterMatchMode="contains" showFilterMenu={false}
            body={(rowData) => `${rowData.tiempo_vuelo} hs`}   ></Column>
            <Column field="instruccion" header="Instrucción" sortable filter filterPlaceholder="Buscar por instruccion" filterMatchMode="contains" showFilterMenu={false}  ></Column>
            <Column header="Acciones"
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

        <Dialog 
          header="Detalles del Vuelo" 
          visible={dialogVisible} 
          style={{ width: '500px' }} 
          onHide={closeDialog}
          className="flight-details-dialog"
        >
          {selectedRowData && (
            <div className="flight-details-container">
              <div className="flight-details-header">
                <div className="flight-info-main">
                  <div className="user-info">
                    <span className="detail-label">Asociado</span>
                    <h3>{selectedRowData.usuario}</h3>
                  </div>
                  <span className="flight-date">{formatearFecha(selectedRowData.fecha)}</span>
                </div>
                <div className="flight-route">
                  <div className="route-point">
                    <span className="point-label">Origen</span>
                    <span className="point-value">{selectedRowData.origen}</span>
                  </div>
                  <div className="route-arrow">→</div>
                  <div className="route-point">
                    <span className="point-label">Destino</span>
                    <span className="point-value">{selectedRowData.destino}</span>
                  </div>
                </div>
                <div className="aircraft-info">
                  <span className="detail-label">Aeronave</span>
                  <span className="aircraft-value">{selectedRowData.matricula}</span>
                </div>
              </div>

              <div className="flight-details-grid">
                <div className="detail-card">
                  <span className="detail-label">Hora Salida</span>
                  <span className="detail-value">{selectedRowData.hora_salida}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Hora Llegada</span>
                  <span className="detail-value">{selectedRowData.hora_llegada}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Tiempo de Vuelo</span>
                  <span className="detail-value">{selectedRowData.tiempo_vuelo}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Finalidad</span>
                  <span className="detail-value">{selectedRowData.finalidad}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Instrucción</span>
                  <span className="detail-value">{selectedRowData.instruccion}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Aterrizajes</span>
                  <span className="detail-value">{selectedRowData.aterrizajes || "0"}</span>
                </div>
              </div>
            </div>
          )}
        </Dialog>

    </div>

    
    );
}

export default GestorVuelos;