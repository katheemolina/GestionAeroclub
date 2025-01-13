import "./styles/TopDeudores.css";

const topDebtors = [
    { id: 1, name: "Juan Pérez", debt: 1500.0 },
    { id: 2, name: "María González", debt: 1200.5 },
    { id: 3, name: "Carlos Rodríguez", debt: 950.75 },
    { id: 4, name: "Ana Martínez", debt: 800.25 },
    { id: 5, name: "Luis Sánchez", debt: 750.0 },
    { id: 6, name: "Elena Fernández", debt: 600.5 },
    { id: 7, name: "Roberto López", debt: 550.75 },
    { id: 8, name: "Sofía Torres", debt: 500.25 },
    { id: 9, name: "Diego Ramírez", debt: 450.0 },
    { id: 10, name: "Laura Díaz", debt: 400.5 },
  ];
  
  export function TopDeudores() {
    return (
      <div className="debtor-card">
        <header className="debtor-card-header">
          <h2 className="debtor-card-title">Top 10 Deudores</h2>
        </header>
        <table className="debtor-table">
          <thead>
            <tr>
              <th className="debtor-table-head">Nombre</th>
              <th className="debtor-table-head text-right">Deuda</th>
            </tr>
          </thead>
          <tbody>
            {topDebtors.map((debtor) => (
              <tr key={debtor.id}>
                <td className="debtor-table-cell">{debtor.name}</td>
                <td className="debtor-table-cell text-right">${debtor.debt.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  