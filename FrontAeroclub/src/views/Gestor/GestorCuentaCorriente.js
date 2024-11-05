import React, { useEffect, useState } from 'react';
import './Styles/GestorCuentaCorriente.css'
import { obtenerTodosLosMovimientos } from '../../services/movimientosApi';
import FiltroComponent from '../../components/FiltroComponent';
import DataTable from 'react-data-table-component';
import estiloTabla from '../../styles/estiloTabla';

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
        <FiltroComponent
        mostrarUsuario={true} // Cambia a false si no quieres mostrar el filtro de usuario
        mostrarFecha={true} // Cambia a false si no quieres mostrar los filtros de fecha
        onBuscar={(filtros) => {console.log('Filtros aplicados:', filtros); // Aquí puedes hacer algo con los datos filtrados, como realizar una búsqueda
        }}/>
        
        <DataTable  
          columns={columns} 
          data={data} 
          pagination 
          highlightOnHover 
          striped 
          selectableRows
          paginationPerPage={15}
          customStyles={estiloTabla}
        />
      </div>
    );
}

export default GestorRecibos;