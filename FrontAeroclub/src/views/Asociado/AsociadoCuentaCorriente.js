import React, { useEffect, useState } from 'react';
import "./Styles/AsociadoCuentaCorriente.css"
import { obtenerCuentaCorrientePorUsuario } from '../../services/movimientosApi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useUser } from '../../context/UserContext';

function AsociadoCuentaCorriente() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { usuarioId } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener vuelos
        const cuentaCorrienteResponse = await obtenerCuentaCorrientePorUsuario(usuarioId);
        setData(cuentaCorrienteResponse);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
      setLoading(false); // Cambia el estado de carga
    };

    fetchData();
  }, [usuarioId]);
  
  // Función para formatear el importe como moneda
  const formatoMoneda = (rowData) => {
    return `$ ${parseFloat(rowData.importe).toFixed(2)}`;
  };

  if (loading) {
    return <div className="background"><div>Cargando...</div></div>; // Muestra un mensaje de carga mientras esperas los datos
  }
  return (
    <div className="background">
      <header className="header">
        <h1>Cuenta Corriente</h1>
      </header>
      <DataTable 
        value={data} 
        paginator rows={15} 
        rowsPerPageOptions={[10, 15, 25, 50]} 
        removableSort 
        filterDisplay="row"
        scrollable
        scrollHeight="800px"
        >
        <Column field="fecha" header="Fecha" sortable filter filterPlaceholder="Buscar por fecha"  filterMatchMode="contains" dataType="date" showFilterMenu={false}  ></Column>
        <Column field="descripcion_completa" header="Descripcion" sortable filter filterPlaceholder="Busar por usuario" filterMatchMode="contains" showFilterMenu={false}  ></Column>
        <Column field="importe" header="Importe" sortable filter filterPlaceholder="Buscar por número" filterMatchMode="contains" body={formatoMoneda} showFilterMenu={false}  ></Column>
      </DataTable>
    </div>
  );
}

export default AsociadoCuentaCorriente;