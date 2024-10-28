import React from 'react';
import TableComponent from "../../components/TableComponent"
import "./Styles/AsociadoDashboards.css"
import "../../styles/background.css"

function Dashboard({ nombre, apellido, saldo, horasVoladas, fechaVencimiento, licencias }) {
  // Configuración de columnas y datos de ejemplo para la tabla
  
  

  const columns = [
    { header: 'Avión', accessor: 'avion' },
    { header: 'Último Vuelo', accessor: 'ultimoVuelo' },
    { header: 'Adaptación', accessor: 'adaptacion' }
  ];

  const data = [
    { avion: 'Cessna 172', ultimoVuelo: '2024-10-01', adaptacion: 'Sí' },
    { avion: 'Piper PA-28', ultimoVuelo: '2024-09-15', adaptacion: 'No' },
    { avion: 'Beechcraft Bonanza', ultimoVuelo: '2024-08-10', adaptacion: 'Sí' }
  ];

  const  cma = 'vigente'; 
  const cmaClass = cma === 'vigente' ? 'cma-vigente' : 'cma-no-vigente';
  

  return (
    <div className="background">
      <header className="header">
        <h1>Kathy Molina</h1>
      </header>

      <section className="stats-section">
        <div className="stat-box">
          <h3>Saldo</h3>
          <p>$100000</p>
        </div>
        <div className="stat-box">
          <h3>Horas Voladas</h3>
          <p>150</p>
        </div>
      </section>

      <section className="stats-section">
      <div className={`stat-box ${cmaClass}`}>
          <h3>CMA</h3>
          <p>{cma}</p>
        </div>
        <div className="stat-box">
          <h3>Horas Voladas</h3>
          <p>150</p>
        </div>
      </section>

      <section className="table-section">
        <h3>Registro de Vuelos</h3>
        <TableComponent columns={columns} data={data} />
      </section>

      <section className="licencias-section">
        <h3>Licencias</h3>
        <ul>
          <li>SPL - Piloto de Planeador</li>
          <li>PPL - Piloto Privado</li>
          <li>CPL - Piloto Comercial</li>
          <li>ATPL - Piloto de Transporte de Línea Aérea</li>
          <li>FI - Instructor de vuelo</li>
          <li>U/L - Piloto de Ul</li>
        </ul>
      </section>
    </div>
  );
}

export default Dashboard;