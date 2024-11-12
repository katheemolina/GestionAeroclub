import React, { useEffect, useState } from 'react';
import "./Styles/AsociadoLibroVuelo.css"
import { obtenerLibroDeVueloPorUsuario } from '../../services/vuelosApi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function AsociadoLibroVuelo({ idUsuario = 3 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener vuelos
        const vuelosResponse = await obtenerLibroDeVueloPorUsuario(idUsuario);
        setData(vuelosResponse); // Suponiendo que los datos son directamente utilizables

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
      <div className="titulo-btn">
        <header className="header">
          <h1>Libro de Vuelo</h1>
        </header>
      </div>
      <DataTable 
        value={data} 
        paginator rows={15} 
        rowsPerPageOptions={[10, 15, 25, 50]} 
        filterDisplay="row"
        scrollable
        scrollHeight="800px"
        >
        <Column field="fecha" header="Fecha" sortable filter filterPlaceholder="Buscar por fecha"  filterMatchMode="contains" dataType="date" showFilterMenu={false} filterType='date' showClearButton={false} ></Column>
        <Column field="origen" header="Origen" sortable filter filterPlaceholder="Busar por usuario" filterMatchMode="contains" showFilterMenu={false}  showClearButton={false} ></Column>
        <Column field="destino" header="Destino" sortable filter filterPlaceholder="Buscar por número" filterMatchMode="contains" showFilterMenu={false}  showClearButton={false} ></Column>
        <Column field="hora_salida" header="Salida" sortable filter filterPlaceholder="Buscar por número" filterMatchMode="contains" showFilterMenu={false}  showClearButton={false} ></Column>
        <Column field="hora_llegada" header="Llegada" sortable filter filterPlaceholder="Buscar por número" filterMatchMode="contains" showFilterMenu={false}  showClearButton={false} ></Column>
        <Column field="tiempo_vuelo" header="Tiempo" sortable filter filterPlaceholder="Buscar por número" filterMatchMode="contains" showFilterMenu={false}  showClearButton={false} ></Column>
        <Column field="finalidad" header="Finalidad" sortable filter filterPlaceholder="Buscar por número" filterMatchMode="contains" showFilterMenu={false}  showClearButton={false} ></Column>
        <Column field="matricula" header="Matricula" sortable filter filterPlaceholder="Buscar por número" filterMatchMode="contains" showFilterMenu={false}  showClearButton={false} ></Column>
        <Column field="instruccion" header="Instruccion" sortable filter filterPlaceholder="Buscar por número" filterMatchMode="contains" showFilterMenu={false}  showClearButton={false} ></Column>
        <Column field="aterrizajes" header="Aterrizajes" sortable filter filterPlaceholder="Buscar por número" filterMatchMode="contains" showFilterMenu={false} showClearButton={false}  ></Column>
      </DataTable>
    </div>
  );
}

export default AsociadoLibroVuelo;