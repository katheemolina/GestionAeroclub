import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog'
import { Card } from 'primereact/card';
import PantallaCarga from '../../components/PantallaCarga';
import { obtenerAeronaves} from '../../services/aeronavesApi'; 
import '../../styles/datatable-style.css';
import './Styles/GestorAeronaves.css';
//iconos
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search'; 
import Tooltip from '@mui/material/Tooltip';



const AeronaveCrud = () => {
    const [aeronaves, setAeronaves] = useState([]);
    const [loading, setLoading] = useState(true);

    

    // Fetch aeronaves data from the API
    const fetchAeronaves = async () => {
        try {
            const data = await obtenerAeronaves(); 
            setAeronaves(data);
        } catch (error) {
            console.error('Error fetching aeronaves:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAeronaves();
    }, []);

    
    
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

    const formatFecha = (fecha) => {
        if (!fecha) return ''; // Manejar valores nulos o vacíos
        const date = new Date(fecha); // Asegúrate de que sea un objeto Date
        return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
      };

    if (loading) {
        return <PantallaCarga />
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
                <Column 
                    header="Aeronave" 
                    body={(rowData) => (
                        <>
                            <strong>{rowData.marca}</strong>  {rowData.modelo}
                        </>
                    )}
                />
                <Column field="matricula" header="Matrícula"></Column>
                <Column
                field="intervalo_para_inspeccion"
                header="Inspección"
                body={(rowData) => `${parseInt(rowData.intervalo_para_inspeccion)} hs.`}
                />
                <Column
                field="ultimo_servicio"
                header="Último servicio"
                body={(rowData) => formatFecha(rowData.ultimo_servicio)}
                ></Column>
                <Column field="numero_poliza" header="Nro. Póliza" ></Column>
                <Column
                    field="vencimiento_poliza"
                    header="Vto. Póliza"
                    body={(rowData) => formatFecha(rowData.vencimiento_poliza)}
                    ></Column>
                <Column field="estado" header="Estado"></Column>
                <Column header="Acciones" 
                    style={{width: '1px'}}
                    body={(rowData) => (
                    <div className='acciones'>
                        
                        <Tooltip title="Ver detalles">
                        <IconButton color="primary" aria-label="view-details" onClick={() => openDialog(rowData)}>
                            <SearchIcon />
                        </IconButton>
                        </Tooltip>


                    </div>
                )}></Column>
            </DataTable>



            <Dialog header="Detalles de la Aeronave" visible={dialogVisible} style={{ width: '400px' }} onHide={closeDialog}>
                {selectedRowData && (
                <div>
                    <div className='p-fluid details-dialog'>
                        
                        <Card>
                            <p><strong>Marca:</strong> {selectedRowData.marca}</p>
                            <p><strong>Modelo:</strong> {selectedRowData.modelo}</p>
                            <p><strong>Matrícula:</strong> {selectedRowData.matricula}</p>
                        </Card>
                        <Card> 
                            <p><strong>Potencia:</strong> {selectedRowData.potencia} HP</p> 
                            <p><strong>Motor:</strong> {selectedRowData.motor} </p> 
                            <p><strong>Consumo:</strong> {selectedRowData.consumo_por_hora} L/hs</p>
                            <p><strong>Fecha de adquisición:</strong> {selectedRowData.fecha_adquisicion}</p>
                            <p><strong>Horas de vuelo historicas:</strong> {selectedRowData.horas_historicas}</p>

                        </Card>
                        
                        <Card> 
                            <p><strong>Intervalo para inspección:</strong> {selectedRowData.intervalo_para_inspeccion}</p>
                            <p><strong>Último service:</strong> {selectedRowData.ultimo_servicio}</p>
                        </Card>
                        
                        <Card> 
                            <p><strong>Aseguradora:</strong> {selectedRowData.aseguradora}</p>
                            <p><strong>Número póliza:</strong> {selectedRowData.numero_poliza}</p>
                            <p><strong>Vencimiento póliza:</strong> {selectedRowData.vencimiento_poliza}</p>
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

export default AeronaveCrud;
