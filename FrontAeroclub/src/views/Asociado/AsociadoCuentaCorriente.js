import React, { useEffect, useState } from 'react';
import "./Styles/AsociadoCuentaCorriente.css";
import { obtenerCuentaCorrientePorUsuario } from '../../services/movimientosApi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { useUser } from '../../context/UserContext';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PantallaCarga from '../../components/PantallaCarga';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';

function AsociadoCuentaCorriente() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { usuarioId } = useUser();
  const [tiposMovimientos, setTiposMovimientos] = useState([]);
  const [tipoFiltro, setTipoFiltro] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cuentaCorrienteResponse = await obtenerCuentaCorrientePorUsuario(usuarioId);
        setData(cuentaCorrienteResponse);
        const tiposUnicos = [...new Set(cuentaCorrienteResponse.map((item) => item.tipo_movimiento))];
        setTiposMovimientos(tiposUnicos.map((tipo) => ({ label: tipo, value: tipo })));
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [usuarioId]);

  const openDialog = (rowData) => {
    setSelectedRowData(rowData);
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setSelectedRowData(null);
  };

  const formatoMoneda = (valor) => `$ ${parseFloat(valor).toFixed(2)}`;

    // Formatear fecha a DD/MM/AAAA
    const formatearFecha = (fecha) => {
      const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return new Date(fecha).toLocaleDateString('es-ES', opciones);
    };
  
    // Plantilla para mostrar la fecha 
    const plantillaFecha = (rowData) => {
      return formatearFecha(rowData.fecha);
    };
  

  if (loading) {
    return <PantallaCarga />;
  }

  return (
    <div className="background">
      <div className="titulo-btn">
        <header className="header">
          <h1>Cuenta Corriente</h1>
        </header>
      </div>

      <DataTable value={data} paginator rows={15} rowsPerPageOptions={[10, 15, 25, 50]} scrollable scrollHeight="800px" filterDisplay="row">
      <Column 
  field="fecha" 
  header="Fecha" 
  sortable 
  filter 
  filterPlaceholder="Buscar por fecha" 
  filterMatchMode="contains" 
  dataType="date" 
  showFilterMenu={false} 
  filterType='date' 
  body={plantillaFecha} // Aplica la plantilla personalizada para mostrar el formato deseado
/>

        <Column 
          field="tipo_movimiento" 
          header="Tipo de Movimiento" 
          sortable 
          filter 
          filterElement={
            <Dropdown 
              value={tipoFiltro} 
              options={tiposMovimientos} 
              onChange={(e) => setTipoFiltro(e.value)} 
              placeholder="Filtrar por tipo" 
              showClear 
              
            />
          } 
          showFilterMenu={false} 
        />
        <Column field="descripcion_completa" header="Descripción" sortable filter filterPlaceholder="Buscar por descripción" filterMatchMode="contains" showFilterMenu={false} />
        <Column field="importe" header="Importe" sortable body={(rowData) => formatoMoneda(rowData.importe)} filter filterPlaceholder="Buscar por importe" filterMatchMode="contains" showFilterMenu={false} />
        <Column 
          header="Acciones" 
          body={(rowData) => (
            <div className="acciones">
              <Tooltip title="Ver detalles">
                <IconButton color="primary" aria-label="view-details" onClick={() => openDialog(rowData)}>
                  <SearchIcon />
                </IconButton>
              </Tooltip>
            </div>
          )} 
        />
      </DataTable>

      <Dialog header="Detalles del Movimiento" visible={dialogVisible} style={{ width: '650px' }} onHide={closeDialog}>
        {selectedRowData && (
          <div>
            <div className="p-fluid details-dialog">
              <Card><p><strong>Fecha:</strong> {selectedRowData.fecha}</p></Card>
              <Card><p><strong>Tipo de Movimiento:</strong> {selectedRowData.tipo_movimiento}</p></Card>
              <Card><p><strong>Importe:</strong> {formatoMoneda(selectedRowData.importe)}</p></Card>
              <Card><p><strong>Descripción:</strong> {selectedRowData.descripcion_completa}</p></Card>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default AsociadoCuentaCorriente;
