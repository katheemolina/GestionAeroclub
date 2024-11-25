import React, { useEffect, useState } from 'react';
import './Styles/GestorDashboard.css';
import { obtenerHorasVueloUltimoMes, obtenerSaldoCuentaCorrienteAeroclub } from '../../services/dashboardGestor';
import { obtenerAeronaves } from '../../services/aeronavesApi';
import avionImage from '../../avionetaBN.png'; // Ajusta la ruta según la ubicación de la imagen

function GestorDashboard() {
  // Estados
  const [saldo, setSaldo] = useState("0.00");
  const [importePorCobrar, setImportePorCobrar] = useState("0.00");
  const [horasVuelo, setHorasVuelo] = useState("0.00");
  const [aeronaves, setAeronaves] = useState([]);
  const [horasPorAvion, setHorasPorAvion] = useState({});
  const [error, setError] = useState(null);

  // Función para obtener los datos desde las APIs
  const fetchData = async () => {
    try {
      // Obtener saldo y por cobrar
      const saldoData = await obtenerSaldoCuentaCorrienteAeroclub();
      setSaldo(saldoData[0]?.importe_saldo || "0.00");
      setImportePorCobrar(saldoData[0]?.importe_por_cobrar || "0.00");

      // Obtener horas de vuelo
      const horasData = await obtenerHorasVueloUltimoMes();
       //console.log('Datos de horas de vuelo obtenidos:', horasData);

      // Calcular total de horas en formato horas y minutos
      const totalHoras = horasData.reduce((total, aeronave) => {
        const horas = Math.floor(aeronave.horas_ultimo_mes || 0); // Parte entera (horas completas)
        const minutos = Math.round(((aeronave.horas_ultimo_mes || 0) % 1) * 60); // Parte decimal convertida a minutos (aproximadamente)
        return total + horas + (minutos / 60); // Sumar en formato decimal
      }, 0);
      const horasTotales = Math.floor(totalHoras); // Obtener horas completas
      const minutosTotales = Math.round((totalHoras - horasTotales) * 60); // Obtener minutos totales
      setHorasVuelo(`${horasTotales} hs ${minutosTotales} min`); // Mostrar como "horas hs minutos min"

      // Mapear horas por avión en formato horas y minutos
      const horasMap = {};
      horasData.forEach(aeronave => {
        const horas = Math.floor(aeronave.horas_ultimo_mes || 0);
        const minutos = Math.round(((aeronave.horas_ultimo_mes || 0) % 1) * 60);
        horasMap[aeronave.matricula] = `${horas} hs ${minutos} min`; // Redondear a 2 decimales
      });
      setHorasPorAvion(horasMap);

      // Obtener aeronaves
      const aeronavesData = await obtenerAeronaves();
      setAeronaves(aeronavesData);
    } catch (err) {
      console.error('Error al obtener los datos:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData(); // Llamada a la API al montar el componente
  }, []); // Solo se ejecuta una vez

  return (
    <div className="background">
      {/* Sección de Saldo */}
      <div className="contenedor-statbox">
        <div className="statbox">
          <h3>Saldo</h3>
          <div className="num-saldo">{`$${saldo}`}</div>
        </div>
        <div className="alertas-btn">(notificaciones)</div>
      </div>

      {/* Sección de Dinero */}
      <div className="contenedor-statbox">
        <div className="statbox">
          <h3>Dinero por cobrar</h3>
          <div className="num-secundario">{`$${importePorCobrar}`}</div>
        </div>
        <div className="statbox">
          <h3>Dinero adeudado</h3>
          <div className="num-secundario">$0.00</div>
        </div>
      </div>

      {/* Sección de Gauges */}
      <div className="contenedor-statbox">
        <div className="statbox gauge-container">
          <div className="gauge-box">
            <h3>100LL</h3>
          </div>
          <div className="gauge-box">
            <h3>Mogas</h3>
          </div>
          <div className="gauge-box">
            <h3>Aceite 1</h3>
          </div>
          <div className="gauge-box">
            <h3>Aceite 2</h3>
          </div>
        </div>
      </div>

      {/* Sección de Horas Voladas */}
      <div className="contenedor-statbox">
        <div className="statbox">
          <h3>Horas voladas</h3>
          <div className="num-secundario">{horasVuelo}</div>
        </div>
      </div>

{/* Sección de Aeronaves */}
<div className="contenedor-statbox">
  <div className="statbox avion-container">
    {aeronaves.length > 0 ? (
      aeronaves.map(aeronave => {
        const fechaUltimaInspeccion = new Date(aeronave.ultimo_servicio);
        const fechaActual = new Date();
        const diferenciaMilisegundos = fechaActual - fechaUltimaInspeccion;

        // Calcular la diferencia en minutos
        const diferenciaMinutos = Math.floor(diferenciaMilisegundos / (1000 * 60)); // Total minutos transcurridos
        const minutosRestantes = Math.max(
          0,
          (aeronave.intervalo_para_inspeccion * 60) - diferenciaMinutos
        ); // Minutos restantes para inspección

        // Convertir los minutos restantes a formato horas y minutos
        const horasRestantes = Math.floor(minutosRestantes / 60); // Horas completas restantes
        const minutosRestantesExactos = minutosRestantes % 60; // Minutos restantes exactos

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
                <td
                  className={
                    horasRestantes === 0 && minutosRestantesExactos === 0
                      ? "alerta-inspeccion" // Alerta crítica
                      : horasRestantes < 24
                      ? "atencion-inspeccion" // Alerta de atención
                      : ""
                  }
                >
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

    </div>
  );
}

export default GestorDashboard;
