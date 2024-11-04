import React, { useEffect, useState } from 'react';
import "../../styles/background.css"
import "./Styles/AsociadoLibroVuelo.css"
import TableComponent from "../../components/TableComponent"
import { obtenerLibroDeVueloPorUsuario } from '../../services/vuelosApi';

function InstructorLibroVuelo({ idUsuario = 3 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const columns = [
    { header: 'Fecha', accessor: 'fecha' },
    { header: 'Origen', accessor: 'origen' },
    { header: 'Destino', accessor: 'destino' },
    { header: 'Hora de Inicio', accessor: 'hora_salida' },
    { header: 'Hora de Llegada', accessor: 'hora_llegada' },
    { header: 'Tiempo de Vuelo', accessor: 'tiempo_vuelo' },
    { header: 'Finalidad', accessor: 'finalidad' },
    { header: 'Matricula', accessor: 'matricula' },
    { header: 'Instruccion', accessor: 'instruccion' },
    { header: 'Cant. Aterrizajes', accessor: 'aterrizajes' },
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
      <TableComponent columns={columns} data={data} />
    </div>
  );
}

export default InstructorLibroVuelo;