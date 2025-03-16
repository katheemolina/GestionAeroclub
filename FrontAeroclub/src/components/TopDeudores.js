import React, { useEffect, useState } from "react";
import { obtenerTopDeudores } from "../services/dashboardGestor"; // Ajustá la ruta según tu proyecto
import "./styles/TopDeudores.css";
import { CleaningServices } from "@mui/icons-material";

export function TopDeudores() {
  const [deudores, setDeudores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerTopDeudores();
        // Filtramos para excluir al usuario con id 1
        const deudoresFiltrados = data.filter((deudor) => deudor.id_usuario !== 1);
        setDeudores(deudoresFiltrados);
      } catch (error) {
        console.error("Error al obtener los deudores:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="debtor-card">
      <header className="debtor-card-header">
<<<<<<< HEAD
        <h2 className="debtor-card-title">Mayores deudores</h2>
=======
        <h2 className="debtor-card-title">Mayores Deudores</h2>
>>>>>>> 7a25321f957f6532474930dd80a13f716969bb01
      </header>
      <table className="debtor-table">
        <thead>
          <tr>
            <th className="debtor-table-head">Nombre</th>
            <th className="debtor-table-head text-right">Deuda</th>
          </tr>
        </thead>
        <tbody>
          {deudores.map((deudor) => (
            <tr key={deudor.id_usuario}>
              <td className="debtor-table-cell">
                {deudor.nombre} {deudor.apellido}
              </td>
              <td className="debtor-table-cell text-right">
                ${parseFloat(deudor.Saldo).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
