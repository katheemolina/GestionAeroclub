import React, { useEffect, useState } from 'react';
import TableComponent from "../../components/TableComponent"
import './Styles/GestorAsociados.css'
import { listarAsociados } from '../../services/usuariosApi';
import FiltroComponent from '../../components/FiltroComponent';

function GestorAsociados({idUsuario = 0}){
    const columns = [
        { header: 'Usuario', accessor: 'usuario' },
        { header: 'Fecha Vencimiento CMA', accessor: 'fecha_vencimiento_cma' },
        { header: 'Estado CC', accessor: 'estado_cuenta_corriente' },
        { header: 'Saldo', accessor: 'saldo' }
      ];

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
        try {
            // Obtener vuelos
            const asociadosResponse = await listarAsociados(idUsuario);
            setData(asociadosResponse);
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
          <h1>Asociados</h1>
        </header>
        <FiltroComponent
        mostrarUsuario={true} // Cambia a false si no quieres mostrar el filtro de usuario
        mostrarFecha={false} // Cambia a false si no quieres mostrar los filtros de fecha
        onBuscar={(filtros) => {console.log('Filtros aplicados:', filtros); // Aquí puedes hacer algo con los datos filtrados, como realizar una búsqueda
        }}/>
        <TableComponent columns={columns} data={data} />
      </div>
    );
}

export default GestorAsociados;