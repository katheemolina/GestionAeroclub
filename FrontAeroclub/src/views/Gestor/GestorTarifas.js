import React, { useState, useEffect } from 'react';
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
        fecha_vigencia: '',
        tipo_tarifa: '',
        importe: '',
        importe_por_instruccion: 0,
        con_instructor: false,
    });
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(true);

    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedTarifa, setSelectedTarifa] = useState(null);



    const opcionesTipoTarifa = [
        { label: 'Vuelo', value: 'Vuelo' },
        { label: 'Combustible', value: 'Combustible' },
    ];

    // Fetch tarifas data from the API
    const fetchTarifas = async () => {
        try {
            const data = await obtenerTarifas();
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
            console.log("Datos a guardar:", tarifaData); // Agrega este console.log
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
            fecha_vigencia: formattedDate, // Set the date to today
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
        if (tarifaData.tipo_tarifa === 'Vuelo' && tarifaData.con_instructor) {
            updatedData.importe_por_instruccion = (importe * 0.15).toFixed(2);
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
    const dateBodyTemplate = (rowData) => {
        return <span>{rowData.fecha_vigencia}</span>;
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
    
    

    if (loading) {
        return <PantallaCarga/>
    }
    return (
        <div className="background">
            <ToastContainer />
            <header className="header">
                <h1>Tarifas</h1>
            </header>
            <Button className="nuevo" label="Agregar Tarifa" onClick={handleAdd} />
            <DataTable 
                value={tarifas} 
                paginator rows={10} 
                rowsPerPageOptions={[5, 10, 25]} 
                style={{ width: '100%' }} >
                <Column field="fecha_vigencia" header="Fecha Vigencia" body={dateBodyTemplate}></Column>
                <Column field="tipo_tarifa" header="Tipo Tarifa"></Column>
                <Column field="importe" header="Importe" body={amountBodyTemplate}></Column>
                <Column field="importe_por_instruccion" header="Importe por instruccion" body={importeInstruccionBodyTemplate}></Column>
                <Column field="AeronavesMatri" header="Aeronaves" ></Column>

                <Column 
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

            <Dialog header={isEdit ? 'Actualizar Tarifa' : 'Agregar Tarifa'} visible={tarifaDialog} onHide={() => setTarifaDialog(false)}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="fecha_vigencia">Fecha Vigencia</label>
                        <InputText
                            id="fecha_vigencia"
                            type="date"
                            value={tarifaData.fecha_vigencia}
                            onChange={(e) => setTarifaData({ ...tarifaData, fecha_vigencia: e.target.value })}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="tipo_tarifa">Tipo Tarifa</label>
                        <Dropdown
                            id="tipo_tarifa"
                            value={tarifaData.tipo_tarifa}
                            options={opcionesTipoTarifa}
                            onChange={(e) => handleTipoTarifaChange(e.value)}
                            placeholder="Tipo de Tarifa"
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
            <>
                <div className="p-field">
                    <Checkbox
                        inputId="con_instructor"
                        checked={tarifaData.con_instructor}
                        onChange={(e) => handleInstructorCheck(e.checked)}
                    />
                    <label htmlFor="con_instructor">¿Con Instructor?</label>
                </div>
                <div className="p-field">
                    <label htmlFor="importe_por_instruccion">Importe por Instrucción</label>
                    <InputText
                        id="importe_por_instruccion"
                        value={tarifaData.importe_por_instruccion}
                        disabled
                    />
                </div>
                {/* Campos generales del vuelo */}
                <div className="p-field">
    <label>Aeronaves:</label>
    {aeronaves && aeronaves.length > 0 ? (
        <MultiSelect
        id="aeronaves"
        value={aeronavesSeleccionado}
        options={aeronaves}
        onChange={(e) => {
            // Extraer solo los id_aeronave seleccionados
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
                    <div className="p-d-flex p-jc-end">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={() => setTarifaDialog(false)} />
                        <Button label="Guardar" icon="pi pi-check" onClick={handleSave} />
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
                        <Button label="Cancelar" icon="pi pi-times" onClick={() => setDeleteDialog(false)} className="p-button-text" />
                        <Button label="Eliminar" icon="pi pi-check" onClick={handleDelete} className="p-button-danger" />
                    </div>
                }>
                <p>¿Está seguro que desea eliminar esta tarifa?</p>
            </Dialog>


        </div>
    );
};

export default TarifaCrud;
