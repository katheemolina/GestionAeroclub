import React, { useEffect, useState } from 'react';
import './Styles/GestorCuentaCorriente.css'
import { obtenerTodosLosMovimientos } from '../../services/movimientosApi';
// import FiltroComponent from '../../components/FiltroComponent';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import '../../styles/datatable-style.css'

function GestorRecibos({idUsuario = 0}){

    const columns = [
      { name: 'Fecha', selector: row => row.fecha, sortable: true },
      { name: 'Usuario', selector: row => row.usuario, sortable: true },
      { name: 'Tipo de Movimiento', selector: row => row.tipo, sortable: true },
      { name: 'Importe', selector: row => row.importe, sortable: true },
      { name: 'Recibo', selector: row => row.numero_recibo, sortable: true },
    ]

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
        try {
            // Obtener vuelos
            const movimientosResponse = await obtenerTodosLosMovimientos(idUsuario);
            setData(movimientosResponse);
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
          <h1>Todos Los Movimientos</h1>
        </header>
        {/* <FiltroComponent
        mostrarUsuario={true} // Cambia a false si no quieres mostrar el filtro de usuario
        mostrarFecha={true} // Cambia a false si no quieres mostrar los filtros de fecha
        onBuscar={(filtros) => {console.log('Filtros aplicados:', filtros); // Aquí puedes hacer algo con los datos filtrados, como realizar una búsqueda
        }}/> */}     
        <DataTable 
          value={data} 
          paginator rows={15} 
          rowsPerPageOptions={[10, 15, 25, 50]} 
          removableSort 
          filterDisplay="row"
          scrollable
          scrollHeight="800px"
          >
          <Column field="fecha" header="Fecha" sortable filter filterPlaceholder="Buscar por fecha"  filterMatchMode="contains" dataType="date" showFilterMenu={false}  ></Column>
          <Column field="usuario" header="Usuario" sortable filter filterPlaceholder="Busar por usuario" filterMatchMode="contains" showFilterMenu={false}  ></Column>
          <Column field="tipo" header="Tipo de movimiento" sortable filter filterPlaceholder="Buscar por tipo" filterMatchMode="contains" showFilterMenu={false}  ></Column>
          <Column field="importe" header="Importe" sortable filter filterPlaceholder="Buscar por importe" filterMatchMode="contains" showFilterMenu={false} ></Column>
          <Column field="numero_recibo" header="Recibo" sortable filter filterPlaceholder="Buscar por recibo" filterMatchMode="contains" showFilterMenu={false} ></Column>
        </DataTable>
      </div>
    );
}

export default GestorRecibos;