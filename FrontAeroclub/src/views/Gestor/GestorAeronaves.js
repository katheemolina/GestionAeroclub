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
import './Styles/GestorAeronaves.css';

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

    // Fetch aeronaves data from the API
    const fetchAeronaves = async () => {
        try {
            const data = await obtenerAeronaves(); // Asumiendo que ya es el array de aeronaves
            setAeronaves(data);
        } catch (error) {
            console.error('Error fetching aeronaves:', error);
        }
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
                <Column field="marca" header="Marca"></Column>
                <Column field="modelo" header="Modelo"></Column>
                <Column field="matricula" header="Matrícula"></Column>
                <Column field="potencia" header="Potencia (HP)"></Column>
                <Column field="clase" header="Clase"></Column>
                <Column field="fecha_adquisicion" header="Fecha Adquisición" body={dateTemplate}></Column>
                <Column field="consumo_por_hora" header="Consumo por Hora" body={consumoTemplate}></Column>
                <Column field="horas_historicas_voladas" header="Horas de vuelo" ></Column>
                <Column field="horas_para_inspeccion" header="Horas para inspeccion" ></Column>
                <Column field="estado" header="Estado"></Column>
                <Column header="Acciones" body={(rowData) => (
                    <IconButton color="primary" aria-label="edit" onClick={() => handleEdit(rowData)}>
                        <EditIcon />
                    </IconButton>
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
                            value={aeronaveData.fecha_adquisicion}
                            onChange={(e) => setAeronaveData({ ...aeronaveData, fecha_adquisicion: e.target.value })}
                            placeholder="Fecha de Adquisición"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="consumo_por_hora">Consumo por Hora (L/hr)</label>
                        <InputText
                            id="consumo_por_hora"
                            value={aeronaveData.consumo_por_hora}
                            onChange={(e) => setAeronaveData({ ...aeronaveData, consumo_por_hora: e.target.value })}
                            placeholder="Consumo por Hora"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="horas_para_inspeccion">Horas para inspeccion</label>
                        <InputText
                            id="horas_para_inspeccion"
                            value={aeronaveData.horas_para_inspeccion}
                            onChange={(e) => setAeronaveData({ ...aeronaveData, horas_para_inspeccion: e.target.value })}
                            placeholder="Consumo por Hora"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="horas_historicas_voladas">Horas de vuelo historicas</label>
                        <InputText
                            id="horas_historicas_voladas"
                            value={aeronaveData.horas_historicas_voladas}
                            onChange={(e) => setAeronaveData({ ...aeronaveData, horas_historicas_voladas: e.target.value })}
                            placeholder="Consumo por Hora"
                        />
                    </div>
                    <div className="p-d-flex p-jc-end">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={() => setAeronaveDialog(false)} />
                        <Button label="Guardar" icon="pi pi-check" id="btn-guardar" onClick={handleSave} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default AeronaveCrud;
