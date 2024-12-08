import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { obtenerTarifas } from '../../services/tarifasApi'; // Import the API functions
import '../../styles/datatable-style.css'; // Estilado para la tabla
import './Styles/GestorTarifas.css';
import PantallaCarga from '../../components/PantallaCarga';
import { Button } from 'primereact/button';

const AsociadoTarifas = () => {
    const [tarifas, setTarifas] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch tarifas data from the API
    const fetchTarifas = async () => {
        try {
            const data = await obtenerTarifas();
            setTarifas(data.data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching tarifas:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTarifas();
    }, []);

    // Column definitions
    

    const dateBodyTemplate = (rowData) => {
        if (!rowData.fecha_vigencia) return ''; // Para manejar valores nulos o indefinidos
    
        
        const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const fechaFormateada = new Date(rowData.fecha_vigencia).toLocaleDateString('es-ES', opciones); // Formatear la fecha a DD/MM/AAAA
    
        return <span>{fechaFormateada}</span>;
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

    const dt = useRef(null);
    const clearFilters = () => {
      if (dt.current) {
        dt.current.reset(); // Limpia los filtros de la tabla
      }
      }

    if (loading) {
        return <PantallaCarga />;
    }

    return (
        <div className="background">
            <header className="header">
                <h1>Tarifas</h1>
            </header>
            <DataTable 
                ref={dt}
                filterDisplay='row'
                value={tarifas} 
                paginator 
                rows={10} 
                rowsPerPageOptions={[5, 10, 25]} 
                style={{ width: '100%' }} >
                <Column field="fecha_vigencia" header="Fecha Vigencia" body={dateBodyTemplate} sortable filter showFilterMenu={false} filterType='date'/>
                <Column field="tipo_tarifa" header="Tipo Tarifa" sortable filter showFilterMenu={false} filterPlaceholder="Buscar por Tarifa" filterMatchMode="contains"></Column>
                <Column field="importe" header="Importe" body={amountBodyTemplate} sortable filter showFilterMenu={false} filterPlaceholder="Buscar por Importe" filterMatchMode="contains"/>
                {/* Aplicamos la función de personalización en la columna de Importe por Instrucción */}
                <Column field="importe_por_instruccion" header="Importe por instruccion" body={importeInstruccionBodyTemplate} sortable filter showFilterMenu={false} filterPlaceholder="Buscar por instruccion" filterMatchMode="contains"/>
                <Column field="AeronavesMatri" header="Aeronaves" sortable filter showFilterMenu={false} filterPlaceholder="Buscar por Aeronave" filterMatchMode="contains"/>
                <Column
                    header={"Acciones"}
                    filter
                    showFilterMenu={false}
                    filterElement={
                        <Button
                        label="Limpiar"
                        onClick={clearFilters}
                        style={{ width: '100%', height: '40px',  padding: '10px'}}
                        />
                        }
                />
            </DataTable>
        </div>
    );
};

export default AsociadoTarifas;
