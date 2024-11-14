import React, { useEffect, useState } from 'react';
import "./Styles/AsociadoLibroVuelo.css"
import { obtenerLibroDeVueloPorUsuario } from '../../services/vuelosApi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useUser } from '../../context/UserContext';
import { ProgressSpinner } from 'primereact/progressspinner';
import SearchIcon from '@mui/icons-material/Search'; //icono de detalles
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

        

function AsociadoLibroVuelo() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { usuarioId } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener vuelos
        const vuelosResponse = await obtenerLibroDeVueloPorUsuario(usuarioId);
        setData(vuelosResponse); // Suponiendo que los datos son directamente utilizables

      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
      setLoading(false); // Cambia el estado de carga
    };

    fetchData();
  }, [usuarioId]);

  if (loading) {
    return <div className="background"> 
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <ProgressSpinner 
        style={{width: '70px', height: '70px'}}
        strokeWidth="5"
        strokeColor="red"
        /> 
      </div>
    </div>; 
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