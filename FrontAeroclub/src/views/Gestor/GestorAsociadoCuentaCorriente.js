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
  const formatoMoneda = (rowData) => {
    return `$ ${parseFloat(rowData.importe).toFixed(2)}`;
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
    generarReciboPDF(rowData, dataRecibo, recibosTodos);
    //console.log ("Info de entrada, rowData:",rowData)
    //console.log ("Recibo filtrado, dataRecibo:",dataRecibo)
    //console.log ("Todos los recibos, recibosTodos",recibosTodos)
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
            body={formatoMoneda}
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
              style={{ width: '100%', height: '40px',  padding: '10px'}}
            />
          }
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

                {rowData.descripcion_completa !== null  && (
                  <IconButton
                    color="primary"
                    title="Ver Recibo"
                    onClick={() => handlePreviewAndPrint(rowData)}
                  >
                    <PrintIcon />
                  </IconButton>
                )}

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
                        <Card>  <p><strong>Fecha:</strong> {formatearFecha(selectedRowData.fecha)}</p></Card>
                        <Card><p><strong>Importe:</strong> {formatoMoneda(selectedRowData.importe)}</p></Card>
                        <Card><p><strong>Observaciones:</strong> {selectedRowData.observaciones ?? "Ninguna"}</p></Card>
                        {detalleMovimiento && detalleMovimiento.length > 0 && detalleMovimiento .filter(data => data.tipo_recibo === 'vuelo') 
                        .map((data, index) => (
                        <Card key={index}>
                            <div>
                              {/* Título según la posición del índice */}
                              <h4 style={{ textAlign: "center", marginBottom: "2%" }}>
                                <strong>{index === 0 ? "Detalles del vuelo" : "Detalles de instrucción"}</strong>
                              </h4>
        
                              {data.estado !== null && (
                                <p><strong>Estado:</strong> {data.estado}</p>
                              )}
                              {data.importe !== null && (
                                <p><strong>Importe:</strong> {data.importe_mov}</p>
                              )}
                              {index === 0 && data.cantidad !== null && (
                                <p><strong>Horas de vuelo:</strong> {data.cantidad}</p>
                              )}
                              {index === 0 && (
                                <p><strong>Observaciones:</strong> {data.observaciones !== null ? data.observaciones : "Ninguna"}</p>
                              )}
        
                              {(index === 0 || (index === 1 && data.instruccion?.includes("No"))) && (
                                <p><strong>Instrucción:</strong> {data.instruccion}</p>
                              )}
                              {index > 0 && data.instructor !== null && (
                                <p><strong>Instructor:</strong> {data.instructor}</p>
                              )}
                            </div>
                        </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </Dialog>
      </div>
    </>
  );
}

export default GestorAsociadoCuentaCorriente;
