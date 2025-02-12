import React, { useEffect, useState } from "react";
import { obtenerSaldoCuentaCorrienteAeroclub } from "../services/dashboardGestor"; // Ajusta la ruta según tu proyecto
import "./styles/KPICards.css";

export function KpiCards() {
  const [saldos, setSaldos] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerSaldoCuentaCorrienteAeroclub();
        setSaldos(data[0]); // Accede al primer objeto del array
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="kpi-cards-container">
      {saldos ? (
        <>
          <div className="kpi-card">
            <header className="kpi-card-header">
              <h2 className="kpi-card-title">Saldo Total</h2>
            </header>
            <div className="kpi-card-content">
              <div className="kpi-card-value">${saldos.importe_saldo}</div>
            </div>
          </div>
          <div className="kpi-card">
            <header className="kpi-card-header">
              <h2 className="kpi-card-title">Monto Pendiente por Cobrar</h2>
            </header>
            <div className="kpi-card-content">
              <div className="kpi-card-value">${saldos.importe_por_cobrar}</div>
            </div>
          </div>
          <div className="kpi-card">
            <header className="kpi-card-header">
              <h2 className="kpi-card-title">Monto Adeudado</h2>
            </header>
            <div className="kpi-card-content">
              <div className="kpi-card-value">${saldos.importe_adeudado}</div>
            </div>
          </div>
        </>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
}
