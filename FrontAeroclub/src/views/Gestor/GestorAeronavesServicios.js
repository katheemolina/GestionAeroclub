import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog'
import { Card } from 'primereact/card';
import PantallaCarga from '../../components/PantallaCarga';
import { obtenerAeronaves} from '../../services/aeronavesApi'; 
import { obtenerServicios, insertarServicio } from '../../services/serviciosAeronaves'; 
import '../../styles/datatable-style.css';
import './Styles/GestorAeronaves.css';
import IconButton from '@mui/material/IconButton';

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

    const [horasVoladas, setHorasVoladas] = useState(''); 

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

    useEffect(() => {
        if (aeronave) {
            
            const totalHorasVoladas = Number(aeronave.horas_vuelo_aeronave || 0);
            
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
            
            setServicioData((prevData) => ({
                ...prevData,
                horas_anteriores: totalHorasVoladas,
                fecha: formattedDate,
            }));
        }
    }, [aeronave]);
    
    useEffect(() => {
        if (!id_aeronave) {
            toast.error("No se recibió un ID de aeronave.");
        } else {
            // Obtener el listado de aeronaves y buscar la correspondiente
            obtenerAeronaves().then((aeronaves) => {
                const aeronaveSeleccionada = aeronaves.find(a => a.id_aeronave === id_aeronave);
                //console.log("Aeronave Seleccionada: ",aeronaveSeleccionada)
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
                        //console.log("Servicios Data:",serviciosData);
                        setLoading(false); // Cuando los servicios se hayan cargado, cambia el estado de carga
                    }).catch((error) => {
                        setLoading(false);
                        toast.error("La aeronave seleccionada no tiene servicios registrados");
                    });
                } else {
                    toast.error("No se encontró la aeronave con el ID especificado.");
                }
            }).catch((error) => {
                toast.error("Hubo un error al cargar las aeronaves.");
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

    const servicioAGuardar = {
        ...servicioData,
        observaciones: servicioData.observaciones || 'Ninguna', // Asegura que nunca sea undefined
    };
        insertarServicio(servicioAGuardar)
            .then((newServicio) => {
                const servicioConFecha = {
                    ...newServicio,
                    fecha: newServicio.fecha || servicioData.fecha,
                };
    
                setServicios([...servicios, servicioConFecha]);
    
                setSelectedRowData(servicioConFecha);
                
                toast.success("Servicio agregado correctamente.");

                setTriggerEffect(!triggerEffect);  // Esto cambia el valor y dispara el useEffect

                setMostrarDialog(false);
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
            

            {loading ? (
                <PantallaCarga /> // Componente de carga mientras se obtienen los datos
            ) : (
                <div className="datatable-container-servicios">
                    <Button 
                className="nuevo gestor-btn-confirmar" 
                label="Agregar Servicio" 
                onClick={() => setMostrarDialog(true)} 
            />
                    <DataTable  className="tabla-servicios"value={servicios} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}>
                        <Column sortable field="fecha" header="Fecha" body={plantillaFecha}/>
                        <Column field="horas_anteriores" header="Horas Anteriores" />
                        <Column header="Acciones" 
                    style={{width: '1px'}}
                    body={(rowData) => (
                    <div className='acciones'>
                        <Tooltip title="Observaciones">
                                <IconButton color="primary" aria-label="view-details" onClick={() => openDialog(rowData)}>
                                    <SearchIcon />
                                </IconButton>
                            </Tooltip>
                    </div>
                )}></Column>
                    </DataTable>
                    <Dialog header="Observaciones del servicio" visible={dialogVisible} style={{ width: '400px' }} onHide={closeDialog}>
                {selectedRowData && (
                <div>
                    <div className='p-fluid details-dialog'>
                        
                        <Card className='card-observaciones'>
                        {selectedRowData?.observaciones || 'Sin observaciones'}
                        </Card>
                          
                    </div>
                </div>
                )}
            </Dialog>
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
                            placeholder="Ninguna"
                        />
                    </div>

                    {/* Campo para horas anteriores */}
                    <div className="p-field">
                        <label>Horas Anteriores</label>
                        <InputText
                            type="number"
                            name="horas_anteriores"
                            value={servicioData.horas_anteriores}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </Dialog>

        </div>
    );
};

export default GestorAeronavesServicios;