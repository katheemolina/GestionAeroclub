import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import { Card } from 'primereact/card';
import PantallaCarga from '../../components/PantallaCarga';
import { obtenerAeronaves,cambiarEstadoAeronave } from '../../services/aeronavesApi'; // Cambia a las APIs de aeronaves
import '../../styles/datatable-style.css';

//iconos
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search'; 
import Tooltip from '@mui/material/Tooltip';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { Dropdown } from 'primereact/dropdown';



const AeronaveCrud = () => {
    const [aeronaves, setAeronaves] = useState([]);


    const [loading, setLoading] = useState(true);


    const [estadoDialog, setEstadoDialog] = useState(false);


    const [selectedAeronave, setSelectedAeronave] = useState(null);


    const [EstadosFiltro, setEstadosFiltro] = useState(null);




    // Fetch aeronaves data from the API
    const fetchAeronaves = async () => {
        try {
            const data = await obtenerAeronaves(); // Asumiendo que ya es el array de aeronaves
            setAeronaves(data);
            console.log(data)
        } catch (error) {
            //console.error('Error fetching aeronaves:', error);
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


    // Funciones para manejar los diálogos
    const openEstadoDialog = (aeronave) => {
    setSelectedAeronave(aeronave);
    setEstadoDialog(true);
    };


    // Funciones para los servicios
    const handleCambiarEstado = async () => {
    try {
        if (selectedAeronave) {
            await cambiarEstadoAeronave(selectedAeronave.id_aeronave);
            fetchAeronaves();
            toast.success("Aeronave eliminada correctamente.");
        }
        setEstadoDialog(false);
        //console.log(selectedAeronave.id_aeronave)
    } catch (error) {
        //console.error('Error al cambiar estado:', error);
        toast.error('Error al cambiar el estado.');
    }
    };


    const estadoTemplate = (rowData) => (
        <span
          style={{
            color: rowData.estado === "activo" ? "rgb(76, 175, 80)" : "rgb(169, 70, 70)",
            fontWeight: "bold",
          }}
        >
          {rowData.estado === "activo" ? "Operativo" : "No operativo"}
        </span>
    );


    const Estados = [
        { label: "Operativo", value: "activo" },
        { label: "No operativo", value: "baja" },
        { label: "Seleccione un estado", value: " "}
      ]

    const onEstadosChange = (e, options) => {
        setEstadosFiltro(e.value);
        options.filterApplyCallback(e.value); // Aplica el filtro
      };

    const dt = useRef(null);
    const clearFilters = () => {
      if (dt.current) {
        dt.current.reset(); // Limpia los filtros de la tabla
        setEstadosFiltro(" ");    
    }
    }

    if (loading) {
        return <PantallaCarga />
    }
    return (
        <div className="background">
            <ToastContainer />
            <header className="header">
                <h1>Aeronaves</h1>
            </header>
            <DataTable
                ref={dt}
                filterDisplay='row' 
                value={aeronaves} 
                paginator rows={10} 
                rowsPerPageOptions={[5, 10, 25]} 
                style={{ width: '100%' }} >
                <Column 
                    sortable filter filterMatchMode='startsWith' showFilterMenu={false} filterPlaceholder='Buscar por Aeronave'
                    header="Aeronave" 
                    body={(rowData) => (
                        <>
                            <strong>{rowData.marca}</strong>  {rowData.modelo}
                        </>
                    )}
                />
                <Column field="matricula" header="Matrícula" sortable filter filterMatchMode='contains' showFilterMenu={false} filterPlaceholder='Buscar por Matrícula'></Column>
               
                
                <Column field="estado" header="Estado" filter sorteable showFilterMenu={false} body={estadoTemplate}
                filterElement={(options) => (
                    <Dropdown
                    value={EstadosFiltro}
                    options={Estados}
                    onChange={(e) => onEstadosChange(e, options)}
                    placeholder="Seleccione un Estado"
                    style={{ width: '100%', height: '40px',  padding: '10px'}}
                />
              )
            }
                ></Column>
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
                    header="Acciones" 
                    style={{width: '1px'}}
                    body={(rowData) => (
                    <div className='acciones'>
                        <Tooltip title="Editar estado de la aeronave">
                            <IconButton color="primary" onClick={() => openEstadoDialog(rowData)}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
  
                        <Tooltip title="Ver detalles">
                        <IconButton color="primary" aria-label="view-details" onClick={() => openDialog(rowData)}>
                            <SearchIcon />
                        </IconButton>
                        </Tooltip>

                    </div>
                )}></Column>
            </DataTable>

            <Dialog
                header="Confirmación"
                visible={estadoDialog}
                onHide={() => setEstadoDialog(false)}
                style={{ width: '400px' }}
                footer={
                    <div>
                        <Button label="Cancelar" icon="pi pi-times" onClick={() => setEstadoDialog(false)} className="p-button-text gestor-btn-cancelar" />
                        <Button label="Confirmar" icon="pi pi-check" onClick={handleCambiarEstado} className="p-button-danger gestor-btn-confirmar" />
                    </div>
                } > <p>¿Está seguro de que desea cambiar el estado de esta aeronave?</p>
            </Dialog>

           

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
