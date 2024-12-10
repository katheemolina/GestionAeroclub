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
    const [servicioEditar, setServicioEditar] = useState(null);
    const [mostrarDialogEditar, setMostrarDialogEditar] = useState(false);
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
    const [horasVoladas, setHorasVoladas] = useState(0); 

    const navigate = useNavigate(); 

    const [triggerEffect, setTriggerEffect] = useState(false); // Para llamar al useEffect que trae los datos de servicios
    
    const formatearFecha = (fecha) => {
        const date = new Date(fecha + 'T00:00:00'); // Agregar hora para evitar problemas de zona horaria
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const año = date.getFullYear();
        
        return `${dia}/${mes}/${año}`;
    };

    const plantillaFecha = (rowData) => {
    return formatearFecha(rowData.fecha);
    };


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
        } else {
            // Obtener el listado de aeronaves y buscar la correspondiente
            obtenerAeronaves().then((aeronaves) => {
                const aeronaveSeleccionada = aeronaves.find(a => a.id_aeronave === id_aeronave);
                if (aeronaveSeleccionada) {
                    setAeronave(aeronaveSeleccionada); // Establecer la aeronave seleccionada en el estado
                    // Calcular las horas voladas: horas_historicas_voladas + horas_vuelo_aeronave
                    // Asegurarse de que los valores sean números
                    const horasHistoricas = Number(aeronaveSeleccionada.horas_historicas_voladas || 0);
                    const horasVuelo = Number(aeronaveSeleccionada.horas_vuelo_aeronave || 0);

                    // Calcular el total correctamente
                    const totalHorasVoladas = horasHistoricas + horasVuelo;
                    setHorasVoladas(totalHorasVoladas);

                    // Obtener los servicios de la aeronave seleccionada
                    obtenerServicios(id_aeronave).then((serviciosData) => {
                        setServicios(serviciosData);
                        console.log(serviciosData);
                        setLoading(false); // Cuando los servicios se hayan cargado, cambia el estado de carga
                    }).catch((error) => {
                        setLoading(false);
                        toast.error("La aeronave seleccionada no tiene servicios registrados");
                    });
                } else {
                    toast.error("No se encontró la aeronave con el ID especificado.");
                }
            }).catch((error) => {
                console.log("Hubo un error al cargar las aeronaves.");
            });
        }
    }, [id_aeronave, triggerEffect]);



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

    const handleEditClick = (servicio) => {
        setServicioSeleccionado(servicio);
        setServicioData({
            fecha: servicio.fecha,
            observaciones: servicio.observaciones,
        });
        setMostrarDialogEditar(true);
    };

    const handleUpdateSubmit = () => {
        if (!servicioSeleccionado) return;
    
        // Verificar que el id_servicio está presente
        console.log("Servicio a actualizar:", servicioSeleccionado.id_servicio);
        console.log("Datos del servicio:", servicioData);
    
        actualizarServicio(servicioSeleccionado.id_servicio, servicioData)
            .then(() => {
                toast.success("Servicio actualizado correctamente.");
                setMostrarDialogEditar(false);
                setTriggerEffect(prev => !prev); // LLamo al useEffect para que retome los datos de la tabla
            })
            .catch(() => {
                toast.error("Error al actualizar el servicio.");
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
                onClick={handleBackClick} 
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
                        <Column field="fecha" header="Fecha" body={plantillaFecha}/>
                        <Column field="horas_anteriores" header="Horas Anteriores" />
                        <Column field="observaciones" header="Observaciones" />
                        <Column header="Acciones" 
                    style={{width: '1px'}}
                    body={(rowData) => (
                    <div className='acciones'>
                        <Tooltip title="Editar servicio">
                                <IconButton color="primary" onClick={() => handleEditClick(rowData)}>
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

                    {/* Campo para horas anteriores */}
                    <div className="p-field">
                        <label>Horas Anteriores</label>
                        <InputText 
                            name="horas_anteriores" 
                            value={horasVoladas} 
                            onChange={handleInputChange} 
                        />
                    </div>
                </div>
            </Dialog>

            {/* Dialog para editar servicio */}
            <Dialog 
                visible={mostrarDialogEditar} 
                onHide={() => setMostrarDialogEditar(false)} 
                header="Editar Servicio" 
                footer={
                    <Button label="Guardar" icon="pi pi-check" onClick={handleUpdateSubmit} />
                }
            >
                <div className="p-fluid">
                    
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
                </div>
            </Dialog>

        </div>
    );
};

export default GestorAeronavesServicios;