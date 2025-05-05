import React, { useEffect, useRef, useState } from 'react';
import "./Styles/AsociadoCuentaCorriente.css";
import { obtenerCuentaCorrientePorUsuario, obtenerSaldoCuentaCorrientePorUsuario, obtenerCuentaCorrienteAeroclubDetalle } from '../../services/movimientosApi';
//import { obtenerDatosDelUsuario } from '../../services/usuariosApi';
import { obtenerTodosLosRecibos } from "../../services/recibosApi";
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
import { ToastContainer } from 'react-toastify';

import KpiBox from '../../components/KpiBox';

import PrintIcon from '@mui/icons-material/Print';
import { generarReciboPDF } from "../generarRecibosPDF";


function AsociadoCuentaCorriente() {
  const [data, setData] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [loading, setLoading] = useState(true);
  const {usuarioId} = useUser();  
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [detalleMovimiento, setDetalleMovimiento] = useState(null);
  const [dataRecibo, setDataRecibo] = useState([]);
  //const [usuario, setUsuario] = useState(null);
  const [kpiData, setKpiData] = useState([]);

  const [recibosTodos, setRecibosTodos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kpiResponse = await obtenerSaldoCuentaCorrientePorUsuario(usuarioId);
        
        // Acceder al primer objeto del array
        const { Saldo, deuda_cuota_social, deuda_vuelos } = kpiResponse[0]; 
  
        setKpiData([
          { title: 'Saldo', value: Saldo },
          { title: 'Deuda de cuota social', value: deuda_cuota_social },
          { title: 'Deuda de vuelos', value: deuda_vuelos },
        ]);
  
      } catch (error) {
        toast.error("Error al obtener datos: " + error);
      }
      setLoading(false);
    };
    
    fetchData();
  }, [usuarioId]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const cuentaCorrienteResponse = await obtenerCuentaCorrientePorUsuario(usuarioId);
        setData(cuentaCorrienteResponse);
        
        //console.log("obtenerCuentaCorrientePorUsuario:",cuentaCorrienteResponse)

        // Obtener saldo de la cuenta corriente
        const saldoResponse = await obtenerSaldoCuentaCorrientePorUsuario(usuarioId);
        const saldoData = saldoResponse?.[0] || {};  // Accede al primer elemento
        const saldo = parseFloat(saldoData.Saldo) || 0;  // Convertir el saldo a número

        // Obtener todos los recibos
        const recibosResponse = await obtenerTodosLosRecibos(usuarioId);
        setRecibosTodos(recibosResponse);//Para los pdf
        //console.log("Todos los recibos:", recibosResponse);

        // Filtrar recibos utilizando un Set para optimizar la búsqueda
        const movimientosIds = new Set(cuentaCorrienteResponse.map((movimiento) => movimiento.id_movimiento));
        const filteredRecibos = recibosResponse.filter((recibo) => movimientosIds.has(recibo.id_movimiento));
        
        setDataRecibo(filteredRecibos);
        //console.log("Recibos filtrados:", filteredRecibos);

      } catch (error) {
        toast.error("Error al obtener datos:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [usuarioId]);

  const openDialog = async (rowData) => {
    setSelectedRowData(rowData);
  
    if (rowData.tipo !== "pago") {
      try {
        const detalles = await obtenerCuentaCorrienteAeroclubDetalle(rowData.id_movimiento);
        //console.log("Detalles cta cte aeroclub x movimiento:", detalles);
        setDetalleMovimiento(detalles);
      } catch (error) {
        toast.error("Error al obtener detalles del movimiento");
      }
    } else {
      setDetalleMovimiento(null);
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

  const mergedData = data.map((item) => {
    const recibo = dataRecibo.find((recibo) => recibo.id_movimiento === item.id_movimiento);
    //console.log("Recibo:", recibo)
    return { ...item, recibo }; // Añade los datos del recibo a cada fila
  });
  
  //RECIBOS PDF - Importo datos necesarios
  const handlePreviewAndPrint = (rowData) => {
    generarReciboPDF(rowData, dataRecibo, recibosTodos);
    //console.log ("Info de entrada, rowData:",rowData)
    //console.log ("Recibo filtrado, dataRecibo:",dataRecibo)
    //console.log ("Todos los recibos, recibosTodos",recibosTodos)
  };

  const renderDetalleMovimiento = (movimiento, recibo) => {
    if (!movimiento) return null;

    // Función auxiliar para extraer números de recibo de la descripción
    const extraerNumerosRecibo = (descripcion) => {
      const match = descripcion.match(/\((\d+)\)/);
      return match ? match[1] : null;
    };

    // Función auxiliar para renderizar el estado
    const renderEstado = (estado) => (
      <span className={`estado-badge ${estado === 'Pago' ? 'estado-pago' : 'estado-impago'}`}>
        {estado}
      </span>
    );

    // Si es un pago, buscar los recibos relacionados
    if (movimiento.descripcion_completa?.includes("Pago de recibos:")) {
      const numerosRecibo = extraerNumerosRecibo(movimiento.descripcion_completa);
      const recibosPagados = recibosTodos.filter(r => r.numero_recibo.toString() === numerosRecibo);

      return (
        <div className="details-dialog">
          <div className="details-section">
            <h3>Pago de recibos: ({numerosRecibo})</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Estado</span>
                <span className="detail-value">{renderEstado(movimiento.estado)}</span>
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
                { ...movimiento, descripcion_completa: `Generacion de Recibo Nro. ${reciboPagado.numero_recibo}` },
                reciboPagado
              )}
            </div>
          ))}
        </div>
      );
    }

    // Si no es un pago, mostrar según el tipo de recibo
    if (!recibo) return null;

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
                  <span className="detail-value">{renderEstado(movimiento.estado)}</span>
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
                <p className="observaciones-value">{movimiento.observaciones || "Ninguna"}</p>
              </div>
            </div>
          </div>
        );

      case "vuelo":
        const itinerarios = JSON.parse(recibo.datos_itinerarios || "[]");
        return (
          <div className="details-dialog">
            <div className="details-section">
              <h3>Recibo de vuelo Nro. {recibo.numero_recibo}</h3>
              <div className="vuelo-info">
                <div className="detail-item">
                  <span className="detail-label">Estado</span>
                  <span className="detail-value">{renderEstado(movimiento.estado)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Fecha</span>
                  <span className="detail-value">{formatearFecha(movimiento.fecha)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Importe</span>
                  <span className="detail-value importe-value">{formatoMoneda(movimiento.importe)}</span>
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
                <p className="observaciones-value">{movimiento.observaciones || "Ninguna"}</p>
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
                  <span className="detail-value">{renderEstado(movimiento.estado)}</span>
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
                <p className="observaciones-value">{movimiento.observaciones || "Ninguna"}</p>
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
    <>
      <ToastContainer />
      <div className="background">
        <div className="titulo-btn">
          <header className="header">
            <h1>Cuenta Corriente</h1>
          </header>
        </div>
        <KpiBox data={kpiData} />
        

        <DataTable ref={dt} value={mergedData} paginator rows={15} rowsPerPageOptions={[10, 15, 25, 50]} scrollable scrollHeight="800px" filterDisplay="row">
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
              <Tooltip>
                <IconButton
                  color="primary"
                  title="Ver detalles"
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

                ) -*/ }

                {rowData.descripcion_completa !== null  && ( // && rowData.descripcion_completa !== ("Liquidacion de pago de movimientos.")
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
    </>
  );
}

export default AsociadoCuentaCorriente;
