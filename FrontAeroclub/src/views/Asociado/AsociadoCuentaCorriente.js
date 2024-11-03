import React, { useEffect, useState } from 'react';
import "../../styles/background.css"
import TableComponent from "../../components/TableComponent"
import { obtenerCuentaCorrientePorUsuario } from '../../services/movimientosApi';

function AsociadoCuentaCorriente({ idUsuario = 1 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const columns = [
    { header: 'Fecha', accessor: 'fecha' },
    { header: 'Concepto', accessor: 'descripcion_completa' },
    { header: 'Importe', accessor: 'importe' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener vuelos
        const cuentaCorrienteResponse = await obtenerCuentaCorrientePorUsuario(idUsuario);
        setData(cuentaCorrienteResponse);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
      setLoading(false); // Cambia el estado de carga
    };

    fetchData();
  }, [idUsuario]);
  
  if (loading) {
    return <div className="background"><div>Cargando...</div></div>; // Muestra un mensaje de carga mientras esperas los datos
  }
  return (
    <div className="background">
      <header className="header">
        <h1>Cuenta Corriente</h1>
      </header>
      <TableComponent columns={columns} data={data} />
    </div>
  );
}

export default AsociadoCuentaCorriente;