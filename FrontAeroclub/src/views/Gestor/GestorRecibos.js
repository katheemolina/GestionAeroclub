import React, { useEffect, useState } from 'react';
import TableComponent from "../../components/TableComponent"
import '../../styles/Gestor_styles/GestorRecibos.css'
import { obtenerTodosLosRecibos } from '../../services/recibosApi';
import FiltroComponent from '../../components/FiltroComponent';

function GestorRecibos({idUsuario = 0}){

    const columns = [
        { header: 'Fecha', accessor: 'fecha' },
        { header: 'Usuario', accessor: 'usuario' },
        { header: 'N° Recibo', accessor: 'numero_recibo' },
        { header: 'Tipo de Recibo', accessor: 'tipo_recibo' },
        { header: 'Importe', accessor: 'importe' }
      ];

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
        try {
            // Obtener vuelos
            const recibosResponse = await obtenerTodosLosRecibos(idUsuario);
            setData(recibosResponse);
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
          <h1>Recibos</h1>
        </header>
        <div className="nuevo-recibo-btn"> Nuevo </div>
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