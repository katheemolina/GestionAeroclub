import React from 'react';
import './styles/MantenimientoAeronaves.css';

const datosAeronaves = [
  { id: 1, nombre: 'LV-YOH', horasVoladas: 450, siguienteInspeccion: 500, ultimaInspeccion: '2023-01-15' },
  { id: 2, nombre: 'LV-S141', horasVoladas: 380, siguienteInspeccion: 500, ultimaInspeccion: '2023-02-20' },
  { id: 3, nombre: 'LV-NEW', horasVoladas: 110, siguienteInspeccion: 300, ultimaInspeccion: '2023-03-10' },
  { id: 4, nombre: 'LV-OMR', horasVoladas: 80, siguienteInspeccion: 300, ultimaInspeccion: '2023-04-05' },
];

export function MantenimientoAeronaves() {
  return (
    <div id='mantenimiento-aeronaves' className="card">
      <div className="card-header">
        <h2 className="card-title">Estado de Mantenimiento de Aeronaves</h2>
      </div>
      <div className="card-content">
        <div className="space-y-4">
          {datosAeronaves.map((aeronave) => (
            <div key={aeronave.id} className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{aeronave.nombre}</span>
                <span className="text-sm text-gray-500">
                  {aeronave.horasVoladas} / {aeronave.siguienteInspeccion} horas
                </span>
              </div>
              
              <div className="flex justify-between mt-2">
                <span className="text-sm text-gray-500">Última inspección: {aeronave.ultimaInspeccion}</span>
              </div>
              <div className="progress-bar" style={{ width: `${(aeronave.horasVoladas / aeronave.siguienteInspeccion) * 100}%` }} />
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
