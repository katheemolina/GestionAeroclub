import { useState, useEffect } from "react";
import { contadoresDeCuentas, obtenerUltimasCuentas } from "../services/dashboardGestor";
import "./styles/IndicadoresCuentas.css";

export function IndicadoresCuentas() {
  const [accountData, setAccountData] = useState({
    totalAccounts: 0,
    totalAssociates: 0,
    totalManagers: 0,
    totalInstructors: 0,
    totalAdministrators: 0,
    accountsLastMonth: 0,
    recentAccounts: [],
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    // Llama al servicio para obtener los indicadores generales y recientes
    const fetchData = async () => {
      try {
        // Indicadores generales
        const indicadoresData = await contadoresDeCuentas();
        // Últimas cuentas creadas
        const recientesData = await obtenerUltimasCuentas();
        
        // Procesar datos recientes
        const formattedRecentAccounts = recientesData.map((account) => ({
          name: `${account.nombre} ${account.apellido}`, // Concatenar nombre y apellido
          date: new Date(account.created_at).toLocaleString(), // Formatear fecha
        }));

        setAccountData({
          totalAccounts: indicadoresData[0].total_cuentas || 0,
          totalAssociates: parseInt(indicadoresData[0].Asociados, 10) || 0,
          totalManagers: parseInt(indicadoresData[0].Gestores, 10) || 0,
          totalInstructors: parseInt(indicadoresData[0].Instructores, 10) || 0,
          totalAdministrators: parseInt(indicadoresData[0].Administradores, 10) || 0,
          accountsLastMonth: indicadoresData[0].usuarios_ultimo_mes || 0,
          recentAccounts: formattedRecentAccounts,
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="account-card">
      <div className="account-card-header">
        <h2 className="account-card-title">Indicadores de Cuentas</h2>
      </div>
      <div className="account-card-content">
        <div className="grid-layout">
          {/* Totales a la izquierda */}
          <div className="totals">
            <div className="grid">
              <div className="account-stat">
                <p className="stat-label">Cuentas</p>
                <p className="stat-value">{accountData.totalAccounts}</p>
              </div>
              <div className="account-stat">
                <p className="stat-label">Asociados</p>
                <p className="stat-value">{accountData.totalAssociates}</p>
              </div>
              <div className="account-stat">
                <p className="stat-label">Gestores</p>
                <p className="stat-value">{accountData.totalManagers}</p>
              </div>
              <div className="account-stat">
                <p className="stat-label">Instructores</p>
                <p className="stat-value">{accountData.totalInstructors}</p>
              </div>
              <div className="account-stat">
                <p className="stat-label">Administradores</p>
                <p className="stat-value">{accountData.totalAdministrators}</p>
              </div>
              <div className="account-stat">
                <p className="stat-label">Cuentas Último Mes</p>
                <p className="stat-value">{accountData.accountsLastMonth}</p>
              </div>
            </div>
          </div>

          {/* Listado a la derecha */}
          <div className="recent-accounts">
            <h3 className="recent-accounts-title">Últimas cuentas creadas</h3>
            <ul className="recent-accounts-list">
              {accountData.recentAccounts.map((account, index) => (
                <li key={index} className="recent-account-item">
                  <span className="account-name">{account.name}</span> - {account.date}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
