import React, { useEffect, useRef, useState } from 'react';
import "./Styles/AsociadoCuentaCorriente.css";
import { obtenerCuentaCorrientePorUsuario, obtenerCuentaCorrienteAeroclubDetalle } from '../../services/movimientosApi';
import { obtenerDatosDelUsuario } from '../../services/usuariosApi';
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
import { Button } from 'primereact/button';
import { toast } from 'react-toastify';

function AsociadoCuentaCorriente() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { usuarioId } = useUser();  
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [detalleMovimiento, setDetalleMovimiento] = useState(null);
  const [usuario, setUsuario] = useState(null); // Nuevo estado para almacenar los datos del usuario

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cuentaCorrienteResponse = await obtenerCuentaCorrientePorUsuario(usuarioId);
        setData(cuentaCorrienteResponse);
        console.log(cuentaCorrienteResponse)        
        // Obtener datos del usuario
        const usuarioResponse = await obtenerDatosDelUsuario(usuarioId);
        setUsuario(usuarioResponse);  // Guardar los datos del usuario en el estado   
      } catch (error) {
        toast.error("Error al obtener datos:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [usuarioId]);
  

  const openDialog = async (rowData) => {
    setSelectedRowData(rowData);
    try {
      const detalles = await obtenerCuentaCorrienteAeroclubDetalle(rowData.id_movimiento);
      setDetalleMovimiento(detalles);
    } catch (error) {
      toast.error("Error al obtener detalles del movimiento");
    }
    setDialogVisible(true);
  };
  

  const closeDialog = () => {
    setDialogVisible(false);
    setSelectedRowData(null);
    setDetalleMovimiento(null);
  };

  const formatoMoneda = (valor) => `$ ${parseFloat(valor).toFixed(2)}`;

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
          <h1>Cuenta Corriente</h1>
        </header>
      </div>

      <DataTable ref={dt} value={data} paginator rows={15} rowsPerPageOptions={[10, 15, 25, 50]} scrollable scrollHeight="800px" filterDisplay="row">
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
        <Column field="descripcion_completa" header="Descripción" sortable filter filterPlaceholder="Buscar por descripción" filterMatchMode="contains" showFilterMenu={false} />
        <Column field="importe" header="Importe" sortable body={(rowData) => formatoMoneda(rowData.importe)} filter filterPlaceholder="Buscar por importe" filterMatchMode="contains" showFilterMenu={false} />
        <Column
          header="Acciones"
          filter
          showFilterMenu={false}
          filterElement={
            <Button
              label="Limpiar"
              onClick={clearFilters}
              style={{ width: '100%', height: '40px', padding: '10px'}}
            />
          }
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

      <Dialog header="Detalles del Movimiento" visible={dialogVisible} style={{ width: '450px' }} onHide={closeDialog}>
        {selectedRowData && (
          <div>
            <div className="p-fluid details-dialog">
              {/*<Card><p><strong>Asociado:</strong> {selectedRowData.asociado}</p></Card>*/}
              <Card><p><strong>Descripción:</strong> {selectedRowData.descripcion_completa}</p></Card>
              <Card><p><strong>Estado:</strong> {selectedRowData.estado}</p></Card>
              <Card><p><strong>Fecha:</strong> {selectedRowData.fecha}</p></Card>
              <Card><p><strong>Importe:</strong> {formatoMoneda(selectedRowData.importe)}</p></Card>
              <Card><p><strong>Observaciones:</strong> {selectedRowData.observaciones}</p></Card>
              {detalleMovimiento && detalleMovimiento.length > 0 && detalleMovimiento.map((data, index) => (
                <Card key={index}>
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
                      {/*data.observaciones !== null && (
                        <p><strong>Observaciones:</strong> {data.observaciones}</p>
                      )*/}
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

export default AsociadoCuentaCorriente;
