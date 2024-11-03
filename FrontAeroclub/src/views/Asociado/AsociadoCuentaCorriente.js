import React from 'react';
import "../../styles/background.css"
import TableComponent from "../../components/TableComponent"

function AsociadoCuentaCorriente() {
  const columns = [
    { header: 'Fecha', accessor: 'fecha' },
    { header: 'Concepto', accessor: 'concepto' },
    { header: 'Debe', accessor: 'debe' },
    { header: 'Haber', accessor: 'haber' },
    { header: 'Estado', accessor: 'estado' }
  ];

  const data = [
    {
      fecha: '2024-10-01',
      concepto: 'Pago de factura de electricidad',
      debe: 1500.00,
      haber: 0.00,
      estado: 'Pagado'
    },
    {
      fecha: '2024-10-02',
      concepto: 'Compra de material de oficina',
      debe: 300.50,
      haber: 0.00,
      estado: 'Pendiente'
    },
    {
      fecha: '2024-10-03',
      concepto: 'Venta de servicios',
      debe: 0.00,
      haber: 2000.00,
      estado: 'Confirmado'
    },
    {
      fecha: '2024-10-04',
      concepto: 'Alquiler de local',
      debe: 1200.00,
      haber: 0.00,
      estado: 'Pagado'
    },
    {
      fecha: '2024-10-05',
      concepto: 'Reembolso de gastos',
      debe: 0.00,
      haber: 500.00,
      estado: 'Aprobado'
    },
    {
      fecha: '2024-10-06',
      concepto: 'Gastos de publicidad',
      debe: 400.00,
      haber: 0.00,
      estado: 'Pagado'
    },
    {
      fecha: '2024-10-07',
      concepto: 'Ingreso por intereses',
      debe: 0.00,
      haber: 150.00,
      estado: 'Confirmado'
    }
  ];

  return (
    <div className="background">
      <header className="header">
        <h1>Cuenta Corriente</h1>
      </header>
      {/* <CuentaCorriente movimientos={movimientos} /> */}
      <TableComponent columns={columns} data={data} />
    </div>
  );
}

export default AsociadoCuentaCorriente;