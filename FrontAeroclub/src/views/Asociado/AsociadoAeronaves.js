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
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [estadoFiltro, setEstadoFiltro] = useState(null);
    //const [selectedAeronave, setSelectedAeronave] = useState(null); // Aeronave seleccionada
    const [servicioData, setServicioData] = useState({
            fecha: '',
            horas_anteriores: 0,
            observaciones: '',
            id_aeronave:'',
        }); // Estado para los datos del servicio

    // Función para obtener aeronaves
    const fetchAeronaves = async () => {
        try {
            const data = await obtenerAeronaves();
            //console.log('Datos de Aeronaves:', data);
            // Modificamos los datos para asegurarnos de que las horas de vuelo sean enteras
            const aeronavesConHorasEnteras = data.map((aeronave) => ({
                ...aeronave,
                horas_vuelo_aeronave: Math.floor(parseFloat(aeronave.horas_vuelo_aeronave)) // Convertir a entero
            }));
            setAeronaves(aeronavesConHorasEnteras); // Guardamos los datos modificados en el estado
        } catch (error) {
            console.error('Error fetching aeronaves:', error);
        } finally {
            setLoading(false);
        }
    };
    // Función para obtener servicios de una aeronave
    const fetchServicios = async (id_aeronave) => {
        try {
            const data = await obtenerServicios(id_aeronave);
            //console.log('Datos de Servicios:', data);
            setServicioData(data);
        } catch (error) {
            console.error('Error al obtener los servicios:', error);
        }
    };
    // useEffect para cargar aeronaves
    useEffect(() => {
        fetchAeronaves();
    }, []);

    // useEffect para cargar servicios
    useEffect(() => {
        fetchServicios();
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
    }

    if (loading) {
        return <PantallaCarga />
    }
    return (
        <div className="background">
            <header className="header">
                <h1>Aeronaves</h1>
            </header>
            <p>AGREGAR EN LA COLUMNA HORAS DE VUELO TOTAL, HORAS PARA LA PROXIMA INSPECCION</p>
            <DataTable ref={dt} value={aeronaves} paginator rows={10} rowsPerPageOptions={[5, 10, 25]} style={{ width: '100%' }} filterDisplay='row'>
                <Column header="Aeronave" body={(rowData) => ( <> <strong>{rowData.marca}</strong>  {rowData.modelo}</> )}
                sortable filter filterPlaceholder="Buscar por Aeronave" filterMatchMode="contains" showFilterMenu={false}  showClearButton={false} />
                <Column field="matricula" header="Matrícula" sortable filter filterPlaceholder="Buscar por Matricula" filterMatchMode="contains" showFilterMenu={false} showClearButton={false} />
                <Column field="horas_vuelo_aeronave" header="Total horas voladas" sortable filter filterPlaceholder="Buscar por horas" filterMatchMode="equals" showFilterMenu={false} 
                    showClearButton={false} body={(rowData) => `${Math.floor(parseFloat(rowData.horas_vuelo_aeronave))} hs.`}/>
                <Column field="" header="Hs próximo service" sortable filter filterPlaceholder="Buscar por horas" filterMatchMode="contains" showFilterMenu={false}  showClearButton={false} />
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
