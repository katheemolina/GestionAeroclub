import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import '../../styles/Instructor_styles/InstructorLibroVuelo.css';
import TableComponent from '../../components/TableComponent';

function InstructorLibroVuelo() {

  /*
  const [vuelos, setVuelos] = useState([]); // Estado para almacenar datos de vuelos

  useEffect(() => {
    const fetchVuelos = async () => {
      try {
        const response = await fetch('URL_DEL_BACKEND'); // Reemplaza con la URL real
        const data = await response.json();
        setVuelos(data); // Actualizamos el estado con los datos obtenidos
      } catch (error) {
        console.error('Error fetching vuelos:', error);
      }
    };

    fetchVuelos();
  }, []);
  */


  //Ejemplos:
  const vuelos = [
    { fecha: '2024-09-25', origen: 'Lincoln', destino: 'C. Sarmiento', inicio: '08:00', llegada: '10:00', tiempo: '2h', finalidad: 'Travesía', matricula: 'LV-C172', instruccion: 'Si', aterrizajes: 3 },
    { fecha: '2024-09-28', origen: 'Arrecifes', destino: 'Lincoln', inicio: '09:30', llegada: '12:00', tiempo: '2.5h', finalidad: 'Bautismo', matricula: 'LV-PA28', instruccion: 'No', aterrizajes: 1 },
  ];

  const columns = [
    { header: 'Fecha', accessor: 'fecha' },
    { header: 'Origen', accessor: 'origen' },
    { header: 'Destino', accessor: 'destino' },
    { header: 'Hr inicio', accessor: 'inicio' },
    { header: 'Hr llegada', accessor: 'llegada' },
    { header: 'Hs de vuelo', accessor: 'tiempo' },
    { header: 'Finalidad', accessor: 'finalidad' },
    { header: 'Matrícula', accessor: 'matricula' },
    { header: 'Instrucción', accessor: 'instruccion' },
    { header: 'Nº aterrizajes', accessor: 'aterrizajes' },
    { header: 'Acciones', accessor: 'acciones' },
  ];

  const vuelosConAcciones = vuelos.map((vuelo) => ({
    ...vuelo,
    acciones: (
      <>
        <button className="icon-btn edit-btn">
          <FaEdit />
        </button>
        <button className="icon-btn delete-btn">
          <FaTrash />
        </button>
      </>
    ),
  }));

  return (
    <div className="libro-vuelo-container">
      <div className="libro-vuelo-header">
        <h1>Libro de Vuelo</h1>
        <button className="agregar-vuelo-btn">Agregar vuelo</button>
      </div>
      <TableComponent columns={columns} data={vuelosConAcciones} />
    </div>
  );
}

export default InstructorLibroVuelo;