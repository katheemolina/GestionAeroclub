import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import PantallaCarga from '../../components/PantallaCarga';
import { obtenerAeronaves } from '../../services/aeronavesApi';
import { obtenerServicios } from '../../services/serviciosAeronaves';
import '../../styles/datatable-style.css';
import './Styles/GestorAeronaves.css';
// Iconos y botones
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

const AeronaveCrud = () => {
    // Estados
    const [aeronaves, setAeronaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [estadoFiltro, setEstadoFiltro] = useState(null);

    // Función para obtener aeronaves
    const fetchAeronaves = async () => {
        try {
            const data = await obtenerAeronaves();
            
            // Transformamos los datos obtenidos añadiendo cálculos adicionales para cada aeronave.
            const aeronavesConDatosExtras = await Promise.all(

                data.map(async (aeronave) => { // Iteramos sobre cada aeronave de la lista
                    // Obtenemos los servicios asociados a esta aeronave (probablemente datos de mantenimiento).
                    const serviciosAeronave = await obtenerServicios(aeronave.id_aeronave);
                    
                    // Tomamos el último servicio registrado (el primero en la lista `serviciosAeronave`).
                    const servicio = serviciosAeronave?.[0];

                    // Calculamos las horas de vuelo actuales de la aeronave convirtiendo el string a número decimal.
                    const horasActuales = parseFloat(aeronave.horas_vuelo_aeronave);

                    // Obtenemos las horas registradas en el último servicio; si no hay datos, usamos 0 como valor predeterminado.
                    const horasEnUltimoService = parseFloat(servicio?.horas_anteriores || 0);

                    // Obtenemos el intervalo entre inspecciones (cuántas horas pueden pasar entre servicios).
                    const intervaloInspeccion = parseFloat(aeronave.intervalo_para_inspeccion || 0);

                    // Calculamos cuántas horas han pasado desde el último servicio.
                    const horasDesdeUltimoService = horasActuales - horasEnUltimoService;

                    // Calculamos cuántas horas faltan para la próxima inspección.
                    const horasRestantes = intervaloInspeccion - horasDesdeUltimoService;

                    // Devolvemos un nuevo objeto que incluye los datos originales de la aeronave y los cálculos adicionales.
                    return {
                        ...aeronave, // Copiamos todas las propiedades originales de la aeronave.
                        horas_vuelo_aeronave: Math.floor(horasActuales), // Redondeamos las horas de vuelo actuales al número entero más cercano.
                        horas_para_inspeccion: horasRestantes > 0 
                            ? `${Math.floor(horasRestantes)} hs` // Si aún faltan horas, mostramos cuántas con el sufijo "hs".
                            : 'Inspección requerida' // Si no faltan horas (o son negativas), indicamos que se necesita inspección.
                    };
                })
            );

            // Actualizamos el estado con la lista transformada de aeronaves que incluye los nuevos cálculos.
            setAeronaves(aeronavesConDatosExtras);
        } catch (error) {
            // Si ocurre algún error durante el proceso, lo mostramos en la consola.
            console.error('Error fetching aeronaves:', error);
        } finally {
            // Marcamos que la operación de carga ha finalizado, independientemente de si fue exitosa o fallida.
            setLoading(false);
        }
    };

    // useEffect para cargar aeronaves
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

    const OpcionesEstados = [
        { label: "Operativo", value: "activo" },
        { label: "No operativo", value: "baja" },
        { label: "Seleccione un estado", value: " "}
    ]

    const onEstadoChange = (e, options) => {
        setEstadoFiltro(e.value);
        options.filterApplyCallback(e.value); // Aplica el filtro
    };

    const dt = useRef(null);
        const clearFilters = () => {
        if (dt.current) {
            dt.current.reset(); // Limpia los filtros de la tabla
            
        }
        setEstadoFiltro('');
    }

    if (loading) {
        return <PantallaCarga />
    }
    return (
        <div className="background">
            <header className="header">
                <h1>Aeronaves</h1>
            </header>
            <DataTable ref={dt} value={aeronaves} paginator rows={10} rowsPerPageOptions={[5, 10, 25]} style={{ width: '100%' }} filterDisplay='row'>
                <Column header="Aeronave" body={(rowData) => ( <> <strong>{rowData.marca}</strong>  {rowData.modelo}</> )}
                sortable filter filterPlaceholder="Buscar por Aeronave" filterMatchMode="contains" showFilterMenu={false}  showClearButton={false} />
                <Column field="matricula" header="Matrícula" sortable filter filterPlaceholder="Buscar por Matricula" filterMatchMode="contains" showFilterMenu={false} showClearButton={false} />
                <Column 
                    field="horas_vuelo_aeronave" 
                    header="Total horas voladas" 
                    sortable 
                    filter 
                    filterPlaceholder="Buscar por horas" 
                    filterMatchMode="equals" 
                    showFilterMenu={false} 
                    showClearButton={false} 
                    body={(rowData) => `${rowData.horas_vuelo_aeronave} hs`} 
                />
                <Column 
                    field="horas_para_inspeccion" 
                    header="Hs próximo service" 
                    sortable filter filterPlaceholder="Buscar por horas" 
                    filterMatchMode="contains" 
                    showFilterMenu={false} 
                    showClearButton={false} 
                />
                <Column sortable filter showFilterMenu={false} field="estado" header="Estado" body={estadoTemplate} filterElement={(options) => (
                    <Dropdown value={estadoFiltro} options={OpcionesEstados} onChange={(e) => onEstadoChange(e, options)} placeholder="Seleccione un estado" 
                        style={{ width: '100%', height: '40px',  padding: '10px'}}/>)}/>
                <Column header="Acciones" filter showFilterMenu={false} filterElement={
                    <Button label="Limpiar" onClick={clearFilters} style={{ width: '100%', height: '40px',  padding: '10px'}}/>}
                        style={{width: '1px'}}
                        body={(rowData) => (
                        <div className='acciones'>
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
                            <p><strong>Fecha de inspeccion Anual:</strong> {/*{selectedRowData.fecha_inspeccion_anual} Comentado hasta que este el SP*/}</p>
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
