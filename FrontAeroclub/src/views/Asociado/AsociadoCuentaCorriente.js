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

// import { useState, useEffect } from 'react';
// import React from 'react';
// import CuentaCorriente from '../../components/CuentaCorriente';
// import { apiCuentaCorriente } from '../../services/apiCuentaCorriente.ts';
// import "../../styles/background.css"

// function AsociadoCuentaCorriente() {
//   const [movimientos, setMovimientos] = useState([]);
//   const [loading, setLoading] = useState(true); // Para manejar el estado de carga

//   const getSaldo = async (id) => {
//     try {
//       const response = await apiCuentaCorriente.getById(id);
//       return parseInt(response); // Asegúrate de que `response` sea un número
//     } catch (error) {
//       console.log(error.message);
//       return null;
//     }
//   };

//   const fetchData = async () => {
//     const saldo = await getSaldo(1); // Obtener el saldo
//     const nuevosMovimientos = [
//       { fecha: '2024-10-01', detalle: 'Vuelo', monto: saldo }, // Usa el saldo obtenido
//       { fecha: '2024-10-05', detalle: 'Pago de cuota', monto: 500 },
//     ];
//     setMovimientos(nuevosMovimientos); // Actualiza el estado con los nuevos movimientos
//     setLoading(false); // Cambia el estado de carga
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   if (loading) {
//     return <div className="content"><div>Cargando...</div></div>; // Muestra un mensaje de carga mientras esperas los datos
//   }
//   return (
//     <div className="background">
//       <h1>Cuenta Corriente</h1>
//       <CuentaCorriente movimientos={movimientos} />
//     </div>
//   );
// }

// export default AsociadoCuentaCorriente;