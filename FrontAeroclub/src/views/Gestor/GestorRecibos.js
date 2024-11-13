import React, { useEffect, useState } from 'react';
import './Styles/GestorRecibos.css'
import { obtenerTodosLosRecibos } from '../../services/recibosApi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import '../../styles/datatable-style.css'; //Estilado para la tabla
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';

function GestorRecibos({idUsuario = 0}){
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
    try {
      // Obtener recibos
      const recibosResponse = await obtenerTodosLosRecibos(idUsuario);
      setData(recibosResponse);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
    setLoading(false); // Cambia el estado de carga
    };

    fetchData();
  }, [idUsuario]);
  
  function reciboAdd(){
    navigate('/gestor/recibos/nuevo', {
      state: {  }  // Aquí pasamos el objeto 'user' como estado
    });
  }

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
      <header className="header">
        <h1>Recibos</h1>
      </header>
      <Button className="nuevo" label="Agregar Recibo" onClick={reciboAdd} />
      <DataTable 
        value={data} 
        paginator rows={15} 
        rowsPerPageOptions={[10, 15, 25, 50]} 
        removableSort 
        filterDisplay="row"
        scrollable
        scrollHeight="800px"
        >
        <Column field="fecha" header="Fecha" sortable filter filterPlaceholder="Buscar por fecha"  filterMatchMode="contains" dataType="date" showFilterMenu={false} className="columna-ancho-min" ></Column>
        <Column field="usuario" header="Usuario" sortable filter filterPlaceholder="Busar por usuario" filterMatchMode="contains" showFilterMenu={false} className="columna-ancho-min" ></Column>
        <Column field="numero_recibo" header="N° Recibo" sortable filter filterPlaceholder="Buscar por número" filterMatchMode="contains" showFilterMenu={false} className="columna-ancho-min" ></Column>
        <Column field="tipo_recibo" header="Tipo de recibo" sortable filter filterPlaceholder="Buscar por tipo" filterMatchMode="contains" showFilterMenu={false} className="columna-ancho-min" ></Column>
        <Column field="estado" header="Estado" sortable filter filterPlaceholder="Buscar por tipo" filterMatchMode="contains" showFilterMenu={false} className="columna-ancho-min" ></Column>
        <Column field="importe" header="importe" sortable filter filterPlaceholder="Buscar por importe" filterMatchMode="contains" showFilterMenu={false} className="columna-ancho-min" ></Column>
      </DataTable>
      
    </div>
  );
}

export default GestorRecibos;