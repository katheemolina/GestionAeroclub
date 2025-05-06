import React, { useEffect, useRef, useState } from 'react';
import './Styles/GestorCuentaCorriente.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { obtenerCuentaCorrienteAeroclub, obtenerCuentaCorrienteAeroclubDetalle } from '../../services/movimientosApi';
import { obtenerTodosLosRecibos } from "../../services/recibosApi";
import PantallaCarga from '../../components/PantallaCarga';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { Button } from 'primereact/button';

import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { generarReciboPDF } from "../generarRecibosPDF";
import PrintIcon from '@mui/icons-material/Print';
import jsPDF from "jspdf";
import logo from '../../icon-aeroclub.png';
import { KpiCards } from "../../components/KpiCards";


function GestorCuentaCorriente({ idUsuario = 0 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const [detailData, setDetailData] = useState({});

  const [dataRecibos, setDataRecibos] = useState([])


  useEffect(() => {
    const fetchData = async () => {
      try {
        const cuentaCorrienteResponse = await obtenerCuentaCorrienteAeroclub(idUsuario);
        setData(cuentaCorrienteResponse);
        //console.log("Cuenta corriente Aeroclub: ",cuentaCorrienteResponse);

        const recibosResponse = await obtenerTodosLosRecibos();
        setDataRecibos(recibosResponse);
        //console.log("Recibos:",recibosResponse)


      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [idUsuario]);

  const formatoMoneda = (valor) => {
    if (valor === null || valor === undefined || isNaN(valor)) return '$ 0.00';
    return `$ ${parseFloat(valor).toFixed(2)}`;
  };

  // Formato de moneda para la tabla
  const formatoMonedaTabla = (rowData) => {
    return formatoMoneda(rowData.importe);
  };

  const openDialog = async (rowData) => {
    setSelectedRowData(rowData);
  
    if (rowData.tipo !== "pago") {
      try {
        const detalles = await obtenerCuentaCorrienteAeroclubDetalle(rowData.referencia_aeroclub);
        // Buscar el recibo correspondiente
        const reciboEncontrado = dataRecibos.find(recibo => recibo.id_movimiento === rowData.referencia_aeroclub);
        if (reciboEncontrado) {
          setSelectedRowData({...rowData, recibo: reciboEncontrado});
        }
        setDetailData(detalles);
      } catch (error) {
        toast.error("Error al obtener detalles del movimiento");
      }
    } else {
      setDetailData(null);
    }
  
    setDialogVisible(true);
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
    
  const handlePreviewAndPrint = (rowData) => {
    //console.log("rowData: ", rowData);
  
    let recibo; // Variable para guardar el recibo encontrado
  
    // Si el tipo no es null (es un recibo generado por el sistema)
    if (rowData.tipo !== null) {
      // Buscar el recibo en la lista usando el id_movimiento guardado como referencia
      recibo = dataRecibos.find(recibo => recibo.id_movimiento === rowData.referencia_aeroclub);
    } else {
      // Si no tiene tipo (puede ser una cuota social sin tipo explícito),
      // intentar extraer el número de recibo desde la descripción
      const numeroRecibo = rowData.descripcion_completa.match(/\((\d+)\)/)?.[1];
  
      if (numeroRecibo) {
        // Buscar el recibo correspondiente por número en la lista de recibos
        recibo = dataRecibos.find(recibo => recibo.numero_recibo == numeroRecibo);
      }
    }
  
    // Si no se encontró el recibo, mostrar un error y frenar el proceso
    if (!recibo) {
      toast.error("No se encontró el recibo asociado.");
      return;
    }
    // Agregar al objeto del recibo la descripción original de la cuota social, necesaria para mostrarla correctamente en el PDF
    recibo.descripcionCuotaSocial = rowData.descripcion_completa || "-";
  
    // Llamar a la función que genera el PDF, pasando solo el recibo, y el flag `true` para que se saltee la lógica de búsqueda dentro de la función
    generarReciboPDF(recibo, null, null, true);
  };
  
  

  const renderDetalleMovimiento = (movimiento, recibo) => {
    if (!movimiento) return null;

    // Función auxiliar para extraer números de recibo de la descripción
    const extraerNumerosRecibo = (descripcion) => {
      const match = descripcion.match(/\((\d+)\)/);
      return match ? match[1] : null;
    };

    // Función auxiliar para renderizar el estado
    const renderEstado = (estado, descripcion) => {
      // Si el estado viene directamente del recibo, usarlo tal cual
      if (estado === 'Pago' || estado === 'Pendiente') {
        return (
          <span className={`estado-badge ${estado === 'Pago' ? 'estado-pago' : 'estado-impago'}`}>
            {estado}
          </span>
        );
      }
      
      // Si no, usar la lógica anterior como fallback
      const esPago = estado?.toLowerCase() === 'pago' || descripcion?.toLowerCase().includes('pago');
      const estadoNormalizado = esPago ? 'Pago' : 'Pendiente';
      return (
        <span className={`estado-badge ${estadoNormalizado === 'Pago' ? 'estado-pago' : 'estado-impago'}`}>
          {estadoNormalizado}
        </span>
      );
    };

    // Si es un pago, buscar los recibos relacionados
    if (movimiento.descripcion_completa?.includes("Pago de recibos:")) {
      const numerosRecibo = extraerNumerosRecibo(movimiento.descripcion_completa);
      const recibosPagados = dataRecibos.filter(r => r.numero_recibo.toString() === numerosRecibo);

      return (
        <div className="details-dialog">
          <div className="details-section">
            <h3>Pago de recibos: ({numerosRecibo})</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Estado</span>
                <span className="detail-value">{renderEstado(movimiento.estado, movimiento.descripcion_completa)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Fecha</span>
                <span className="detail-value">{formatearFecha(movimiento.fecha)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Importe total</span>
                <span className="detail-value importe-value">{formatoMoneda(movimiento.importe)}</span>
              </div>
            </div>
            <div className="observaciones-section">
              <span className="observaciones-label">Observaciones</span>
              <p className="observaciones-value">{movimiento.observaciones || "Ninguna"}</p>
            </div>
          </div>

          {recibosPagados.map((reciboPagado, index) => (
            <div key={index} className="recibo-pagado">
              <h4>Recibo pagado Nro. {reciboPagado.numero_recibo}</h4>
              {renderDetalleMovimiento(
                { 
                  ...movimiento, 
                  descripcion_completa: `Generacion de Recibo Nro. ${reciboPagado.numero_recibo}`,
                  importe: reciboPagado.importe_total,
                  estado: reciboPagado.estado,
                  fecha: reciboPagado.fecha
                },
                reciboPagado
              )}
            </div>
          ))}
        </div>
      );
    }

    // Si no es un pago, mostrar según el tipo de recibo
    if (!recibo) {
      // Si no hay recibo, intentar buscarlo en dataRecibos
      const reciboEncontrado = dataRecibos.find(r => r.id_movimiento === movimiento.referencia_aeroclub);
      if (reciboEncontrado) {
        recibo = reciboEncontrado;
      } else {
        return null;
      }
    }

    switch (recibo.tipo_recibo) {
      case "cuota_social":
        return (
          <div className="details-dialog">
            <div className="details-section">
              <h3>Recibo de cuota social del mes: {movimiento.descripcion_completa.split("mes:")[1]?.trim()}</h3>
              <div className="cuota-info">
                <div className="detail-item">
                  <span className="detail-label">Número de recibo</span>
                  <span className="detail-value">{recibo.numero_recibo}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Estado</span>
                  <span className="detail-value">{renderEstado(recibo.estado, movimiento.descripcion_completa)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Fecha</span>
                  <span className="detail-value">{formatearFecha(movimiento.fecha)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Importe</span>
                  <span className="detail-value importe-value">{formatoMoneda(movimiento.importe)}</span>
                </div>
              </div>
              <div className="observaciones-section">
                <span className="observaciones-label">Observaciones</span>
                <p className="observaciones-value">{recibo.observaciones || "Ninguna"}</p>
              </div>
            </div>
          </div>
        );

      case "vuelo":
        const itinerarios = JSON.parse(recibo.datos_itinerarios || "[]");
        const importeVuelo = recibo.importe_tarifa * recibo.cantidad;
        const importeInstructor = recibo.instructor ? (importeVuelo * 0.15) : 0; // 15% del importe del vuelo para el instructor

        return (
          <div className="details-dialog">
            <div className="details-section">
              <h3>Recibo de vuelo Nro. {recibo.numero_recibo}</h3>
              <div className="vuelo-info">
                <div className="detail-item">
                  <span className="detail-label">Estado</span>
                  <span className="detail-value">{renderEstado(recibo.estado, movimiento.descripcion_completa)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Fecha</span>
                  <span className="detail-value">{formatearFecha(movimiento.fecha)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Matrícula</span>
                  <span className="detail-value">{recibo.matricula}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Horas de vuelo</span>
                  <span className="detail-value">{recibo.cantidad}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tarifa por hora</span>
                  <span className="detail-value">{formatoMoneda(recibo.importe_tarifa)}</span>
                </div>
                {recibo.instructor && (
                  <div className="detail-item">
                    <span className="detail-label">Instructor</span>
                    <span className="detail-value">{recibo.instructor}</span>
                  </div>
                )}
              </div>

              <div className="importes-section">
                <h4>Desglose de Importes</h4>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Importe Vuelo</span>
                    <span className="detail-value importe-value">{formatoMoneda(importeVuelo)}</span>
                  </div>
                  {recibo.instructor && (
                    <div className="detail-item">
                      <span className="detail-label">Importe Instructor (15%)</span>
                      <span className="detail-value importe-value">{formatoMoneda(importeInstructor)}</span>
                    </div>
                  )}
                  <div className="detail-item total-importe">
                    <span className="detail-label">Total a Pagar</span>
                    <span className="detail-value importe-value">{formatoMoneda(movimiento.importe)}</span>
                  </div>
                </div>
              </div>

              {itinerarios.length > 0 && (
                <div className="vuelo-details">
                  <h4>Itinerarios</h4>
                  {itinerarios.map((itinerario, index) => (
                    <div key={index} className="itinerario-section">
                      <div className="details-grid">
                        <div className="detail-item">
                          <span className="detail-label">Origen</span>
                          <span className="detail-value">{itinerario.origen}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Destino</span>
                          <span className="detail-value">{itinerario.destino}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Hora salida</span>
                          <span className="detail-value">{itinerario.hora_salida}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Hora llegada</span>
                          <span className="detail-value">{itinerario.hora_llegada}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Aterrizajes</span>
                          <span className="detail-value">{itinerario.aterrizajes}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Duración</span>
                          <span className="detail-value">{itinerario.duracion} horas</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="observaciones-section">
                <span className="observaciones-label">Observaciones</span>
                <p className="observaciones-value">{recibo.observaciones || "Ninguna"}</p>
              </div>
            </div>
          </div>
        );

      case "combustible":
        const tarifaPorLitro = recibo.cantidad ? (parseFloat(recibo.importe_total) / parseFloat(recibo.cantidad)).toFixed(2) : 0;
        return (
          <div className="details-dialog">
            <div className="details-section">
              <h3>Recibo por compra de combustible Nro. {recibo.numero_recibo}</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Estado</span>
                  <span className="detail-value">{renderEstado(recibo.estado, movimiento.descripcion_completa)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Fecha</span>
                  <span className="detail-value">{formatearFecha(movimiento.fecha)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Importe</span>
                  <span className="detail-value importe-value">{formatoMoneda(movimiento.importe)}</span>
                </div>
              </div>
              <div className="combustible-info">
                <div className="detail-item">
                  <span className="detail-label">Cantidad de litros</span>
                  <span className="detail-value combustible-value">{recibo.cantidad}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tarifa por litro</span>
                  <span className="detail-value combustible-value">{formatoMoneda(tarifaPorLitro)}</span>
                </div>
              </div>
              <div className="observaciones-section">
                <span className="observaciones-label">Observaciones</span>
                <p className="observaciones-value">{recibo.observaciones || "Ninguna"}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return <PantallaCarga />;
  }

  return (
    <div className="background">
      <ToastContainer />
      <div className="titulo-btn">
        <header className="header">
          <h1>Cuenta Corriente del Aeroclub</h1>
        </header>
      </div>

      {/* Sección KPI*/}
      <KpiCards />
      {/* Sección KPI*/}

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
          filterPlaceholder="Buscar por importe"
          filterMatchMode="contains"
          body={formatoMonedaTabla}
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
 
                  { /*- rowData.tipo !== null && rowData.tipo !== "pago" && ( // Condición para mostrar el ícono solo si tipo no es null y es "pago"
                  <IconButton
                    color="primary"
                    title="Ver Recibo"
                    onClick={() => handlePreviewAndPrint(rowData)}
                  >
                    <PrintIcon />
                  </IconButton>
                  ) -*/}

                  {rowData.descripcion_completa !== null  && ( // Condición para mostrar el ícono solo si tipo no es null y es "pago"
                    <IconButton
                      color="primary"
                      title="Ver Recibo"
                      onClick={() => handlePreviewAndPrint(rowData)}
                    >
                      <PrintIcon />
                    </IconButton>
                  )}

              </Tooltip>
            </div>
          )}
        />
      </DataTable>

      <Dialog 
        header="Detalles del Movimiento" 
        visible={dialogVisible} 
        style={{ width: '700px' }} 
        onHide={closeDialog}
        className="custom-dialog"
      >
        {selectedRowData && renderDetalleMovimiento(selectedRowData, selectedRowData.recibo)}
      </Dialog>
    </div>
  );
}

export default GestorCuentaCorriente;
