import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { obtenerAeronaves} from '../../services/aeronavesApi'; // Cambia a las APIs de aeronaves
import '../../styles/datatable-style.css';
import './Styles/GestorAeronaves.css';

const AsociadoAeronaves = () => {
    const [aeronaves, setAeronaves] = useState([]);

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
            </DataTable>
        </div>
    );
};

export default AsociadoAeronaves;