import React, { useEffect, useState } from 'react';
import './Styles/GestorDashboard.css';
import { obtenerHorasVueloUltimoMes, obtenerSaldoCuentaCorrienteAeroclub } from '../../services/dashboardGestor';

function GestorDashboard() {
  const [saldo, setSaldo] = useState(null);
  const [importePorCobrar, setImportePorCobrar] = useState(null);
  const [horasVuelo, setHorasVuelo] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSaldo = async () => {
      try {
        const data = await obtenerSaldoCuentaCorrienteAeroclub();
        setSaldo(data[0]?.importe_saldo || "0.00");
        setImportePorCobrar(data[0]?.importe_por_cobrar || "0.00");
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSaldo();
  }, []);

  useEffect(() => {
    const fetchHorasVuelo = async () => {
      try {
        const data = await obtenerHorasVueloUltimoMes();

        setHorasVuelo(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchHorasVuelo();
  }, []);

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
          <div className="num-secundario"></div>
        </div>
      </div>

      {/* Sección de Aeronaves */}
      <div className="contenedor-statbox">
        <div className="statbox avion-container">
          {horasVuelo.length > 0 ? (
            horasVuelo.map((aeronave, index) => (
              <div className="avion-box" key={index}>
                <div className="nombre-avion">{aeronave.matricula || "Sin matrícula"}</div>
                <div className="imagen-avion"></div>
                <table className="tabla-avion">
                  <tbody>
                    <tr>
                      <td>Horas último mes:</td>
                      <td>{Math.floor(aeronave.horas_ultimo_mes || 0)} hs.</td>
                    </tr>
                    <tr>
                      <td>Próxima inspección:</td>
                      <td>132 hs.</td> {/* Placeholder, actualizar según datos */}
                    </tr>
                    <tr>
                      <td>Fecha última inspección:</td>
                      <td>30/11/23</td> {/* Placeholder, actualizar según datos */}
                    </tr>
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <p>No hay aeronaves disponibles</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default GestorDashboard;
