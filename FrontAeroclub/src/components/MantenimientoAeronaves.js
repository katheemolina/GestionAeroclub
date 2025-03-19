import React, { useEffect, useState } from 'react';
import { obtenerAeronaves } from '../services/aeronavesApi'; // Ajustá la ruta según tu proyecto
import './styles/MantenimientoAeronaves.css';

export function MantenimientoAeronaves() {
  const [aeronaves, setAeronaves] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerAeronaves();
        // Filtramos aeronaves activas y transformamos datos para el componente
        const aeronavesFiltradas = data
          .filter((aeronave) => aeronave.estado !== 'baja')
          .map((aeronave) => ({
            id: aeronave.id_aeronave,
            nombre: aeronave.matricula,
            horasVoladas: parseFloat(aeronave.horas_vuelo_aeronave),
            siguienteInspeccion: parseFloat(aeronave.intervalo_para_inspeccion),
            ultimaInspeccion: aeronave.ultimo_servicio.split(' ')[0], 
          }));
        setAeronaves(aeronavesFiltradas);
      } catch (error) {
        console.error('Error al obtener las aeronaves:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div id='mantenimiento-aeronaves' className="account-card">
      <div className="card-header">
        <h2 className="card-title">Estado de Mantenimiento de Aeronaves</h2>
      </div>
      <div className="card-content">
        <div className="space-y-4">
          {aeronaves.map((aeronave) => (
            <div key={aeronave.id} className="space-y-2 border-bottom-gray">
              <div className="flex justify-between">
                <span className="font-medium">{aeronave.nombre}</span>
                <span className="text-sm text-gray-500 ">
                  {aeronave.horasVoladas} / {aeronave.siguienteInspeccion} horas
                </span>
              </div>
              
              <div className="flex justify-between mt-2">
                <span className="text-sm text-gray-500">Última inspección: {aeronave.ultimaInspeccion}</span>
              </div>
              <div 
                className="progress-bar" 
                style={{ width: `${(aeronave.horasVoladas / aeronave.siguienteInspeccion) * 100}%` }} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
