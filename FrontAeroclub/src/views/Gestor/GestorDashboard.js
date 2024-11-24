import React, { useEffect, useState } from 'react';
import './Styles/GestorDashboard.css'
import { obtenerHorasVueloUltimoMes, obtenerSaldoCuentaCorrienteAeroclub } from '../../services/dashboardGestor';

function GestorDashboard() {
  const [saldo, setSaldo] = useState(null);
  const [horasVuelo, setHorasVuelo] = useState([]);
  const [error, setError] = useState(null);

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


  useEffect(() => {
      const fetchSaldo = async () => {
          try {
              const data = await obtenerSaldoCuentaCorrienteAeroclub();
              setSaldo(data[0]); // Asumimos que el SP devuelve un solo registro
          } catch (err) {
              setError(err.message);
          }
      };

      fetchSaldo();
  }, []);
  
  return (
    <div className="background">
      
        <div className='contenedor-statbox'>
        <div className='statbox'> 
          <h3> Saldo </h3>
          <div className='num-saldo'> $1.200.000</div>
        </div>
        <div className='alertas-btn'> (notificaciones)</div>
        </div>
        
        <div className='contenedor-statbox'>
          <div className='statbox'>
            <h3> Dinero por cobrar </h3>
            <div className='num-secundario'> $100.000</div>
          </div>
          <div className='statbox'>
            <h3> Dinero adeudado </h3>
            <div className='num-secundario'> $230.000</div>
          </div>
        </div>

        <div className='contenedor-statbox'> 
          <div className='statbox gauge-container'>
            <div className='gauge-box'> <h3>100LL</h3> </div>
            <div className='gauge-box'> <h3>Mogas</h3> </div>
            <div className='gauge-box'> <h3>Aceite 1</h3> </div>
            <div className='gauge-box'> <h3>Aceite 2</h3> </div>
          </div>
        </div>
        
        <div className='contenedor-statbox'>
          <div className='statbox'>
            <h3> Horas voladas</h3>
            <div className='num-secundario'>
              20.000 horas
            </div>
          </div>
        </div>
        
        <div className='contenedor-statbox'>
          <div className='statbox avion-container'>
            
            <div className='avion-box'>
              <div className='nombre-avion'>LV-YOH</div>
              <div className='imagen-avion'></div>
              <table className='tabla-avion'>
                <tr>
                  <td>Cantidad horas:</td>
                  <td>224 hs.</td>
                </tr>
                <tr>
                  <td>Próxima inspección en:</td>
                  <td>132 hs.</td>
                </tr>
                <tr>
                  <td>Fecha Última inspección:</td>
                  <td>30/11/23</td>
                </tr>
              </table>
            </div>

            <div className='avion-box'>
              <div className='nombre-avion'>LV-S141</div>
              <div className='imagen-avion'> </div>
              <table className='tabla-avion'>
                <tr>
                  <td>Cantidad horas:</td>
                  <td>224 hs.</td>
                </tr>
                <tr>
                  <td>Próxima inspección en:</td>
                  <td>132 hs.</td>
                </tr>
                <tr>
                  <td>Fecha Última inspección:</td>
                  <td>30/11/23</td>
                </tr>
              </table>

            </div>
          </div>
        </div>

    </div>
  );
}

export default GestorDashboard;
