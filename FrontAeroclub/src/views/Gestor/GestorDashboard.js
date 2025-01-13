import React, { useEffect, useState } from 'react';
import './Styles/GestorDashboard.css';
import { obtenerHorasVueloUltimoMes, obtenerSaldoCuentaCorrienteAeroclub } from '../../services/dashboardGestor';
import { obtenerAeronaves } from '../../services/aeronavesApi';
import avionImage from '../../avionetaBN.png';
import { KpiCards } from "../../components/KpiCards";
import { GraficoAeronaves } from "../../components/GraficoAeronaves";
import { MantenimientoAeronaves } from "../../components/MantenimientoAeronaves";
import { IndicadoresCuentas } from "../../components/IndicadoresCuentas";
import { TopDeudores } from "../../components/TopDeudores";


function GestorDashboard() {
  // Estados
  const [saldo, setSaldo] = useState("0.00");
  const [importePorCobrar, setImportePorCobrar] = useState("0.00");
  const [importeAdeudado, setImporteAdeudado] = useState("0.00");
  const [horasVuelo, setHorasVuelo] = useState("0.00");
  const [aeronaves, setAeronaves] = useState([]);
  const [horasPorAvion, setHorasPorAvion] = useState({});
  const [error, setError] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  // Estado para almacenar los datos del gráfico
  const [graficoData, setGraficoData] = useState([]);

  // Función para obtener los datos desde las APIs
  const fetchData = async () => {
    try {
      const saldoData = await obtenerSaldoCuentaCorrienteAeroclub();
      setSaldo(saldoData[0]?.importe_saldo || "0.00");
      setImportePorCobrar(saldoData[0]?.importe_por_cobrar || "0.00");
      setImporteAdeudado(saldoData[0]?.importe_adeudado || "0.00");

      const horasData = await obtenerHorasVueloUltimoMes();
      const totalHoras = horasData.reduce((total, aeronave) => {
        const horas = Math.floor(aeronave.horas_ultimo_mes || 0);
        const minutos = Math.round(((aeronave.horas_ultimo_mes || 0) % 1) * 60);
        return total + horas + (minutos / 60);
      }, 0);
      const horasTotales = Math.floor(totalHoras);
      const minutosTotales = Math.round((totalHoras - horasTotales) * 60);
      setHorasVuelo(`${horasTotales} hs ${minutosTotales} min`);

      const horasMap = {};
      horasData.forEach(aeronave => {
        const horas = Math.floor(aeronave.horas_ultimo_mes || 0);
        const minutos = Math.round(((aeronave.horas_ultimo_mes || 0) % 1) * 60);
        horasMap[aeronave.matricula] = `${horas} hs ${minutos} min`;
      });
      setHorasPorAvion(horasMap);

      const aeronavesData = await obtenerAeronaves();
      setAeronaves(aeronavesData);

      // Procesar datos para el gráfico
      const chartData = horasData.map(aeronave => {
        // Suponiendo que cada aeronave tiene horas por día para el gráfico (modifica según sea necesario)
        const horasPorDia = aeronave.horas_ultimo_mes / 30; // Promedio de horas por día
        return {
          dia: aeronave.matricula, // Aquí podrías usar las fechas reales
          [aeronave.matricula]: horasPorDia
        };
      });
      setGraficoData(chartData);
    } catch (err) {
      console.error('Error al obtener los datos:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData(); 
  }, []); 

  return (
    <div className="background">
      {/* Sección KPI*/}
      <KpiCards />
      {/* Sección KPI*/}
      <div className="grid-container">
      <GraficoAeronaves />
      <MantenimientoAeronaves />
     </div>
     <div className="grid-layout">
        <IndicadoresCuentas />
        <TopDeudores />
      </div>

      
    </div>
  );
}

export default GestorDashboard;
