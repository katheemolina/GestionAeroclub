import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { obtenerTarifas } from '../../services/tarifasApi'; 
import '../../styles/datatable-style.css'; 
import './Styles/GestorTarifas.css';
import PantallaCarga from '../../components/PantallaCarga';
import { Button } from 'primereact/button';

const AsociadoTarifas = () => {
    const [tarifas, setTarifas] = useState([]);
    const [loading, setLoading] = useState(true);

    const filterVigentes = (tarifas) => {
        const today = new Date();
        return tarifas.filter(tarifa => {
            const fechaVigenciaDesde = new Date(tarifa.fecha_vigencia_desde);
            const fechaVigenciaHasta = tarifa.fecha_vigencia_hasta ? new Date(tarifa.fecha_vigencia_hasta) : null;
    
            // Si la fecha de inicio es válida y la fecha de fin es nula, significa que sigue vigente.
            // Si la fecha de fin no es nula, evaluamos que esté dentro del rango actual.
            return fechaVigenciaDesde <= today && (fechaVigenciaHasta === null || fechaVigenciaHasta >= today);
        });
    };
    

// Fetch tarifas data from the API
const fetchTarifas = async () => {
    try {
        const data = await obtenerTarifas();
        //console.log("Tarifas:", data)
        const tarifasFiltradas = filterVigentes(data.data); // Filtra las tarifas vigentes
        setTarifas(tarifasFiltradas);
        //console.log("Tarifas filtradas:", tarifasFiltradas);
    } catch (error) {
        console.error('Error fetching tarifas:', error);
    }
    setLoading(false);
};


    useEffect(() => {
        fetchTarifas();
    }, []);


    //CHECKEAR SU FUNCIONALIDAD
    const dateBodyTemplate = (rowData) => {
        if (!rowData.fecha_vigencia_desde) return ''; 
    
        // Convertir la fecha recibida a un formato sin hora
        const fechaString = rowData.fecha_vigencia_desde;
        
        // Asegúrate de que la fecha esté en el formato adecuado, esto lo realizo por la zonas horarias
        const [year, month, day] = fechaString.split('-');
        const fecha = new Date(year, month - 1, day);  // Año, mes (0-11), día
        
        // Verifica si la fecha es válida
        if (isNaN(fecha)) return ''; 
    
        const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones); 
        return <span>{fechaFormateada}</span>;
    };
    
    
    

    const amountBodyTemplate = (rowData) => {
        return <span>${rowData.importe}</span>;
    };

    const importeInstruccionBodyTemplate = (rowData) => {
        const importePorInstruccion = parseFloat(rowData.importe_por_instruccion);
        if (rowData && (rowData.tipo_tarifa.toLowerCase() === 'combustible' || importePorInstruccion === 0)) {
            return "No aplica";
        }
        return <span>${rowData?.importe_por_instruccion || ''}</span>;
    };

    const dt = useRef(null);
    const clearFilters = () => {
      if (dt.current) {
        dt.current.reset(); 
      }
    };

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
                <Column field="fecha_vigencia_desde" header="Fecha Vigencia" body={dateBodyTemplate} sortable filter showFilterMenu={false} filterType='date'/>
                <Column field="tipo_tarifa" header="Tipo Tarifa" sortable filter showFilterMenu={false} filterPlaceholder="Buscar por Tarifa" filterMatchMode="contains"></Column>
                <Column field="importe" header="Importe" body={amountBodyTemplate} sortable filter showFilterMenu={false} filterPlaceholder="Buscar por Importe" filterMatchMode="contains"/>
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
