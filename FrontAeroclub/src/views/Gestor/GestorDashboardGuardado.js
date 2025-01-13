/*
import React, { useEffect, useState } from 'react';
import './Styles/GestorDashboard.css';
import { obtenerHorasVueloUltimoMes, obtenerSaldoCuentaCorrienteAeroclub } from '../../services/dashboardGestor';
import { obtenerAeronaves } from '../../services/aeronavesApi';
import avionImage from '../../avionetaBN.png';
import { Dialog } from 'primereact/dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
   
      <div className="contenedor-statbox">
        <div className="statbox">
          <h3>Saldo</h3>
          <div className="num-saldo">{`$${saldo}`}</div>
        </div>
        <div className="alertas-btn" onClick={() => setDialogVisible(true)}>
          <FontAwesomeIcon icon={faBell} size="lg" />
        </div>
      </div>


      <div className="contenedor-statbox">
        <div className="statbox">
          <h3>Dinero por cobrar</h3>
          <div className="num-secundario">{`$${importePorCobrar}`}</div>
        </div>
        <div className="statbox">
          <h3>Dinero adeudado</h3>
          <div className="num-secundario">{`$${importeAdeudado}`}</div>
        </div>
      </div>


      <div className="contenedor-statbox">
        <div className="statbox">
          <h3>Horas voladas últimos 30 días</h3>
          <div className="num-secundario">{horasVuelo}</div>
        </div>
      </div>


      <div className="contenedor-statbox">
        <div className="statbox avion-container">
          {aeronaves.length > 0 ? (
            aeronaves.map(aeronave => {
              const fechaUltimaInspeccion = new Date(aeronave.ultimo_servicio);
              const fechaActual = new Date();
              const diferenciaMilisegundos = fechaActual - fechaUltimaInspeccion;
              const diferenciaMinutos = Math.floor(diferenciaMilisegundos / (1000 * 60));
              const minutosRestantes = Math.max(0, (aeronave.intervalo_para_inspeccion * 60) - diferenciaMinutos);
              const horasRestantes = Math.floor(minutosRestantes / 60);
              const minutosRestantesExactos = minutosRestantes % 60;

              return (
                <div className="avion-box" key={aeronave.id_aeronave}>
                  <div className="nombre-avion">{aeronave.matricula || "Sin matrícula"}</div>
                  <div className="imagen-avion">
                    <img src={avionImage} alt="Avion" />
                  </div>
                  <table className="tabla-avion">
                    <tbody>
                      <tr>
                        <td>Horas último mes:</td>
                        <td>{horasPorAvion[aeronave.matricula] || "0 hs 00 min"}</td>
                      </tr>
                      <tr>
                        <td>Próxima inspección:</td>
                        <td className={horasRestantes === 0 && minutosRestantesExactos === 0 ? "alerta-inspeccion" : horasRestantes < 24 ? "atencion-inspeccion" : ""}>
                          {`${horasRestantes} hs ${minutosRestantesExactos} min`}
                        </td>
                      </tr>
                      <tr>
                        <td>Fecha última inspección:</td>
                        <td>{aeronave.ultimo_servicio ? fechaUltimaInspeccion.toLocaleDateString() : "No tiene"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })
          ) : (
            <p>No hay aeronaves disponibles</p>
          )}
        </div>
      </div>

 
      <div className="grafico-container">
        <h3>Horas de vuelo por aeronave</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graficoData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Legend />
            {aeronaves.map((aeronave, index) => (
              <Line key={index} type="monotone" dataKey={aeronave.matricula} stroke={index % 2 === 0 ? '#8884d8' : '#82ca9d'} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GestorDashboard;
*/