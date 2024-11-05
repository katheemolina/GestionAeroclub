import React, { useEffect, useState } from 'react';
import "./Styles/AsociadoCuentaCorriente.css"
import { obtenerCuentaCorrientePorUsuario } from '../../services/movimientosApi';
import FiltroComponent from '../../components/FiltroComponent';
import DataTable from 'react-data-table-component';
import estiloTabla from '../../styles/estiloTabla';

function AsociadoCuentaCorriente({ idUsuario = 1 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const columns = [
    { name: 'Fecha', selector: row => row.fecha, sortable: true },
    { name: 'Concepto', selector: row => row.descripcion_completa, sortable: true },
    { name: 'Importe', selector: row => row.importe, sortable: true },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener vuelos
        const cuentaCorrienteResponse = await obtenerCuentaCorrientePorUsuario(idUsuario);
        setData(cuentaCorrienteResponse);
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
        <h1>Cuenta Corriente</h1>
      </header>
      <FiltroComponent
        mostrarUsuario={false} // Cambia a false si no quieres mostrar el filtro de usuario
        mostrarFecha={true} // Cambia a false si no quieres mostrar los filtros de fecha
        onBuscar={(filtros) => {console.log('Filtros aplicados:', filtros); // Aquí puedes hacer algo con los datos filtrados, como realizar una búsqueda
      }}/>
      <DataTable  
          columns={columns} 
          data={data} 
          pagination 
          highlightOnHover 
          striped 
          paginationPerPage={15}
          customStyles={estiloTabla}
        />
    </div>
  );
}

export default AsociadoCuentaCorriente;