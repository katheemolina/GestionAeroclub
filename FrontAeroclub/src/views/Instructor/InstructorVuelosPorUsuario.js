import React, { useEffect, useState } from 'react';
import { obtenerTodosLosItinerarios } from '../../services/vuelosApi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useLocation } from 'react-router-dom';

function InstructorVuelosPorUsuario({idUsuario = 1}){
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const location = useLocation();  // Hook para obtener el estado de la navegación
    const { user } = location.state || {};  // Accedemos al estado pasad
    
    const [filters, setFilters] = useState({
        'usuario': { value: user.usuario, matchMode: 'contains' },
      });

    useEffect(() => {
        const fetchData = async () => {
        try {
            // Obtener vuelos
            const vuelosResponse = await obtenerTodosLosItinerarios();
            setData(vuelosResponse);
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
        setLoading(false); // Cambia el estado de carga
        };

        fetchData();
    }, [idUsuario]);
    
    if (loading) {
        return <div className="background"><div>Cargando...</div></div>; // Muestra un mensaje de carga mientras esperas los datos
    }
    return (
        <div className="background">
        <header className="header">
          <h1>Vuelos</h1>
        </header>
        <DataTable 
        value={data} 
        paginator rows={15} 
        rowsPerPageOptions={[10, 15, 25, 50]} 
        removableSort 
        filters={filters}
        filterDisplay="row"
        scrollable
        scrollHeight="800px"
        >
        <Column field="fecha" header="Fecha" sortable filter filterPlaceholder="Buscar por fecha"  filterMatchMode="contains" dataType="date" showFilterMenu={false}  ></Column>
        <Column field="aeronave" header="Aeronave" sortable filter filterPlaceholder="Busar por aeronave" filterMatchMode="contains" showFilterMenu={false}  ></Column>
        <Column field="usuario" header="Usuario" sortable filter value='asd' filterPlaceholder="Buscar por usuario" filterMatchMode="contains" showFilterMenu={false}  ></Column>
        <Column field="origen" header="Origen" sortable filter filterPlaceholder="Busar por usuario" filterMatchMode="contains" showFilterMenu={false}  ></Column>
        <Column field="destino" header="Destino" sortable filter filterPlaceholder="Buscar por número" filterMatchMode="contains" showFilterMenu={false}  ></Column>
        <Column field="tiempo_vuelo" header="Tiempo" sortable filter filterPlaceholder="Buscar por tiempo de vuelo" filterMatchMode="contains" showFilterMenu={false}  ></Column>
        <Column field="instruccion" header="Instruccion" sortable filter filterPlaceholder="Buscar por instruccion" filterMatchMode="contains" showFilterMenu={false}  ></Column>
      </DataTable>
      </div>
    );
}

export default InstructorVuelosPorUsuario;