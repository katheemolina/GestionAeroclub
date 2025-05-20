import React, { useEffect, useRef, useState } from 'react';
import "./Styles/AsociadoCuentaCorriente.css";
import { obtenerCuentaCorrientePorUsuario, obtenerSaldoCuentaCorrientePorUsuario, obtenerCuentaCorrienteAeroclubDetalle } from '../../services/movimientosApi';
import { obtenerTodosLosRecibos } from "../../services/recibosApi";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import PantallaCarga from '../../components/PantallaCarga';
import { useLocation, useNavigate } from 'react-router-dom';
import { pagarReciboApi } from '../../services/generarReciboApi';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { useUser } from '../../context/UserContext';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { circularProgressClasses } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import PrintIcon from '@mui/icons-material/Print';
import { generarReciboPDF } from "../generarRecibosPDF";


function GestorAsociadoCuentaCorriente() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovimientos, setSelectedMovimientos] = useState([]); // Almacena los movimientos seleccionados
  const [dialogVisible, setDialogVisible] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [detalleMovimiento, setDetalleMovimiento] = useState(null);

  const location = useLocation(); // Hook para obtener el estado de la navegación
  const { user } = location.state || {}; // Accedemos al estado pasado
  const usuarioId = user.id_usuario;
  const navigate = useNavigate();

  const [dataRecibo, setDataRecibo] = useState([]);
  const [recibosTodos, setRecibosTodos] = useState([]);

  const handleBackClick = () => {
    navigate('/gestor/Asociados'); // Redirige a la ruta deseada
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cuentaCorrienteResponse = await obtenerCuentaCorrientePorUsuario(usuarioId);
        //console.log("Cuenta corriente:", cuentaCorrienteResponse)
        setData(cuentaCorrienteResponse);


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
        console.error("Error al obtener datos:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [usuarioId]);

  // Función para manejar cambios en el checkbox
  const handleCheckboxChange = (movimiento) => {
    const isAlreadySelected = selectedMovimientos.some(
      (selected) => selected.id_movimiento === movimiento.id_movimiento
    );

    if (isAlreadySelected) {
      // Deseleccionar
      const updatedSelection = selectedMovimientos.filter(
        (selected) => selected.id_movimiento !== movimiento.id_movimiento
      );
      setSelectedMovimientos(updatedSelection);
    } else {
      // Seleccionar
      setSelectedMovimientos([...selectedMovimientos, movimiento]);
    }
  };

  const openDialog = async (rowData) => {
    setSelectedRowData(rowData);
  
    if (rowData.tipo !== "pago") {
      try {
        const detalles = await obtenerCuentaCorrienteAeroclubDetalle(rowData.id_movimiento);
        // Buscar el recibo correspondiente
        const reciboEncontrado = dataRecibo.find(recibo => recibo.id_movimiento === rowData.id_movimiento);
        if (reciboEncontrado) {
          setSelectedRowData({...rowData, recibo: reciboEncontrado});
        }
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

  const idUsuarioEvento = useUser();
  // Función para procesar los movimientos seleccionados
  const handleEnviarSeleccionados = async () => {

    setConfirmDialogVisible(false); // Oculta el diálogo de confirmación

    const idsMovimientos = selectedMovimientos.map((movimiento) => movimiento.id_movimiento).join(",");
    try {
      // Llamar a la API para procesar los movimientos
      const result = await pagarReciboApi(idsMovimientos, idUsuarioEvento.usuarioId); // Asegúrate de usar el endpoint adecuado
      toast.success("Movimientos procesados correctamente.", { position: "top-right" });

      // Limpiar selección
      setSelectedMovimientos([]);

      // Recargar datos después de la operación
      const updatedData = await obtenerCuentaCorrientePorUsuario(usuarioId);
      setData(updatedData);
    } catch (error) {
      toast.error(`Error al procesar los movimientos: ${error.message}`, { position: "top-right" });
    }
  };

  // Formato de importe como moneda
  const formatoMoneda = (valor) => {
    if (valor === null || valor === undefined || isNaN(valor)) return '$ 0.00';
    return `$ ${parseFloat(valor).toFixed(2)}`;
  };

  // Renderizar checkbox en cada fila
  const renderCheckbox = (rowData) => {
    const isChecked = selectedMovimientos.some(
      (selected) => selected.id_movimiento === rowData.id_movimiento
    );

    const isDisabled = rowData.estado === "Pago"; // Deshabilitar si el estado es "Pago"

    return (
      <input
        type="checkbox"
        disabled={isDisabled}
        checked={isChecked}
        onChange={() => handleCheckboxChange(rowData)}
        style={{ cursor: 'pointer' }}
      />
    );
  };

  const dt = useRef(null);
  const clearFilters = () => {
    if (dt.current) {
      dt.current.reset(); // Limpia los filtros de la tabla
    }
    
  };


  //RECIBOS PDF - Importo datos necesarios
  const handlePreviewAndPrint = (rowData) => {
    const descripcion = rowData.descripcion_completa || "";
    const recibosAsociadosMatch = descripcion.match(/\(([^)]+)\)/); // Extrae "7,25"
  
    if (recibosAsociadosMatch) {
      const numerosStr = recibosAsociadosMatch[1];
      const numeros = numerosStr.split(',').map(n => n.trim());
  
      const recibosAProcesar = recibosTodos.filter(recibo =>
        numeros.includes(recibo.numero_recibo?.toString())
      );
  
      if (recibosAProcesar.length > 1) {
        const totalImporte = recibosAProcesar.reduce(
          (sum, r) => sum + parseFloat(r.importe_total ?? r.importe ?? 0),
          0
        );
  
        const numerosConcatenados = recibosAProcesar.map(r => r.numero_recibo).join(',');
  
        const reciboCombinado = {
          ...recibosAProcesar[0],
          tipo_recibo: "pagos_unidos",
          numero_recibo: numerosConcatenados,
          importe_total: totalImporte,
          recibos: recibosAProcesar,
          descripcionCuotaSocial: rowData.descripcion_completa || "-",
          usuario: recibosAProcesar[0].usuario
        };
  
        generarReciboPDF(reciboCombinado, null, null, true);
        return;
      }
    }
  
    // Si no hay múltiples recibos asociados, sigue como antes
    generarReciboPDF(rowData, dataRecibo, recibosTodos);
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
      // Si no hay recibo, intentar buscarlo en dataRecibo
      const reciboEncontrado = dataRecibo.find(r => r.id_movimiento === movimiento.id_movimiento);
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
        <header className="header">
          <Tooltip title="Ver Asociados">
            <IconButton 
              color="primary" 
              aria-label="Atras" 
              className="back-button" 
              onClick={handleBackClick}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <h1>Cuenta Corriente de {user.usuario}</h1>
        </header>
        <Button
          label="Procesar movimientos seleccionados"
          onClick={() => setConfirmDialogVisible(true)}
          disabled={selectedMovimientos.length === 0}
          className="procesar-button"
        />
        <Dialog
          header="Confirmar procesamiento"
          visible={confirmDialogVisible}
          onHide={() => setConfirmDialogVisible(false)}
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '1rem' }}>
              <Button label="Cancelar" icon="pi pi-times" onClick={() => setConfirmDialogVisible(false)} className="p-button-text" />
              <Button label="Confirmar" icon="pi pi-check" onClick={handleEnviarSeleccionados} style={{ backgroundColor: 'green', color: 'white' }} />
            </div>
          }
        >
          <p>¿Está seguro de que desea procesar los movimientos seleccionados?</p>
        </Dialog>

        <DataTable
          ref={dt}
          value={data}
          paginator
          rows={15}
          rowsPerPageOptions={[10, 15, 25, 50]}
          removableSort
          filterDisplay="row"
          scrollable
          scrollHeight="800px"
        >
          <Column
            body={renderCheckbox}
            header="Seleccionar"
            className="columna-ancho-min"
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
          />
          <Column
            field="descripcion_completa"
            header="Descripción"
            sortable
            filter
            filterPlaceholder="Buscar por descripción"
            filterMatchMode="contains"
            showFilterMenu={false}
          />
          <Column
            field="estado"
            header="Estado"
            sortable
            filter
            filterPlaceholder="Buscar por estado"
            filterMatchMode="contains"
            showFilterMenu={false}
          />
          <Column
            field="importe"
            header="Importe"
            sortable
            filter
            filterPlaceholder="Buscar por importe"
            filterMatchMode="contains"
            body={(rowData) => formatoMoneda(rowData.importe)}
            showFilterMenu={false}
          />
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

                  {rowData.descripcion_completa !== null && (
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

export default GestorAsociadoCuentaCorriente;
