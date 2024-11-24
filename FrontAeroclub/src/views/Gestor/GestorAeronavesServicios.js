import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog'
import { Card } from 'primereact/card';
import PantallaCarga from '../../components/PantallaCarga';
import { obtenerAeronaves} from '../../services/aeronavesApi'; 
import { obtenerServicios, insertarServicio, actualizarServicio } from '../../services/serviciosAeronaves'; 
import '../../styles/datatable-style.css';
import './Styles/GestorAeronaves.css';

import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search'; 
import Tooltip from '@mui/material/Tooltip';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



const GestorAeronavesServicios = () => {
    const location = useLocation();
    const { id_aeronave } = location.state || {};
     const [aeronave, setAeronave] = useState(null);
     const [servicios, setServicios] = useState([]); // Estado para los servicios de la aeronave
     const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos
     const [mostrarDialog, setMostrarDialog] = useState(false); // Estado para mostrar el dialog
    const [servicioData, setServicioData] = useState({
        fecha: '',
        horas_anteriores: 0,
        observaciones: '',
        id_aeronave: id_aeronave,
    }); // Estado para los datos del servicio

    const [horasVoladas, setHorasVoladas] = useState(0); 

<<<<<<< HEAD
    const navigate = useNavigate(); 

    useEffect(() => {
        if (id_aeronave) {
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
            setServicioData((prevData) => ({
                ...prevData,
                fecha: formattedDate, // Establecer la fecha de hoy por defecto
            }));
        }
    }, [id_aeronave]);
    
    useEffect(() => {
        if (!id_aeronave) {
            toast.error("No se recibió un ID de aeronave.");
=======
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [aeronaveToDelete, setAeronaveToDelete] = useState(null);

    const [estadoDialog, setEstadoDialog] = useState(false);
    const [polizaDialog, setPolizaDialog] = useState(false);
    const [intervaloDialog, setIntervaloDialog] = useState(false);

    const [selectedAeronave, setSelectedAeronave] = useState(null);
    const [nuevaPoliza, setNuevaPoliza] = useState({ numero_poliza: '', vencimiento_poliza: '' });
    const [nuevoIntervalo, setNuevoIntervalo] = useState({ fecha: '' });


    

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
        console.error('Error al cambiar estado:', error);
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
        console.error('Error al actualizar póliza:', error);
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
>>>>>>> e667a6c666b1d5d1d81849a901519dff218fb1a9
        } else {
            // Obtener el listado de aeronaves y buscar la correspondiente
            obtenerAeronaves().then((aeronaves) => {
                const aeronaveSeleccionada = aeronaves.find(a => a.id_aeronave === id_aeronave);
                if (aeronaveSeleccionada) {
                    setAeronave(aeronaveSeleccionada); // Establecer la aeronave seleccionada en el estado
                    // Obtener los servicios de la aeronave seleccionada
                    obtenerServicios(id_aeronave).then((serviciosData) => {
                        setServicios(serviciosData);
                        setLoading(false); // Cuando los servicios se hayan cargado, cambia el estado de carga
                    }).catch((error) => {
                        toast.error("La aeronave seleccionada no tiene servicios registrados");
                        setLoading(false);
                    });
                } else {
                    toast.error("No se encontró la aeronave con el ID especificado.");
                }
            }).catch((error) => {
                console.log("Hubo un error al cargar las aeronaves.");
            });
        }
    }, [id_aeronave]);



    const handleBackClick = () => {
        navigate('/gestor/aeronaves'); // Redirige a la ruta deseada
    };

    // Función para manejar el cambio de los valores del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setServicioData({ ...servicioData, [name]: value });
    };

     // Función para manejar la inserción del servicio
     const handleSubmit = () => {
        insertarServicio(servicioData)
            .then((newServicio) => {
                setServicios([...servicios, newServicio]); // Agregar el nuevo servicio a la lista
                toast.success("Servicio agregado correctamente.");
                setMostrarDialog(false); // Cerrar el dialog
            })
            .catch((error) => {
                toast.error("Error al agregar el servicio.");
            });
    };


    return (
        <div className="background">
            <ToastContainer />
            <header className="header">
            {/* Botón volver a asociados */}
            <Tooltip title="Ver aeronaves">
                <IconButton 
                color="primary" 
                aria-label="Atras" 
                className="back-button" 
                onClick={handleBackClick} // Agrega el manejador de clics
                >
                <ArrowBackIcon />
                </IconButton>
            </Tooltip>

            {/* Título con matrícula de la aeronave seleccionada */}
            <h1>
                Historial de Servicios de la Aeronave: {aeronave ? aeronave.matricula : 'Cargando...'} ✈️
            </h1>
            
            </header>
            <Button 
                className="nuevo" 
                label="Agregar Servicio" 
                onClick={() => setMostrarDialog(true)} 
            />

            {loading ? (
                <PantallaCarga /> // Componente de carga mientras se obtienen los datos
            ) : (
                <div className="datatable-container">
                    <DataTable value={servicios} paginator rows={10} rowsPerPageOptions={[5, 10, 25]} 
                style={{ width: '100%' }} >
                        <Column field="fecha" header="Fecha" />
                        <Column field="horas_anteriores" header="Horas Anteriores" />
                        <Column field="observaciones" header="Observaciones" />
                        <Column header="Acciones" 
                    style={{width: '1px'}}
                    body={(rowData) => (
                    <div className='acciones'>
                        <Tooltip title="Editar estado de la aeronave">
                            <IconButton color="primary" >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                )}></Column>
                    </DataTable>
                </div>
            )}
            
            {/* Dialog para agregar servicio */}
            <Dialog 
                visible={mostrarDialog} 
                onHide={() => setMostrarDialog(false)} 
                header="Agregar Servicio" 
                footer={
                    <Button label="Agregar" icon="pi pi-check" onClick={handleSubmit} />
                }
            >
                <div className="p-fluid">
                    {/* Mostrar matrícula de la aeronave */}
                    <div className="p-field">
                        <label>Matricula de la aeronave</label>
                        <InputText value={aeronave?.matricula} disabled />
                    </div>

                    {/* Campo para fecha */}
                    <div className="p-field">
                        <label>Fecha</label>
                        <InputText 
                            name="fecha" 
                            type="date" 
                            value={servicioData.fecha} 
                            onChange={handleInputChange} 
                            placeholder="Fecha del servicio"
                        />
                    </div>

                    {/* Campo para observaciones */}
                    <div className="p-field">
                        <label>Observaciones</label>
                        <InputText 
                            name="observaciones" 
                            value={servicioData.observaciones} 
                            onChange={handleInputChange} 
                        />
                    </div>

                    {/* Mostrar horas voladas actuales */}
                    <p>Horas voladas actuales: {horasVoladas}</p>

                    {/* Campo para horas anteriores */}
                    <div className="p-field">
                        <label>Horas Anteriores</label>
                        <InputText 
                            name="horas_anteriores" 
                            value={servicioData.horas_anteriores} 
                            onChange={handleInputChange} 
                            disabled 
                        />
                    </div>
                </div>
            </Dialog>

        </div>
    );
};

export default GestorAeronavesServicios;