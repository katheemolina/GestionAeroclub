import React, { useEffect, useState } from 'react';
import './Styles/InstructorAsociados.css';
import { listarAsociados } from '../../services/usuariosApi';
import FiltroComponent from '../../components/FiltroComponent';
import DataTable from 'react-data-table-component';
import estiloTabla from '../../styles/estiloTabla';

function InstructorAsociados({idUsuario = 0}){
    
    const columns = [
      { name: 'Usuario', selector: row => row.usuario, sortable: true },
      { name: 'Fecha Vencimiento CMA', selector: row => row.fecha_vencimiento_cma, sortable: true },
      { name: 'Estado CC', selector: row => row.estado_cuenta_corriente, sortable: true },
      { name: 'Saldo', selector: row => row.saldo, sortable: true },
    ]

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

export default InstructorAsociados;