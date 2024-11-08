import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { obtenerTarifas, insertarTarifa, actualizarTarifa } from '../../services/tarifasApi'; // Import the API functions
import '../../styles/datatable-style.css'; //Estilado para la tabla
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import './Styles/GestorTarifas.css'

const TarifaCrud = () => {
    const [tarifas, setTarifas] = useState([]);
    const [tarifaDialog, setTarifaDialog] = useState(false);
    const [tarifaData, setTarifaData] = useState({
        fecha_vigencia: '',
        tipo_tarifa: '',
        importe: '',
        importe_por_instruccion: '',
    });
    const [isEdit, setIsEdit] = useState(false);

    // Fetch tarifas data from the API
    const fetchTarifas = async () => {
        try {
            const data = await obtenerTarifas();
            setTarifas(data.data);
        } catch (error) {
            console.error('Error fetching tarifas:', error);
        }
    };

    useEffect(() => {
        fetchTarifas();
    }, []);

    // Handle adding or updating tarifa
    const handleSave = async () => {
        try {
            if (isEdit) {
                await actualizarTarifa(tarifaData.id_tarifa, tarifaData);
            } else {
                await insertarTarifa(tarifaData);
            }
            setTarifaDialog(false);
            fetchTarifas(); // Refresh the list
        } catch (error) {
            console.error('Error saving tarifa:', error);
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
        setTarifaData({
            fecha_vigencia: '',
            tipo_tarifa: '',
            importe: '',
            importe_por_instruccion: '',
        });
        setIsEdit(false);
        setTarifaDialog(true);
    };

    // Column definitions
    const dateBodyTemplate = (rowData) => {
        return <span>{rowData.fecha_vigencia}</span>;
    };

    const amountBodyTemplate = (rowData) => {
        return <span>${rowData.importe}</span>;
    };

    return (
        <div className="background">
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
                <Column header="Acciones" body={(rowData) => (
                    <>
                       <IconButton color="primary" aria-label="edit">
        <EditIcon />
    </IconButton>
                    </>
                )}></Column>
            </DataTable>

            <Dialog header={isEdit ? 'Actualizar Tarifa' : 'Agregar Tarifa'} visible={tarifaDialog} onHide={() => setTarifaDialog(false)}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="fecha_vigencia">Fecha Vigencia</label>
                        <InputText
                            id="fecha_vigencia"
                            value={tarifaData.fecha_vigencia}
                            onChange={(e) => setTarifaData({ ...tarifaData, fecha_vigencia: e.target.value })}
                            placeholder="Fecha de Vigencia"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="tipo_tarifa">Tipo Tarifa</label>
                        <InputText
                            id="tipo_tarifa"
                            value={tarifaData.tipo_tarifa}
                            onChange={(e) => setTarifaData({ ...tarifaData, tipo_tarifa: e.target.value })}
                            placeholder="Tipo de Tarifa"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="importe">Importe</label>
                        <InputText
                            id="importe"
                            value={tarifaData.importe}
                            onChange={(e) => setTarifaData({ ...tarifaData, importe: e.target.value })}
                            placeholder="Importe"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="importe_por_instruccion">Importe por Instrucción</label>
                        <InputText
                            id="importe_por_instruccion"
                            value={tarifaData.importe_por_instruccion}
                            onChange={(e) => setTarifaData({ ...tarifaData, importe_por_instruccion: e.target.value })}
                            placeholder="Importe por Instrucción"
                        />
                    </div>
                    <div className="p-d-flex p-jc-end">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={() => setTarifaDialog(false)} />
                        <Button label="Guardar" icon="pi pi-check" onClick={handleSave} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default TarifaCrud;
