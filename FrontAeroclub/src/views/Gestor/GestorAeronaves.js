import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { obtenerAeronaves, insertarAeronave, actualizarAeronave } from '../../services/aeronavesApi'; // Cambia a las APIs de aeronaves
import '../../styles/datatable-style.css';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import './Styles/GestorAeronaves.css';

import SearchIcon from '@mui/icons-material/Search'; //icono de detalles
import { Card } from 'primereact/card';
import PantallaCarga from '../../components/PantallaCarga';


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
        horas_para_inspeccion: '',
        horas_historicas_voladas: '',
        estado: 'activo',
    });
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch aeronaves data from the API
    const fetchAeronaves = async () => {
        try {
            const data = await obtenerAeronaves(); // Asumiendo que ya es el array de aeronaves
            setAeronaves(data);
        } catch (error) {
            console.error('Error fetching aeronaves:', error);
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
            } else {
                await insertarAeronave(aeronaveData);
            }
            setAeronaveDialog(false);
            fetchAeronaves(); // Refresh the list
        } catch (error) {
            console.error('Error saving aeronave:', error);
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
            horas_para_inspeccion: '',
            horas_historicas_voladas: '',
            estado: 'activo',
        });
        setIsEdit(false);
        setAeronaveDialog(true);
    };

    // Column definitions
    const consumoTemplate = (rowData) => {
        return <span>{rowData.consumo_por_hora} L/hr</span>;
    };

    const dateTemplate = (rowData) => {
        return <span>{rowData.fecha_adquisicion}</span>;
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

    if (loading) {
        return <PantallaCarga />
    }
    return (
        <div className="background">
            <header className="header">
                <h1>Aeronaves</h1>
            </header>
            <Button className="nuevo" label="Agregar Aeronave" onClick={handleAdd} />
            <DataTable 
                value={aeronaves} 
                paginator rows={10} 
                rowsPerPageOptions={[5, 10, 25]} 
                style={{ width: '100%' }} >
                {/* <Column field="marca" header="Marca"></Column> */}
                <Column field="modelo" header="Modelo"></Column>
                <Column field="matricula" header="Matrícula"></Column>
                {/* <Column field="potencia" header="Potencia (HP)"></Column> */}
                <Column field="clase" header="Clase"></Column>
                {/* <Column field="fecha_adquisicion" header="Fecha Adquisición" body={dateTemplate}></Column> */}
                {/* <Column field="consumo_por_hora" header="Consumo por Hora" body={consumoTemplate}></Column> */}
                {/* <Column field="horas_historicas_voladas" header="Horas de vuelo" ></Column>*/}
                {/*<Column field="horas_para_inspeccion" header="Horas para inspeccion" ></Column> */}
                <Column field="estado" header="Estado"></Column>
                <Column header="Acciones" 
                    body={(rowData) => (
                    <div className='acciones'>
                        <Tooltip title="Editar">
                        <IconButton color="primary" aria-label="edit" onClick={() => handleEdit(rowData)}>
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
                        <label htmlFor="horas_para_inspeccion">Horas para inspección</label>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <InputText
                                id="horas"
                                type="number"
                                value={aeronaveData.horas}
                                onChange={(e) => setAeronaveData({ ...aeronaveData, horas: e.target.value })}
                                placeholder="Horas"
                                min="0"
                            />
                            <InputText
                                id="minutos"
                                type="number"
                                value={aeronaveData.minutos}
                                onChange={(e) => setAeronaveData({ ...aeronaveData, minutos: e.target.value })}
                                placeholder="Minutos"
                                min="0"
                                max="59"
                            />
                        </div>
                    </div>
                    <div className="p-field">
                        <label htmlFor="horas_historicas_voladas">Horas de vuelo históricas</label>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <InputText
                                id="horas_historicas"
                                type="number"
                                value={aeronaveData.horas_historicas || ''}
                                onChange={(e) => setAeronaveData({ ...aeronaveData, horas_historicas: e.target.value })}
                                placeholder="Horas"
                                min="0"
                            />
                            <InputText
                                id="minutos_historicos"
                                type="number"
                                value={aeronaveData.minutos_historicos || ''}
                                onChange={(e) => setAeronaveData({ ...aeronaveData, minutos_historicos: e.target.value })}
                                placeholder="Minutos"
                                min="0"
                                max="59"
                            />
                        </div>
                    </div>
                    <div className="p-d-flex p-jc-end">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={() => setAeronaveDialog(false)} />
                        <Button label="Guardar" icon="pi pi-check" id="btn-guardar" onClick={handleSave} />
                    </div>
                </div>
            </Dialog>

            <Dialog header="Detalles de la Aeronave" visible={dialogVisible} style={{ width: '400px' }} onHide={closeDialog}>
                {selectedRowData && (
                <div>
                    <div className='p-fluid details-dialog'>
                        <Card>
                            <p><strong>Marca:</strong> </p>
                            <p>{selectedRowData.marca}</p>
                        </Card>
                        <Card>
                            <p><strong>Modelo:</strong> {selectedRowData.modelo}</p>
                        </Card>
                        <Card>
                            <p><strong>Matrícula:</strong> {selectedRowData.matricula}</p>
                        </Card>
                        <Card> 
                            <p><strong>Potencia en HP:</strong> {selectedRowData.potencia}</p>
                        </Card>

                        <Card> 
                            <p><strong>Fecha de adquisición:</strong> {selectedRowData.fecha_adquisicion}</p>
                        </Card>
                        
                        <Card> 
                            <p><strong>Consumo por hora:</strong> {selectedRowData.consumo_por_hora}</p>
                        </Card>

                        <Card> 
                            <p><strong>Horas de vuelo:</strong> {selectedRowData.horas_historicas_voladas}</p>
                        </Card>
                        
                        <Card> 
                            <p><strong>Horas para inspección:</strong> {selectedRowData.horas_para_inspeccion}</p>
                        </Card>
                        
                        <Card> 
                            <p><strong>Clase:</strong> {selectedRowData.clase}</p>
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
