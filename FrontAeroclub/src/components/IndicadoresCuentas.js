import "./styles/IndicadoresCuentas.css";

const accountData = {
  totalAccounts: 250,
  totalAssociates: 180,
  totalManagers: 5,
  totalInstructors: 12,
  totalAdministrators: 3,
  accountsLastMonth: 15,
  recentAccounts: [
    { id: 1, name: "Ana García", date: "2023-05-10" },
    { id: 2, name: "Carlos López", date: "2023-05-08" },
    { id: 3, name: "María Rodríguez", date: "2023-05-05" },
    { id: 4, name: "Juan Martínez", date: "2023-05-03" },
    { id: 5, name: "Laura Fernández", date: "2023-05-01" },
  ],
};

export function IndicadoresCuentas() {
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
                    <p className="stat-label">Total Cuentas</p>
                    <p className="stat-value">{accountData.totalAccounts}</p>
                  </div>
                  <div className="account-stat">
                    <p className="stat-label">Total Asociados</p>
                    <p className="stat-value">{accountData.totalAssociates}</p>
                  </div>
                  <div className="account-stat">
                    <p className="stat-label">Total Gestores</p>
                    <p className="stat-value">{accountData.totalManagers}</p>
                  </div>
                  <div className="account-stat">
                    <p className="stat-label">Total Instructores</p>
                    <p className="stat-value">{accountData.totalInstructors}</p>
                  </div>
                  <div className="account-stat">
                    <p className="stat-label">Total Administradores</p>
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
                <h3 className="recent-accounts-title">Últimas 5 Cuentas Creadas</h3>
                <ul className="recent-accounts-list">
                  {accountData.recentAccounts.map((account) => (
                    <li key={account.id} className="recent-account-item">
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
