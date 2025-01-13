import "./styles/KPICards.css";

export function KpiCards() {
  return (
    <div className="kpi-cards-container">
      <div className="kpi-card">
        <header className="kpi-card-header">
          <h2 className="kpi-card-title">Saldo Total</h2> {/* Es el saldo total del aeroclub, pagos-recibos-pago a instructores, tiende a negativo o cero, revisar */}
        </header>
        <div className="kpi-card-content">
          <div className="kpi-card-value">$45,231.89</div>
        </div>
      </div>
      <div className="kpi-card">
        <header className="kpi-card-header">
          <h2 className="kpi-card-title">Monto Pendiente por Cobrar</h2> {/* Son todos los movspagos null, suma de recibos o cuotas sociales impagas */}
        </header>
        <div className="kpi-card-content">
          <div className="kpi-card-value">$12,345.67</div>
        </div>
      </div>
      <div className="kpi-card">
        <header className="kpi-card-header">
          <h2 className="kpi-card-title">Venta de Combustible</h2> {/* Suma de todas las ventas por combustible */}
        </header>
        <div className="kpi-card-content">
          <div className="kpi-card-value">$5,678.90</div>
        </div>
      </div>

        {/* podemos agregar suma por recibos de vuelo */}

      <div className="kpi-card">
        <header className="kpi-card-header">
          <h2 className="kpi-card-title">Pagos de Cuotas Sociales</h2> {/* suma de todos los pagos de cuotas sociales */}
        </header>
        <div className="kpi-card-content">
          <div className="kpi-card-value">$8,765.43</div>
        </div>
      </div>
      <div className="kpi-card">
        <header className="kpi-card-header">
          <h2 className="kpi-card-title">Deuda de Cuotas Sociales</h2> {/*Suma de todas las cuotas sociales no pagas */}
        </header>
        <div className="kpi-card-content">
          <div className="kpi-card-value">$3,210.98</div>
        </div>
      </div>
      <div className="kpi-card">
        <header className="kpi-card-header">
          <h2 className="kpi-card-title">Pago a Instructores</h2> {/* suma de todos los pagos a instructores */}
        </header>
        <div className="kpi-card-content">
          <div className="kpi-card-value">$7,890.12</div>
        </div>
      </div>
      <div className="kpi-card">
        <header className="kpi-card-header">
          <h2 className="kpi-card-title">Deuda de Pago a Instructores</h2> {/* suma de la liquidacion para instructores */}
        </header>
        <div className="kpi-card-content">
          <div className="kpi-card-value">$15,678.90</div>
        </div>
      </div>
    </div>
  );
}
