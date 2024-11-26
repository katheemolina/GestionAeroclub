import React, { useEffect, useRef, useState } from 'react';
import './Styles/GestorCuentaCorriente.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { obtenerCuentaCorrienteAeroclub, obtenerCuentaCorrienteAeroclubDetalle } from '../../services/movimientosApi';
import PantallaCarga from '../../components/PantallaCarga';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { Button } from 'primereact/button';

function GestorCuentaCorriente({ idUsuario = 0 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const [detailData, setDetailData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cuentaCorrienteResponse = await obtenerCuentaCorrienteAeroclub(idUsuario);
        setData(cuentaCorrienteResponse);
        console.log(cuentaCorrienteResponse);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [idUsuario]);

  const formatoMoneda = (rowData) => {
    return `$ ${parseFloat(rowData.importe).toFixed(2)}`;
  };

  const openDialog = async (rowData) => {

    setSelectedRowData(rowData);
    setDialogVisible(true); 
  
    try {
      // console.log(rowData)
      const detalleMovimientoDialog = await obtenerCuentaCorrienteAeroclubDetalle(rowData.referencia_aeroclub);
      console.log(detalleMovimientoDialog)
      setDetailData(detalleMovimientoDialog)
    } catch (error) {
      console.error("Error al obtener detalles del movimiento:", error);

    }
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setSelectedRowData(null);
    setDetailData(null);
  };

  // Formatear fecha a DD/MM/AAAA HH:MM:SS
  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const año = date.getFullYear();
    const horas = String(date.getHours()).padStart(2, '0');
    const minutos = String(date.getMinutes()).padStart(2, '0');
    const segundos = String(date.getSeconds()).padStart(2, '0');
    return `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;
  };

  // Plantilla para mostrar la fecha 
  const plantillaFecha = (rowData) => {
    return formatearFecha(rowData.fecha);
  };

  const dt = useRef(null);
  const clearFilters = () => {
    if (dt.current) {
      dt.current.reset(); // Limpia los filtros de la tabla
    }
    
  };

  if (loading) {
    return <PantallaCarga />;
  }

  return (
    <div className="background">
      <div className="titulo-btn">
        <header className="header">
          <h1>Cuenta Corriente del Aeroclub</h1>
        </header>
      </div>

      <DataTable
      ref={dt}
        value={data}
        paginator
        rows={15}
        rowsPerPageOptions={[10, 15, 25, 50]}
        scrollable
        scrollHeight="800px"
        filterDisplay="row"
      >
      <Column
        field="referencia_aeroclub"
        header="Nro. Movimiento"
        sortable
        filter
        filterApply='numeric'
        filterPlaceholder="Numero de Movimiento"
        filterMatchMode="contains"
        showFilterMenu={false}
        
        
      />
        <Column
          field="fecha"
          header="Fecha"
          sortable
          filter
          filterPlaceholder="Buscar por fecha"
          filterMatchMode="contains"
          dataType="date"
          showFilterMenu={false}
          style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          filterType='date'
          body={plantillaFecha}
        />
        <Column
          field="asociado"
          header="Asociado"
          sortable
          filter
          filterPlaceholder="Buscar por asociado"
          filterMatchMode="contains"
          showFilterMenu={false}
          style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        />
        <Column
          field="descripcion_completa"
          header="Descripción"
          sortable
          filter
          filterPlaceholder="Buscar por descripcion"
          filterMatchMode="contains"
          showFilterMenu={false}
          style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        />
        <Column
          field="importe"
          header="Importe"
          sortable
          filter
          filterPlaceholder="Buscar por número"
          filterMatchMode="contains"
          body={formatoMoneda}
          showFilterMenu={false}
          style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        />
        <Column
        filter
        showFilterMenu={false}
        filterElement={
          <Button
            label="Limpiar"
            onClick={clearFilters}
            style={{ width: '100%', height: '40px',  padding: '10px'}}
          />
        }
          header="Acciones"
          body={(rowData) => (
            <div className="acciones">
              <Tooltip title="Ver detalles">
                <IconButton
                  color="primary"
                  aria-label="view-details"
                  onClick={() => openDialog(rowData)}
                >
                  <SearchIcon />
                </IconButton>
              </Tooltip>
            </div>
          )}
        />
      </DataTable>

      <Dialog header="Detalles del Movimiento" visible={dialogVisible} style={{ width: '450px' }} onHide={closeDialog}>
        {selectedRowData && (
          <div>
            <div className="p-fluid details-dialog">
              <Card><p><strong>Asociado:</strong> {selectedRowData.asociado}</p></Card>
              <Card><p><strong>Fecha:</strong> {selectedRowData.fecha}</p></Card>
              <Card><p><strong>Importe:</strong> {formatoMoneda(selectedRowData)}</p></Card>
              <Card><p><strong>Descripción:</strong> {selectedRowData.descripcion_completa}</p></Card>
             {detailData && detailData.length > 0 && detailData.map((data, index) => (
                <Card key={index}>
                  {data.id_movimiento !== null && (
                    <p><strong>Nro de movimiento:</strong> {data.id_movimiento}</p>
                  )}
                  {data.tipo !== null && (
                    <p><strong>Tipo:</strong> {data.tipo}</p>
                  )}
                  {data.tipo_recibo !== null && data.tipo_recibo === 'vuelo' && (
                    <div>
                      <p><strong>Tipo de recibo:</strong> {data.tipo_recibo}</p>
                      {data.cantidad !== null && (
                        <p><strong>Horas de vuelo:</strong> {data.cantidad}</p>
                      )}
                      {data.estado !== null && (
                        <p><strong>Estado:</strong> {data.estado}</p>
                      )}
                      {data.importe !== null && (
                        <p><strong>Importe:</strong> {data.importe_mov}</p>
                      )}
                      {data.observaciones !== null && (
                        <p><strong>Detalle:</strong> {data.observaciones_mov}</p>
                      )}
                      {data.observaciones !== null && (
                        <p><strong>Observaciones:</strong> {data.observaciones}</p>
                      )}
                      {data.instruccion !== null && (
                        <p><strong>Instrucción:</strong> {data.instruccion}</p>
                      )}
                      {data.instructor !== null && (
                        <p><strong>Instructor:</strong> {data.instructor}</p>
                      )}
                      {data.created_at !== null && (
                        <p><strong>Fecha del Movimiento:</strong> {data.fecha_creacion}</p>
                      )}
                    </div>
                  )}
                </Card>
              ))}
              
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default GestorCuentaCorriente;
