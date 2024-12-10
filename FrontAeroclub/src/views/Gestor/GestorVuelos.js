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
        return new Date(fecha).toLocaleDateString('es-ES', opciones);
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
            <Column field="fecha" header="Fecha" sortable filter filterPlaceholder="Buscar por fecha"  filterMatchMode="contains" dataType="date" filterType='date' showFilterMenu={false} body={plantillaFecha}  ></Column>
            <Column field="matricula" header="Aeronave" sortable filter filterPlaceholder="Busar por aeronave" filterMatchMode="contains" showFilterMenu={false}  ></Column>
            <Column field="usuario" header="Asociado" sortable filter filterPlaceholder="Buscar por usuario" filterMatchMode="contains" showFilterMenu={false}  ></Column>
            <Column field="origen" header="Origen" sortable filter filterPlaceholder="Busar por usuario" filterMatchMode="contains" showFilterMenu={false}  ></Column>
            <Column field="destino" header="Destino" sortable filter filterPlaceholder="Buscar por número" filterMatchMode="contains" showFilterMenu={false}  ></Column>
            <Column field="tiempo_vuelo" header="Tiempo" sortable filter filterPlaceholder="Buscar por tiempo de vuelo" filterMatchMode="contains" showFilterMenu={false}  ></Column>
            <Column field="instruccion" header="Instruccion" sortable filter filterPlaceholder="Buscar por instruccion" filterMatchMode="contains" showFilterMenu={false}  ></Column>
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

        <Dialog header="Detalles del Vuelo" visible={dialogVisible} style={{ width: '400px' }} onHide={closeDialog}>
                {selectedRowData && (
                <div>
                    <div className='p-fluid details-dialog'>
                        <Card> <p><strong>Fecha:</strong> {selectedRowData.fecha}</p> </Card>
                        <Card> <p><strong>Aeronave:</strong> {selectedRowData.matricula}</p> </Card>
                        <Card> <p><strong>Asociado:</strong> {selectedRowData.usuario}</p> </Card>
                        <Card><p><strong>Origen:</strong> {selectedRowData.origen}</p> </Card>
                        <Card> <p><strong>Destino:</strong> {selectedRowData.destino}</p> </Card>
                        <Card> <p><strong>Hora de salida:</strong> {selectedRowData.hora_salida}</p> </Card>
                        <Card> <p><strong>Hora de llegada:</strong> {selectedRowData.hora_llegada}</p> </Card>
                        <Card><p><strong>Tiempo de vuelo:</strong> {selectedRowData.tiempo_vuelo}</p> </Card>
                        <Card> <p><strong>Finalidad:</strong> {selectedRowData.finalidad}</p> </Card>
                        <Card> <p><strong>Instrucción:</strong> {selectedRowData.instruccion}</p> </Card>
                        <Card> <p><strong>Cantidad de aterrizajes:</strong> {selectedRowData.aterrizajes}</p> </Card> 
                    </div>
                </div>
                )}
            </Dialog>

    </div>

    
    );
}

export default GestorVuelos;