import React, { useEffect, useState } from 'react';
import "./Styles/AsociadoLibroVuelo.css"
import { obtenerLibroDeVueloPorUsuario } from '../../services/vuelosApi';
import FiltroComponent from '../../components/FiltroComponent';
import DataTable from 'react-data-table-component';
import estiloTabla from '../../styles/estiloTabla';

function AsociadoLibroVuelo({ idUsuario = 3 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const columns = [
    { name: 'Fecha', selector: row => row.fecha, sortable: true },
    { name: 'Origen', selector: row => row.origen, sortable: true },
    { name: 'Destino', selector: row => row.destino, sortable: true },
    { name: 'Hora de Inicio', selector: row => row.hora_salida, sortable: true },
    { name: 'Hora de Llegada', selector: row => row.hora_llegada, sortable: true },
    { name: 'Tiempo de Vuelo', selector: row => row.tiempo_vuelo, sortable: true },
    { name: 'Finalidad', selector: row => row.finalidad, sortable: true },
    { name: 'Matricula', selector: row => row.matricula, sortable: true },
    { header: 'Instruccion', accessor: 'instruccion' },
    { header: 'Cant. Aterrizajes', accessor: 'aterrizajes' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener vuelos
        const vuelosResponse = await obtenerLibroDeVueloPorUsuario(idUsuario);
        setData(vuelosResponse); // Suponiendo que los datos son directamente utilizables

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
      <div className="titulo-btn">
        <header className="header">
          <h1>Libro de Vuelo</h1>
        </header>
      </div>
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

export default AsociadoLibroVuelo;
