import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog'
import { Card } from 'primereact/card';
import PantallaCarga from '../../components/PantallaCarga';
import { obtenerAeronaves, insertarAeronave, actualizarAeronave,eliminarAeronave,cambiarEstadoAeronave,cambiarDatosPoliza,actualizarIntervaloInspeccion } from '../../services/aeronavesApi'; // Cambia a las APIs de aeronaves
import '../../styles/datatable-style.css';
import './Styles/GestorAeronaves.css';
//iconos
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search'; 
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import Tooltip from '@mui/material/Tooltip';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import UpdateIcon from '@mui/icons-material/Update'; 
import SettingsIcon from '@mui/icons-material/Settings'; 
import { useNavigate } from 'react-router-dom';



const AeronaveCrud = () => {
    const [aeronaves, setAeronaves] = useState([]);
    const [aeronaveDialog, setAeronaveDialog] = useState(false);
    const [aeronaveData, setAeronaveData] = useState({
        marca: '',
        modelo: '',
        matricula: '',
        potencia: '',
        clase: '',
        fecha_adquisicion: '',
        consumo_por_hora: '',
        horas_historicas: '',
        intervalo_inspeccion: '',
        ultimo_servicio: '',
        horas_vuelo_aeronave: '',
        horas_vuelo_motor: '',
        estado: 'activo',

    });
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(true);

    const [deleteDialog, setDeleteDialog] = useState(false);
    const [aeronaveToDelete, setAeronaveToDelete] = useState(null);

    const [estadoDialog, setEstadoDialog] = useState(false);
    const [polizaDialog, setPolizaDialog] = useState(false);
    const [intervaloDialog, setIntervaloDialog] = useState(false);

    const [selectedAeronave, setSelectedAeronave] = useState(null);
    const [nuevaPoliza, setNuevaPoliza] = useState({ numero_poliza: '', vencimiento_poliza: '' });
    const [nuevoIntervalo, setNuevoIntervalo] = useState({ fecha: '' });

    const handleSelectAeronave = (aeronave) => {
        setSelectedAeronave(aeronave);
    };
    

    const navigate = useNavigate();

    

    // Fetch aeronaves data from the API
    const fetchAeronaves = async () => {
        try {
            const data = await obtenerAeronaves(); // Asumiendo que ya es el array de aeronaves
            setAeronaves(data);
        } catch (error) {
            //console.error('Error fetching aeronaves:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAeronaves();
    }, []);

    // Handle adding or updating aeronave
    const handleSave = async () => {
        try {
            if (isEdit) {
                await actualizarAeronave(aeronaveData.id_aeronave, aeronaveData);
                toast.success("Aeronave actualizada correctamente.");
            } else {
                await insertarAeronave(aeronaveData);
                toast.success("Aeronave insertada correctamente.");
            }
            setAeronaveDialog(false);
            fetchAeronaves(); // Refresh the list
        } catch (error) {
            //console.error('Error saving aeronave:', error);
            toast.error("Error, todos los campos son obligatorios.");
        }
    };

    // Handle edit
    const handleEdit = (aeronave) => {
        setAeronaveData(aeronave);
        setIsEdit(true);
        setAeronaveDialog(true);
    };

    // Handle add new aeronave
    const handleAdd = () => {
        setAeronaveData({
            marca: '',
            modelo: '',
            matricula: '',
            potencia: '',
            clase: '',
            fecha_adquisicion: '',
            consumo_por_hora: '',
            intervalo_inspeccion: '',
            horas_historicas: '',
            ultimo_servicio: '',
            horas_vuelo_aeronave: '',
            horas_vuelo_motor: '',
            estado: 'activo',
        });
        setIsEdit(false);
        setAeronaveDialog(true);
    };

    const confirmDelete = (aeronave) => {
        setAeronaveToDelete(aeronave);
        setDeleteDialog(true);
    };

    const handleDelete = async () => {
        try {
            if (aeronaveToDelete) {
                await eliminarAeronave(aeronaveToDelete.id_aeronave);
                fetchAeronaves();
                toast.success("Aeronave eliminada correctamente.");
            }
            setDeleteDialog(false);
        } catch (error) {
            //console.error('Error al eliminar aeronave:', error);
            toast.error("Error al eliminar aeronave.");
        }
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


    // Funciones para manejar los diálogos
const openEstadoDialog = (aeronave) => {
    setSelectedAeronave(aeronave);
    setEstadoDialog(true);
};

const openPolizaDialog = (aeronave) => {
    setSelectedAeronave(aeronave);
    setPolizaDialog(true);
};

const openIntervaloDialog = (aeronave) => {
    setSelectedAeronave(aeronave);
    setIntervaloDialog(true);
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

const handleActualizarPoliza = async () => {
    try {
        if (selectedAeronave) {
            const { id_aeronave } = selectedAeronave; // Extraer el ID de la aeronave
            const { aseguradora, numero_poliza, vencimiento_poliza } = nuevaPoliza; // Datos de la póliza
            
            // Llamar al servicio con los parámetros correctos
            await cambiarDatosPoliza(id_aeronave, aseguradora, numero_poliza, vencimiento_poliza);
            
            fetchAeronaves(); // Actualizar la lista de aeronaves
            toast.success('Póliza actualizada correctamente.');
        }
        setPolizaDialog(false); // Cerrar el diálogo
    } catch (error) {
        //console.error('Error al actualizar póliza:', error);
        toast.error('Error al actualizar la póliza.');
    }
};


const handleActualizarIntervalo = async () => {
    try {
        if (selectedAeronave) {
            const { id_aeronave } = selectedAeronave; // Extraer el ID de la aeronave
            const intervalo_inspeccion = nuevoIntervalo.intervalo_inspeccion; // Obtener el intervalo desde el estado
            
            // Llamar al servicio con los datos correctos
            await actualizarIntervaloInspeccion(id_aeronave, intervalo_inspeccion);
            
            toast.success('Intervalo de inspección actualizado correctamente.');
            setIntervaloDialog(false); // Cerrar el diálogo
            fetchAeronaves(); // Refrescar datos
        } else {
            throw new Error('No se seleccionó ninguna aeronave.');
        }
    } catch (error) {
        //console.error('Error al actualizar intervalo:', error);
        toast.error('Error al actualizar el intervalo.');
    }
};

const handleGoToAeronavesServicios = (aeronave) => {
    if (aeronave) {
        navigate('/gestor/aeronavesServicios', {
            state: { id_aeronave: aeronave.id_aeronave },
        });
    } else {
        toast.error("No se ha seleccionado ninguna aeronave.");
    }
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
            <ToastContainer />
            <header className="header">
                <h1>Aeronaves</h1>
            </header>
            <Button className="nuevo" label="Agregar Aeronave" onClick={handleAdd} />
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
                header="Intervalo de inspección"
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
                        <Tooltip title="Editar estado de la aeronave">
                            <IconButton color="primary" onClick={() => openEstadoDialog(rowData)}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Actualizar póliza">
                            <IconButton color="primary" onClick={() => openPolizaDialog(rowData)}>
                                <UpdateIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Actualizar intervalo de inspección">
                            <IconButton color="primary" onClick={() => openIntervaloDialog(rowData)}>
                                <SettingsIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Eliminar aeronave">
                        <IconButton color="primary" aria-label="delete" onClick={() => confirmDelete(rowData)}>
                            <DeleteIcon />
                        </IconButton>

                        </Tooltip>
                        
                        <Tooltip title="Ver detalles">
                        <IconButton color="primary" aria-label="view-details" onClick={() => openDialog(rowData)}>
                            <SearchIcon />
                        </IconButton>
                        </Tooltip>

                        <Tooltip title="Historial de servicios">
                        <IconButton
                                color="primary"
                                aria-label="view-details"
                                onClick={() => handleGoToAeronavesServicios(rowData)}
                            >
                                <ManageSearchIcon />
                            </IconButton>
                        </Tooltip>


                    </div>
                )}></Column>
            </DataTable>

            <Dialog header={isEdit ? 'Actualizar Aeronave' : 'Agregar Aeronave'} visible={aeronaveDialog} onHide={() => setAeronaveDialog(false)}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="marca">Marca</label>
                        <InputText
                            id="marca"
                            value={aeronaveData.marca}
                            onChange={(e) => setAeronaveData({ ...aeronaveData, marca: e.target.value })}
                            placeholder="Marca"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="modelo">Modelo</label>
                        <InputText
                            id="modelo"
                            value={aeronaveData.modelo}
                            onChange={(e) => setAeronaveData({ ...aeronaveData, modelo: e.target.value })}
                            placeholder="Modelo"
                        />
                    </div>

                    <div className="p-field">
                        <label htmlFor="motor">Motor</label>
                        <InputText
                            id="motor"
                            value={aeronaveData.motor}
                            onChange={(e) => setAeronaveData({ ...aeronaveData, motor: e.target.value })}
                            placeholder="Motor"
                            maxLength={250}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="matricula">Matrícula</label>
                        <InputText
                            id="matricula"
                            value={aeronaveData.matricula}
                            onChange={(e) => setAeronaveData({ ...aeronaveData, matricula: e.target.value })}
                            placeholder="Matrícula"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="potencia">Potencia (HP)</label>
                        <InputText
                            id="potencia"
                            type="number"
                            min={0}
                            value={aeronaveData.potencia}
                            onChange={(e) => setAeronaveData({ ...aeronaveData, potencia: e.target.value })}
                            placeholder="Potencia"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="clase">Clase</label>
                        <InputText
                            id="clase"
                            value={aeronaveData.clase}
                            onChange={(e) => setAeronaveData({ ...aeronaveData, clase: e.target.value })}
                            placeholder="Clase"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="fecha_adquisicion">Fecha de Adquisición</label>
                        <InputText
                            id="fecha_adquisicion"
                            type="date"  // Cambiado a tipo "date" para que aparezca el selector de fecha
                            value={aeronaveData.fecha_adquisicion}
                            onChange={(e) => setAeronaveData({ ...aeronaveData, fecha_adquisicion: e.target.value })}
                            placeholder="Fecha de Adquisición"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="consumo_por_hora">Consumo por Hora (L/hr)</label>
                        <InputText
                            id="consumo_por_hora"
                            type='number'
                            min={0}
                            value={aeronaveData.consumo_por_hora}
                            onChange={(e) => setAeronaveData({ ...aeronaveData, consumo_por_hora: e.target.value })}
                            placeholder="Consumo por Hora"
                        />
                    </div>
                
                    <div className="p-field">
                        <label htmlFor="horas_historicas">Horas Históricas</label>
                        <InputText
                            id="horas_historicas"
                            type="number"
                            min={0}
                            value={aeronaveData.horas_historicas}
                            onChange={(e) => setAeronaveData({ ...aeronaveData, horas_historicas: e.target.value })}
                            placeholder="Horas Históricas"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="intervalo_inspeccion">Intervalo de Inspección (Horas)</label>
                        <InputText
                            id="intervalo_inspeccion"
                            type="number"
                            min={0}
                            value={aeronaveData.intervalo_inspeccion}
                            onChange={(e) => setAeronaveData({ ...aeronaveData, intervalo_inspeccion: e.target.value })}
                            placeholder="Horas para inspección"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="ultimo_servicio">Último Servicio</label>
                        <InputText
                            id="ultimo_servicio"
                            type="date"
                            value={aeronaveData.ultimo_servicio}
                            onChange={(e) => setAeronaveData({ ...aeronaveData, ultimo_servicio: e.target.value })}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="horas_vuelo_aeronave">Horas de Vuelo de Aeronave</label>
                        <InputText
                            id="horas_vuelo_aeronave"
                            type="number"
                            min={0}
                            value={aeronaveData.horas_vuelo_aeronave}
                            onChange={(e) => setAeronaveData({ ...aeronaveData, horas_vuelo_aeronave: e.target.value })}
                            placeholder="Horas de Vuelo"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="horas_vuelo_motor">Horas de Vuelo de Motor</label>
                        <InputText
                            id="horas_vuelo_motor"
                            type="number"
                            min={0}
                            value={aeronaveData.horas_vuelo_motor}
                            onChange={(e) => setAeronaveData({ ...aeronaveData, horas_vuelo_motor: e.target.value })}
                            placeholder="Horas de Motor"
                        />
                    </div>

                    <div className="p-field">
                    <label htmlFor="aseguradora">Aseguradora</label>
                    <InputText
                        id="aseguradora"
                        value={aeronaveData.aseguradora}
                        onChange={(e) => setAeronaveData({ ...aeronaveData, aseguradora: e.target.value })}
                        placeholder="Aseguradora"
                        maxLength={250}
                    />
                    </div>
                    <div className="p-field">
                        <label htmlFor="numero_poliza">Número de Póliza</label>
                        <InputText
                            id="numero_poliza"
                            value={aeronaveData.numero_poliza}
                            onChange={(e) => setAeronaveData({ ...aeronaveData, numero_poliza: e.target.value })}
                            placeholder="Número de Póliza"
                            maxLength={250}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="vencimiento_poliza">Vencimiento de Póliza</label>
                        <InputText
                            id="vencimiento_poliza"
                            type="date"
                            value={aeronaveData.vencimiento_poliza}
                            onChange={(e) => setAeronaveData({ ...aeronaveData, vencimiento_poliza: e.target.value })}
                        />
                    </div>
                    <div className="p-d-flex p-jc-end">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={() => setAeronaveDialog(false)} />
                        <Button label="Guardar" icon="pi pi-check" id="btn-guardar" onClick={handleSave} />
                    </div>

                </div>
            </Dialog>

            <Dialog
                header="Confirmación"
                visible={deleteDialog}
                onHide={() => setDeleteDialog(false)}
                style={{ width: '400px' }}
                footer={
                    <div>
                        <Button className="gestor-btn-cancelar p-button-text" label="Cancelar" icon="pi pi-times" onClick={() => setDeleteDialog(false)} />
                        <Button className="gestor-btn-confirmar p-button-danger" label="Eliminar" icon="pi pi-check" onClick={handleDelete}  />
                    </div>
                }
            >
                <p>¿Está seguro que desea eliminar la aeronave <strong>{aeronaveToDelete?.matricula}</strong>?</p>
            </Dialog>

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

           

            <Dialog visible={polizaDialog} onHide={() => setPolizaDialog(false)} header="Actualizar Póliza">
            <div>
                <label htmlFor="aseguradora">Aseguradora</label>
                    <InputText
                        id="aseguradora"
                        value={nuevaPoliza.aseguradora}
                        onChange={(e) => setNuevaPoliza({ ...nuevaPoliza, aseguradora: e.target.value })}
                        placeholder="Aseguradora"
                        maxLength={250}
                    />
                    </div>
                    <div className="p-field">
                        <label htmlFor="numero_poliza">Número de Póliza</label>
                        <InputText
                            id="numero_poliza"
                            value={nuevaPoliza.numero_poliza}
                            onChange={(e) => setNuevaPoliza({ ...nuevaPoliza, numero_poliza: e.target.value })}
                            placeholder="Número de Póliza"
                            maxLength={250}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="vencimiento_poliza">Vencimiento de Póliza</label>
                        <InputText
                            id="vencimiento_poliza"
                            type="date"
                            value={nuevaPoliza.vencimiento_poliza}
                            onChange={(e) => setNuevaPoliza({ ...nuevaPoliza, vencimiento_poliza: e.target.value })}
                        />
                    </div>
                
    
                <Button label="Actualizar" onClick={handleActualizarPoliza} />
            </Dialog>

            <Dialog visible={intervaloDialog} 
                    onHide={() => setIntervaloDialog(false)} 
                    header="Actualizar Intervalo de Inspección"
                    footer={<Button label="Actualizar" onClick={handleActualizarIntervalo} className='gestor-btn-confirmar' />}>
                <div className="p-field">
                        <label htmlFor="intervalo_inspeccion">Intervalo de Inspección (Horas)</label>
                        <InputText
                            id="intervalo_inspeccion"
                            type="number"
                            min={0}
                            value={nuevoIntervalo.intervalo_inspeccion}
                            onChange={(e) => setNuevoIntervalo({ ...nuevoIntervalo, intervalo_inspeccion: e.target.value })}
                            placeholder="Horas para inspección"
                        />
                </div>
                
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
