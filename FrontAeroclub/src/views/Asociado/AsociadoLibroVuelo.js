import React from 'react';
import "../../styles/background.css"
import "./Styles/AsociadoLibroVuelo.css"
import TableComponent from "../../components/TableComponent"

function AsociadoLibroVuelo() {
  const columns = [
    { header: 'Fecha', accessor: 'fecha' },
    { header: 'Origen', accessor: 'origen' },
    { header: 'Destino', accessor: 'destino' },
    { header: 'Hora de Inicio', accessor: 'horaInicio' },
    { header: 'Hora de Llegada', accessor: 'horaLlegada' },
    { header: 'Tiempo de Vuelo', accessor: 'tiempoVuelo' },
    { header: 'Finalidad', accessor: 'finalidad' },
    { header: 'Matricula', accessor: 'matricula' },
    { header: 'Instruccion', accessor: 'instruccion' },
    { header: 'Cant. Aterrizajes', accessor: 'cantAterrizajes' },
    { header: 'Acciones', accessor: 'acciones' },
  ];

  const data = [
    {
      fecha: '2024-10-03',
      origen: 'Aeropuerto E',
      destino: 'Aeropuerto F',
      horaInicio: '09:15',
      horaLlegada: '10:15',
      tiempoVuelo: '1h',
      finalidad: 'Turismo',
      matricula: 'LMN789',
      instruccion: 'Piloto C',
      cantAterrizajes: 1,
      acciones: ''
    },
    {
      fecha: '2024-10-04',
      origen: 'Aeropuerto G',
      destino: 'Aeropuerto H',
      horaInicio: '16:00',
      horaLlegada: '17:00',
      tiempoVuelo: '1h',
      finalidad: 'Entrenamiento',
      matricula: 'DEF012',
      instruccion: 'Piloto D',
      cantAterrizajes: 2,
      acciones: ''
    },
    {
      fecha: '2024-10-05',
      origen: 'Aeropuerto I',
      destino: 'Aeropuerto J',
      horaInicio: '08:30',
      horaLlegada: '09:30',
      tiempoVuelo: '1h',
      finalidad: 'Mantenimiento',
      matricula: 'GHI345',
      instruccion: 'Piloto E',
      cantAterrizajes: 1,
      acciones: ''
    },
    {
      fecha: '2024-10-06',
      origen: 'Aeropuerto K',
      destino: 'Aeropuerto L',
      horaInicio: '13:45',
      horaLlegada: '14:45',
      tiempoVuelo: '1h',
      finalidad: 'Viaje de ocio',
      matricula: 'JKL678',
      instruccion: 'Piloto F',
      cantAterrizajes: 1,
      acciones: ''
    }
  ];


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

export default AsociadoLibroVuelo;
