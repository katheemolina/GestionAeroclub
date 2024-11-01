import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import '../../styles/Instructor_styles/InstructorLibroVuelo.css'; // Archivo CSS para personalizar estilos

function InstructorLibroVuelo() {

  /* <<<<<<<<<<<<<<<      iNTEGRACIÓN DE DATOS DESDE EL BACK (gpt)     >>>>>>>>>>>>>>>>

  const [vuelos, setVuelos] = useState([]); // Estado para almacenar vuelos
  
  useEffect(() => {
    const fetchVuelos = async () => {
      try {
        const response = await fetch('URL_DEL_BACKEND'); // Reemplaza con la URL de tu backend
        const data = await response.json();
        setVuelos(data); // Actualiza el estado con los datos recibidos
      } catch (error) {
        console.error('Error fetching vuelos:', error);
      }
    };

    fetchVuelos();
  }, []); // El array vacío significa que se ejecutará una vez al montar el componente

  */




  const vuelos = [
    { fecha: '2024-09-25', origen: 'Lincoln', destino: 'C. Sarmiento', inicio: '08:00', llegada: '10:00', tiempo: '2h', finalidad: 'Travesía', matricula: 'LV-C172', instruccion: 'Si', aterrizajes: 3 },
    { fecha: '2024-09-28', origen: 'Arrecifes', destino: 'Lincoln', inicio: '09:30', llegada: '12:00', tiempo: '2.5h', finalidad: 'Bautismo', matricula: 'LV-PA28', instruccion: 'No', aterrizajes: 1 },
    { fecha: '2024-09-25', origen: 'Lincoln', destino: 'C. Sarmiento', inicio: '08:00', llegada: '10:00', tiempo: '2h', finalidad: 'Instrucción', matricula: 'LV-C172', instruccion: 'Si', aterrizajes: 3 },
    { fecha: '2024-09-28', origen: 'Arrecifes', destino: 'Lincoln', inicio: '09:30', llegada: '12:00', tiempo: '2.5h', finalidad: 'Bautismo', matricula: 'LV-PA28', instruccion: 'No', aterrizajes: 1 },
  ];

  return (
    <div className="libro-vuelo-container">
      <div className="libro-vuelo-header">
        <h1>Libro de Vuelo</h1>
        <button className="agregar-vuelo-btn">Agregar vuelo</button>
      </div>
      <table className="libro-vuelo-tabla">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Hr inicio</th>
            <th>Hr llegada</th>
            <th>Hs de vuelo</th>
            <th>Finalidad</th>
            <th>Matrícula</th>
            <th>Instrucción</th>
            <th>Nº aterrizajes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vuelos.map((vuelo, index) => (
            <tr key={index}>
              <td>{vuelo.fecha}</td>
              <td>{vuelo.origen}</td>
              <td>{vuelo.destino}</td>
              <td>{vuelo.inicio}</td>
              <td>{vuelo.llegada}</td>
              <td>{vuelo.tiempo}</td>
              <td>{vuelo.finalidad}</td>
              <td>{vuelo.matricula}</td>
              <td>{vuelo.instruccion}</td>
              <td>{vuelo.aterrizajes}</td>
              <td>
                <button className="icon-btn edit-btn">
                  <FaEdit />
                </button>
                <button className="icon-btn delete-btn">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InstructorLibroVuelo;
