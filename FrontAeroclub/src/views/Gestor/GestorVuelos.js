import React, { useEffect, useState } from 'react';
import TableComponent from "../../components/TableComponent"
import { obtenerTodosLosItinerarios } from '../../services/vuelosApi';
import FiltroComponent from '../../components/FiltroComponent';
import './Styles/GestorVuelos.css'

function GestorVuelos({idUsuario = 1}){

    const columns = [
        { header: 'Fecha', accessor: 'fecha' },
        { header: 'Aeronave', accessor: 'aeronave' },
        { header: 'Usuario', accessor: 'usuario' },
        { header: 'Origen', accessor: 'origen' },
        { header: 'Destino', accessor: 'destino' },
        { header: 'Timepo de Vuelo', accessor: 'tiempo_vuelo' },
        { header: 'Instruccion', accessor: 'instruccion' }
      ];

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
        try {
            // Obtener vuelos
            const vuelosResponse = await obtenerTodosLosItinerarios(idUsuario);
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
        <FiltroComponent
        mostrarUsuario={true} // Cambia a false si no quieres mostrar el filtro de usuario
        mostrarFecha={true} // Cambia a false si no quieres mostrar los filtros de fecha
        onBuscar={(filtros) => {console.log('Filtros aplicados:', filtros); // Aquí puedes hacer algo con los datos filtrados, como realizar una búsqueda
        }}/>
        <TableComponent columns={columns} data={data} />
      </div>
    );
}

export default GestorVuelos;