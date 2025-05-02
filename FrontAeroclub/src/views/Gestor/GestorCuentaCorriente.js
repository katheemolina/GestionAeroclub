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

  const formatoMoneda = (rowData) => {
    return `$ ${parseFloat(rowData.importe).toFixed(2)}`;
  };

  const openDialog = async (rowData) => {

    setSelectedRowData(rowData);
    setDialogVisible(true); 
  
    try {
      //console.log("rowData",rowData)
      const detalleMovimientoDialog = await obtenerCuentaCorrienteAeroclubDetalle(rowData.referencia_aeroclub);
      //console.log("Detalle Movimiento dialog: ",detalleMovimientoDialog)
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

      <Dialog header="Detalles del Movimiento" visible={dialogVisible} style={{ width: '450px' }} onHide={closeDialog}>
        {selectedRowData && (
          <div>
            <div className="p-fluid details-dialog">
              <Card><p><strong>Asociado:</strong> {selectedRowData.asociado}</p></Card>
              <Card><p><strong>Fecha:</strong> {selectedRowData.fecha}</p></Card>
              <Card><p><strong>Importe:</strong> {formatoMoneda(selectedRowData)}</p></Card>
              <Card><p><strong>Descripción:</strong> {selectedRowData.descripcion_completa}</p></Card>
              {detailData && detailData.length > 0 && detailData
                .filter(data => data.tipo_recibo === 'vuelo') // Filtra solo los vuelos
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
  );
}

export default GestorCuentaCorriente;
