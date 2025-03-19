import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { obtenerTarifas, insertarTarifa, actualizarTarifa ,eliminarTarifa} from '../../services/tarifasApi';
import { obtenerAeronaves } from '../../services/aeronavesApi'; 
import '../../styles/datatable-style.css';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './Styles/GestorTarifas.css';
import PantallaCarga from '../../components/PantallaCarga';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MultiSelect } from 'primereact/multiselect';



const TarifaCrud = () => {
    const [tarifas, setTarifas] = useState([]);
    const [tarifaDialog, setTarifaDialog] = useState(false);
    const [tarifaData, setTarifaData] = useState({
        fecha_vigencia_desde: '',
        tipo_tarifa: '',
        importe: '',
        importe_por_instruccion: 0,
        con_instructor: false,
    });
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(true);

    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedTarifa, setSelectedTarifa] = useState(null);

    const [tarifasFiltro, setTarifasFiltro] = useState(null);



    const opcionesTipoTarifa = [
        { label: 'Vuelo', value: 'Vuelo' },
        { label: 'Combustible', value: 'Combustible' },
    ];

    // Fetch tarifas data from the API
    const fetchTarifas = async () => {
        try {
            const data = await obtenerTarifas();
            console.log("Obtener Tarifas:",data)
            setTarifas(data.data);
        } catch (error) {
            console.error('Error fetching tarifas:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTarifas();
    }, []);

    // Traigo datos de aeronaves
    const [aeronaves, setAeronaves] = useState([]);
    const [aeronavesSeleccionado, setAeronavesSeleccionado] = useState([]);
    const fetchAeronaves = async () => {
        try {
            const data = await obtenerAeronaves();
            setAeronaves(data);
        } catch (error) {
            console.error('Error fetching aeronaves:', error);
        }
    };
    useEffect(() => {
        fetchAeronaves();
    }, []);

    // Handle adding or updating tarifa
    const handleSave = async () => {
        try {
            if(tarifaData.tipo_tarifa === "Combustible"){
                tarifaData.importe_por_instruccion = "0"
                tarifaData.aeronaves="null"
            }
            //console.log("Datos a guardar:", tarifaData); // Agrega este console.log
            if (isEdit) {
                await actualizarTarifa(tarifaData.id_tarifa, tarifaData);
                toast.success("Tarifa actualizada correctamente.");
            } else {
                await insertarTarifa(tarifaData);
                toast.success("Tarifa insertada correctamente.");
            }
            setTarifaDialog(false);
            fetchTarifas(); // Refresh the list
        } catch (error) {
            console.error('Error saving tarifa:', error);
            toast.error("Error, vuelva a intentar en otro momento.");
        }
    };

    // Handle edit
    const handleEdit = (tarifa) => {
        setTarifaData(tarifa);
        setIsEdit(true);
        setTarifaDialog(true);
    };

    // Handle add new tarifa
    const handleAdd = () => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0]; // Formato 'yyyy-mm-dd' para el input de tipo date

        setTarifaData({
            fecha_vigencia_desde: formattedDate, // Set the date to today
            tipo_tarifa: '',
            importe: '',
            importe_por_instruccion: 0,
            con_instructor: false,
            aeronaves: null,

        });
        setIsEdit(false);
        setTarifaDialog(true);
    };

    const confirmDelete = (tarifa) => {
        setSelectedTarifa(tarifa);
        setDeleteDialog(true);
    };
    
    const handleDelete = async () => {
        try {
            if (selectedTarifa) {
                await eliminarTarifa(selectedTarifa.id_tarifa);
                fetchTarifas(); // Actualiza la lista después de eliminar
                toast.success("Tarifa eliminada correctamente.");
            }
            setDeleteDialog(false); // Cierra el diálogo
            setSelectedTarifa(null); // Limpia la tarifa seleccionada
        } catch (error) {
            console.error('Error al eliminar tarifa:', error);
            toast.error("Error al eliminar tarifa.");
        }
    };
    
    
    const handleTipoTarifaChange = (tipo_tarifa) => {
        const updatedData = { ...tarifaData, tipo_tarifa };
        if (tipo_tarifa === 'Combustible') {
            updatedData.importe_por_instruccion = 0;
            updatedData.con_instructor = false;
        }
        setTarifaData(updatedData);
    };

    const handleImporteChange = (importe) => {
        const updatedData = { ...tarifaData, importe };
        if (tarifaData.tipo_tarifa === 'Vuelo') {
            updatedData.importe_por_instruccion = (importe * 0.15).toFixed(2);
        } else {
            updatedData.importe_por_instruccion = 0;
        }
        setTarifaData(updatedData);
    };
    
    

    const handleInstructorCheck = (checked) => {
        const updatedData = { ...tarifaData, con_instructor: checked };
        if (checked) {
            updatedData.importe_por_instruccion = (tarifaData.importe * 0.15).toFixed(2);
        } else {
            updatedData.importe_por_instruccion = 0;
        }
        setTarifaData(updatedData);
    };

    // Column definitions
// Formatear la fecha para evitar repetición de código
const formatDate = (date) => {
    if (!date) return ''; // Manejar valores nulos o indefinidos
    const fecha = new Date(date + 'T00:00:00'); // Asegurar que se tome en local sin desfase horario
    const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
};

// Template para la columna "Fecha Vigencia Desde"
const dateDesdeBodyTemplate = (rowData) => {
    return <span>{formatDate(rowData.fecha_vigencia_desde)}</span>;
};

// Template para la columna "Fecha Vigencia Hasta"
const dateHastaBodyTemplate = (rowData) => {
    return <span>{rowData.fecha_vigencia_hasta ? formatDate(rowData.fecha_vigencia_hasta) : "Actualmente vigente"}</span>;
};



    const amountBodyTemplate = (rowData) => {
        return <span>${rowData.importe}</span>;
    };

    const importeInstruccionBodyTemplate = (rowData) => {
        // Convertimos el importe_por_instruccion a número y comparamos
        const importePorInstruccion = parseFloat(rowData.importe_por_instruccion);
        
        // Verificamos si el tipo de tarifa es "Combustible" o si el importe es 0
        if (rowData && (rowData.tipo_tarifa.toLowerCase() === 'combustible' || importePorInstruccion === 0)) {
            return "No aplica";
        }
        // Si no es ninguno de esos casos, mostramos el valor del importe por instrucción
        return <span>${rowData?.importe_por_instruccion || ''}</span>;
    };

    const onTarifasChange = (e, options) => {
        setTarifasFiltro(e.value);
        options.filterApplyCallback(e.value); // Aplica el filtro
      };

    const TiposTarifas = [
        { label: "Combustible", value: "Combustible" },
        { label: "Vuelo", value: "Vuelo" },
        { label: "Seleccione instrucción", value: " "}
      ]

    const dt = useRef(null);
    const clearFilters = () => {
      if (dt.current) {
        dt.current.reset(); // Limpia los filtros de la tabla
        }
    }
    
    

    if (loading) {
        return <PantallaCarga/>
    }
    return (
        <div className="background">
            <ToastContainer />
            <header className="header">
                <h1>Tarifas</h1>
            </header>
            <Button className="nuevo gestor-btn-confirmar" label="Agregar Tarifa" onClick={handleAdd} />
            <DataTable 
                ref={dt}
                filterDisplay='row'
                value={tarifas} 
                paginator rows={10} 
                rowsPerPageOptions={[5, 10, 25]} 
                style={{ width: '100%' }} >
                <Column field="fecha_vigencia_desde" header="Vigente desde" body={dateDesdeBodyTemplate} filter sorteable filterType='date' showFilterMenu={false}></Column>
                <Column field="fecha_vigencia_hasta" header="Vigente hasta" body={dateHastaBodyTemplate} filter sorteable filterType='date' showFilterMenu={false}></Column>
                <Column field="tipo_tarifa" header="Tipo Tarifa" sortable filter showFilterMenu={false} filterElement={(options) => (
                            <Dropdown
                            value={tarifasFiltro}
                            options={TiposTarifas}
                            onChange={(e) => onTarifasChange(e, options)}
                            placeholder="Seleccione instrucción"
                            style={{ width: '100%', height: '40px',  padding: '10px'}}
                        />
                      )
                    }></Column>
                <Column field="importe" header="Importe" body={amountBodyTemplate} filterPlaceholder='Buscar por Importe' sorteable filter filterMatchMode='contains' showFilterMenu={false}></Column>
                <Column field="importe_por_instruccion" header="Importe por instrucción" body={importeInstruccionBodyTemplate} filterPlaceholder='Buscar por Importe' sorteable filter filterMatchMode='contains' showFilterMenu={false}></Column>
                <Column field="AeronavesMatri" header="Aeronaves" filterPlaceholder='Buscar por Aeronave' sorteable filter filterMatchMode='contains' showFilterMenu={false}></Column>

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
                    style={{ width: '1px'}}
                    body={(rowData) => (
                    <div style={{ display: 'flex', gap: '8px'}}>

                        
                        <Tooltip title="Eliminar">
                            <IconButton color="primary" aria-label="delete" onClick={() => confirmDelete(rowData)}>
                                 <DeleteIcon />
                            </IconButton>
                        </Tooltip>

                    </div>
                )}></Column>
            </DataTable>

            <Dialog 
                    header={isEdit ? 'Actualizar Tarifa' : 'Agregar Tarifa'} 
                    visible={tarifaDialog} 
                    onHide={() => setTarifaDialog(false)}
                    footer= {
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%'}}> 
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary gestor-btn-cancelar" onClick={() => setTarifaDialog(false)} />
                        <Button label="Guardar" icon="pi pi-check" className="gestor-btn-confirmar" onClick={handleSave} /> 
                    </div>
                    }
            >
                        
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="fecha_vigencia">Fecha inicio Vigencia</label>
                        <InputText
                            id="fecha_vigencia"
                            type="date"
                            min={new Date().toISOString().split("T")[0]} // Restringe fechas menores a hoy
                            value={tarifaData.fecha_vigencia}
                            onChange={(e) => setTarifaData({ ...tarifaData, fecha_vigencia: e.target.value })}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="tipo_tarifa">Tipo de Tarifa</label>
                        <Dropdown
                            id="tipo_tarifa"
                            value={tarifaData.tipo_tarifa}
                            options={opcionesTipoTarifa}
                            onChange={(e) => handleTipoTarifaChange(e.value)}
                            placeholder="Tipo de Tarifa"
                            className='dropdown-tipo-tarifa'
                        />
                    </div>
                    <div className="p-field">
    <label htmlFor="importe">{tarifaData.tipo_tarifa === 'Vuelo' ? 'Importe por hora de vuelo' : 'Importe por litro'}</label>
    <InputText
        id="importe"
        value={tarifaData.importe}
        onChange={(e) => handleImporteChange(e.target.value)}
        placeholder="Importe"
    />
</div>
{tarifaData.tipo_tarifa === 'Vuelo' && (
    <div className="p-field">
        <label htmlFor="importe_por_instruccion">Importe por Instrucción (15%):</label>
        <InputText
            id="importe_por_instruccion"
            value={tarifaData.importe_por_instruccion}
            onChange={(e) => setTarifaData({ ...tarifaData, importe_por_instruccion: e.target.value })}
            placeholder="Importe por instrucción"
        />
    </div>
)}


                    {tarifaData.tipo_tarifa === 'Vuelo' && (
                        <>
                           
                            {/* Campos generales del vuelo */}
                            <div className="p-field">
                                <label>Aeronaves:</label>
                                    {aeronaves && aeronaves.length > 0 ? (
                                    <MultiSelect
                                        id="aeronaves"
                                        value={aeronavesSeleccionado}
                                        options={aeronaves}
                                        onChange={(e) => {
                                            // Extraer saolo los id_aeronave seleccionados
                                            const idsAeronavesSeleccionadas = e.value.map(aeronave => aeronave.id_aeronave);
                                    
                                            // Actualizar el estado con las aeronaves seleccionadas
                                            setAeronavesSeleccionado(e.value);
                                    
                                            // Guardar los id_aeronave seleccionados como una cadena separada por comas
                                            setTarifaData({ 
                                                ...tarifaData, 
                                                aeronaves: idsAeronavesSeleccionadas.join(',') 
                                            });
                                        }}
                                        optionLabel="matricula"  // Mostrar matricula, pero guardar id_aeronave
                                        placeholder="Seleccione Aeronaves"
                                        display="chip"
                                        filter
                                        showClear
                                        filterBy="matricula"
                                        maxSelectedLabels={5}
                                    />
                                        ) : (
                                            <p>No hay aeronaves disponibles.</p>
                                        )}
                            </div>

                        </>
                    )}
                    
                </div>
            </Dialog>

            <Dialog
                header="Confirmación"
                visible={deleteDialog}
                onHide={() => setDeleteDialog(false)}
                style={{ width: '400px' }}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '1rem' }}>
                        <Button className='gestor-btn-confirmar' label="Cancelar" icon="pi pi-times" onClick={() => setDeleteDialog(false)}/>
                        <Button className='p-button-secondary gestor-btn-cancelar' style={{marginRight: '0'}} label="Eliminar" icon="pi pi-check" onClick={handleDelete}/>
                    </div>
                }>
                <p>¿Está seguro que desea eliminar esta tarifa?</p>
            </Dialog>



        </div>
    );
};

export default TarifaCrud;
