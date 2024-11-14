import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { obtenerAeronaves} from '../../services/aeronavesApi'; // Cambia a las APIs de aeronaves
import '../../styles/datatable-style.css';
import './Styles/GestorAeronaves.css';
import SearchIcon from '@mui/icons-material/Search'; //icono de detalles
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PantallaCarga from '../../components/PantallaCarga';

import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';

const AsociadoAeronaves = () => {
    const [aeronaves, setAeronaves] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch aeronaves data from the API
    const fetchAeronaves = async () => {
        try {
            const data = await obtenerAeronaves(); // Asumiendo que ya es el array de aeronaves
            setAeronaves(data);
        } catch (error) {
            console.error('Error fetching aeronaves:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAeronaves();
    }, []);

    
    // Column definitions
    const consumoTemplate = (rowData) => {
        return <span>{rowData.consumo_por_hora} L/hr</span>;
    };

    const dateTemplate = (rowData) => {
        return <span>{rowData.fecha_adquisicion}</span>;
    };

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
            <header className="header">
                <h1>Aeronaves</h1>
            </header>
            <DataTable 
                value={aeronaves} 
                paginator rows={10} 
                rowsPerPageOptions={[5, 10, 25]} 
                style={{ width: '100%' }} >
                {/* <Column field="marca" header="Marca"></Column> */}
                <Column field="modelo" header="Modelo"></Column>
                <Column field="matricula" header="Matrícula"></Column>
                {/* <Column field="potencia" header="Potencia (HP)"></Column> */}
                <Column field="clase" header="Clase"></Column>
                {/* <Column field="fecha_adquisicion" header="Fecha Adquisición" body={dateTemplate}></Column> */}
                {/* <Column field="consumo_por_hora" header="Consumo por Hora" body={consumoTemplate}></Column> */}
                {/* <Column field="horas_historicas_voladas" header="Horas de vuelo" ></Column>
                <Column field="horas_para_inspeccion" header="Horas para inspeccion" ></Column> */}
                <Column field="estado" header="Estado"></Column>
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

            <Dialog header="Detalles de la Aeronave" visible={dialogVisible} style={{ width: '400px' }} onHide={closeDialog}>
                {selectedRowData && (
                <div>
                    <div className='p-fluid details-dialog'>
                        <Card>
                            <p><strong>Marca:</strong> </p>
                            <p>{selectedRowData.marca}</p>
                        </Card>
                        <Card>
                            <p><strong>Modelo:</strong> {selectedRowData.modelo}</p>
                        </Card>
                        <Card>
                            <p><strong>Matrícula:</strong> {selectedRowData.matricula}</p>
                        </Card>
                        <Card> 
                            <p><strong>Potencia en HP:</strong> {selectedRowData.potencia}</p>
                        </Card>

                        <Card> 
                            <p><strong>Fecha de adquisición:</strong> {selectedRowData.fecha_adquisicion}</p>
                        </Card>
                        
                        <Card> 
                            <p><strong>Consumo por hora:</strong> {selectedRowData.consumo_por_hora}</p>
                        </Card>

                        <Card> 
                            <p><strong>Horas de vuelo:</strong> {selectedRowData.horas_historicas_voladas}</p>
                        </Card>
                        
                        <Card> 
                            <p><strong>Horas para inspección:</strong> {selectedRowData.horas_para_inspeccion}</p>
                        </Card>
                        
                        <Card> 
                            <p><strong>Clase:</strong> {selectedRowData.clase}</p>
                        </Card>
                        
                        <Card> 
                            <p><strong>Estado:</strong> {selectedRowData.estado}</p>
                        </Card>
                          
                    </div>
                </div>
                )}
            </Dialog>
        </div>
    );
};

export default AsociadoAeronaves;