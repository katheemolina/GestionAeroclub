import React, { useEffect, useState } from 'react';
import TableComponent from "../../components/TableComponent"
import './Styles/GestorCuentaCorriente.css'
import { obtenerTodosLosMovimientos } from '../../services/movimientosApi';
import FiltroComponent from '../../components/FiltroComponent';

function GestorRecibos({idUsuario = 0}){
    const columns = [
        { header: 'Fecha', accessor: 'fecha' },
        { header: 'Usuario', accessor: 'usuario' },
        { header: 'Tipo de Movimiento', accessor: 'tipo' },
        { header: 'Importe', accessor: 'importe' },
        { header: 'Recibo', accessor: 'numero_recibo' }
      ];

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
        <TableComponent columns={columns} data={data} />
      </div>
    );
}

export default GestorRecibos;