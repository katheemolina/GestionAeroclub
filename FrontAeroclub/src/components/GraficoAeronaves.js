import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import "./styles/GraficoAeronaves.css";

const data = [
  { date: '01/01', LVYOH: 2, LVS141: 1, LVNEW: 0, LVOMR: 0 },
  { date: '02/01', LVYOH: 1, LVS141: 2, LVNEW: 1, LVOMR: 0 },
  { date: '03/01', LVYOH: 3, LVS141: 2, LVNEW: 0, LVOMR: 0 },
  { date: '04/01', LVYOH: 1, LVS141: 3, LVNEW: 0, LVOMR: 0 },
  { date: '05/01', LVYOH: 2, LVS141: 1, LVNEW: 0, LVOMR: 0 },
  { date: '06/01', LVYOH: 7, LVS141: 8, LVNEW: 0, LVOMR: 0 },
  { date: '07/01', LVYOH: 4, LVS141: 2, LVNEW: 0, LVOMR: 0 },
  { date: '08/01', LVYOH: 3, LVS141: 2, LVNEW: 0, LVOMR: 0 },
  { date: '09/01', LVYOH: 3, LVS141: 3, LVNEW: 0, LVOMR: 0 },
  { date: '10/01', LVYOH: 2, LVS141: 1, LVNEW: 0, LVOMR: 0 },
]

export function GraficoAeronaves() {
  return (

    <div className="grafico-container">
      <div className="grafico-title">
        <h2>Horas de vuelo por Aeronave en el mes de Enero</h2>
        </div>
      <div className="grafico-content">
    
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="LVYOH" stroke="#8884d8" />
            <Line type="monotone" dataKey="LVS141" stroke="#82ca9d" />
            <Line type="monotone" dataKey="LVNEW" stroke="#ffc658" />
            <Line type="monotone" dataKey="LVOMR" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
