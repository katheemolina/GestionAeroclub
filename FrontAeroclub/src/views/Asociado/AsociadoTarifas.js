import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { obtenerTarifas, insertarTarifa, actualizarTarifa } from '../../services/tarifasApi'; // Import the API functions
import '../../styles/datatable-style.css'; //Estilado para la tabla
import './Styles/GestorTarifas.css'

const AsociadoTarifas = () => {
    const [tarifas, setTarifas] = useState([]);


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
            <DataTable 
              value={tarifas} 
              paginator rows={10} 
              rowsPerPageOptions={[5, 10, 25]} 
              style={{ width: '100%' }} >
                <Column field="fecha_vigencia" header="Fecha Vigencia" body={dateBodyTemplate}></Column>
                <Column field="tipo_tarifa" header="Tipo Tarifa"></Column>
                <Column field="importe" header="Importe" body={amountBodyTemplate}></Column>
            </DataTable>
        </div>
    );
};

export default AsociadoTarifas;
