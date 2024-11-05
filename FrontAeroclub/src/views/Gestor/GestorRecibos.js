import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Styles/GestorRecibos.css'
import estiloTabla from '../../styles/estiloTabla';
import { obtenerTodosLosRecibos } from '../../services/recibosApi';
import FiltroComponent from '../../components/FiltroComponent';
import DataTable from 'react-data-table-component';

function GestorRecibos({idUsuario = 0}){

    const columns = [
      { name: 'Fecha', selector: row => row.fecha, sortable: true },
      { name: 'Usuario', selector: row => row.Usuario, sortable: true },
      { name: 'N° Recibo', selector: row => row.numero_recibo, sortable: true },
      { name: 'Tipo de Recibo', selector: row => row.tipo_recibo, sortable: true },
      { name: 'Importe', selector: row => row.importe, sortable: true },
    ]

    
    
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
        try {
            // Obtener recibos
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
        <Link to="/gestor/recibos/nuevo" className="nuevo-recibo-btn">Nuevo</Link>
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