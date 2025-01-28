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

import PrintIcon from '@mui/icons-material/Print';
import jsPDF from "jspdf";
import logo from '../../icon-aeroclub.png';


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
        console.log("Cuenta corriente Aeroclub: ",cuentaCorrienteResponse);

        const recibosResponse = await obtenerTodosLosRecibos();
        setDataRecibos(recibosResponse);
        console.log("Recibos:",recibosResponse)


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

  const handlePreviewAndPrint = (rowData) => {
    // Buscar el recibo correspondiente en dataRecibos
    const recibo = dataRecibos.find((recibo) => recibo.id_movimiento === rowData.referencia_aeroclub);
    console.log("Datos del recibo", recibo)


     // Datos del recibo
     const reciboData = {
      tipoRecibo: recibo.tipo_recibo || "-", // Tipo de recibo: "Vuelo" o "Combustible"
      asociado: recibo.usuario || "-",
      aeronave: recibo.matricula || "-",
      numeroRecibo: recibo.numero_recibo || "-",
      fecha: recibo.fecha || new Date().toLocaleDateString(),
      observaciones: recibo.observaciones || "Sin observaciones",
      tarifa: recibo.importe_tarifa || "-",
      fechaVigenciaTarifa: recibo.fecha_vigencia_tarifa || "-",
      instructor: recibo.instructor || "-",
      importePorInstruccion: recibo.importe_por_instruccion || "-",
      importeTotal: recibo.importe_total || "-",
      cantidad: recibo.cantidad || "-",
    };
  
    // Parsear itinerarios (solo para recibos de vuelo)
    const itinerarios = JSON.parse(recibo.datos_itinerarios || "[]");
  
    // Crear el documento PDF
    const doc = new jsPDF();
  
    const img = new Image();
    img.onload = () => {
      // Cabecera general
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Aero Club Lincoln", 52, 20, { align: "center" });
      doc.setFontSize(12);
      doc.text("Lincoln - Buenos Aires", 52, 28, { align: "center" });
      doc.text("Fundado el 22 de Mayo de 1945", 52, 34, { align: "center" });
      doc.addImage(img, "PNG", 110, 10, 80, 30);

      // Datos básicos (asociado, recibo, fecha)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Asociado: ${reciboData.asociado}`, 20, 50);
      // Mostrar "Aeronave" solo si el tipo de recibo es "Vuelo"
      if (reciboData.tipoRecibo === "vuelo") {
        doc.text(`Aeronave: ${reciboData.aeronave}`, 20, 58);
      }
      doc.setFont("helvetica", "bold");
      doc.text(`Recibo Nº: ${reciboData.numeroRecibo}`, 120, 50);
      doc.setFont("helvetica", "normal");
      doc.text(`Fecha: ${reciboData.fecha}`, 120, 58);
      doc.setLineWidth(0.3);
      doc.line(10, 66, 200, 66);
  
      // Lógica para recibo de "Vuelo"
      if (reciboData.tipoRecibo === "vuelo") {
        // Encabezado de itinerarios
        doc.setFont("helvetica", "bold");
        doc.text("Itinerarios", 10, 74);
        doc.setFontSize(10);
  
        // Tabla de itinerarios
        const tableHeaders = ["Hora Salida", "Hora Llegada", "Origen", "Destino", "Duración", "Aterrizajes"];
        let xStart = 10;
        let yStart = 80;
        const colWidths = [30, 30, 40, 40, 30, 30];
  
        tableHeaders.forEach((header, index) => {
          doc.setFont("helvetica", "bold");
          doc.text(header, xStart, yStart);
          xStart += colWidths[index];
        });
  
        yStart += 6;
        itinerarios.forEach((itinerario, rowIndex) => {
          const { hora_salida = "-", hora_llegada = "-", origen = "-", destino = "-", duracion = "-", aterrizajes = "-" } = itinerario;
  
          if (rowIndex % 2 === 0) {
            doc.setFillColor(230, 230, 230);
            doc.rect(10, yStart - 4, 190, 8, "F");
          }
  
          xStart = 10;
          const rowData = [hora_salida, hora_llegada, origen, destino, parseFloat(duracion).toFixed(1), aterrizajes];
          rowData.forEach((data, colIndex) => {
            doc.setFont("helvetica", "normal");
            doc.text(`${data}`, xStart, yStart);
            xStart += colWidths[colIndex];
          });
  
          yStart += 10;
        });
  
      // Observaciones
      
      doc.setFont("helvetica", "bold");
      doc.text("Observaciones:", 10, yStart);
      yStart += 6; // Espaciado para el contenido de observaciones
      doc.setFont("helvetica", "normal");
      doc.text(`${reciboData.observaciones}`, 20, yStart, { maxWidth: 180 });
      yStart += 6;
      doc.text(`Tarifa ${reciboData.aeronave} vigente desde ${reciboData.fechaVigenciaTarifa} - Valor hora: $${reciboData.tarifa}`, 20, yStart, { maxWidth: 180 });
  
      // Detalles de instrucción (condicional)
      if (reciboData.instructor && reciboData.instructor.trim() !== "") {
        yStart += 6; // Espaciado solo si existe un instructor
        doc.text(`Vuelo con instrucción (Instructor: ${reciboData.instructor})`, 20, yStart, { maxWidth: 180 });
      }
  
      // Nueva línea divisoria
      yStart += 10;
      doc.setLineWidth(0.3);
      doc.line(10, yStart, 200, yStart);
  
      // Calcular la duración total
      //const duracionTotal = itinerarios.reduce((suma, itinerario) => {
        //const duracion = parseFloat(itinerario.duracion) || 0; // Convertir a número flotante, si no es válido usa 0
        //return suma + duracion;
      //}, 0);

      // Calcular importe e importe de instrucción
      const tarifa = parseFloat(reciboData.tarifa) || 0; // Convertir tarifa a número flotante
      //const importePorInstruccion = parseFloat(reciboData.importePorInstruccion) || 0; // Usar la propiedad correcta del objeto reciboData

      // Importe total (sin instrucción)
      const importe = tarifa * reciboData.cantidad; 

      // Importe por instrucción (si aplica)
      const instruccionImporte = reciboData.importePorInstruccion * reciboData.cantidad; // Multiplicar por la duración total

      // Calcular el total de aterrizajes
      const totalAterrizajes = itinerarios.reduce((suma, itinerario) => {
        const aterrizajes = parseInt(itinerario.aterrizajes, 10) || 0; // Convertir a número entero, si no es válido usa 0
        return suma + aterrizajes;
      }, 0);

      // Cuadro de importes en el PDF
      yStart += 10;

      // Importe e Instrucción (uno debajo del otro, a la izquierda)
      doc.setFont("helvetica", "bold");
      doc.text("Importe:", 10, yStart);
      doc.setFont("helvetica", "normal");
      doc.text(`$${importe.toFixed(2)}`, 35, yStart); // Valor del importe

      yStart += 6; // Espaciado para la siguiente línea
      doc.setFont("helvetica", "bold");
      doc.text("Instrucción:", 10, yStart);
      doc.setFont("helvetica", "normal");

      if (reciboData.instructor && reciboData.instructor.trim() !== "") {
        doc.text(`$${instruccionImporte.toFixed(2)}`, 35, yStart); // Valor de instrucción
      } else {
        doc.text("-", 35, yStart); // Mostrar un guion si la condición no se cumple
      }

      // Duración total y Aterrizajes (alineados a la derecha)
      yStart -= 6; // Reposicionar para que estén a la misma altura que "Importe"
      doc.setFont("helvetica", "bold");
      doc.text("Duración total:", 120, yStart);
      doc.setFont("helvetica", "normal");
      doc.text(`${parseFloat(reciboData.cantidad).toFixed(1)}`, 155, yStart, { align: "right" });

      yStart += 6; // Espaciado para la siguiente línea
      doc.setFont("helvetica", "bold");
      doc.text("Aterrizajes:", 120, yStart);
      doc.setFont("helvetica", "normal");
      doc.text(`${totalAterrizajes}`, 155, yStart, { align: "right" }); // Valor de aterrizajes

      // Línea divisoria
      yStart += 10;
      doc.setLineWidth(0.5);
      doc.line(10, yStart, 200, yStart);

      // Total a pagar (centrado y destacado al final)
      yStart += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14); // Tamaño más grande para destacar
      doc.text("Total a pagar:", 105, yStart, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.text(`$${parseFloat(reciboData.importeTotal).toFixed(2)}`, 150, yStart, { align: "center" });

      // Línea divisoria
      yStart += 6;
      doc.setLineWidth(0.5);
      doc.line(10, yStart, 200, yStart);


  
    } else if (reciboData.tipoRecibo === "combustible") {
      let yStart = 74;
    
      // Detalle del recibo
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
    
      // Insumo
      doc.text("Insumo:", 20, yStart);
      doc.setFont("helvetica", "bold");
      doc.text("Combustible 100LL", 80, yStart);
    
      yStart += 10;
    
      // Cantidad de combustible
      doc.setFont("helvetica", "normal");
      doc.text("Cantidad de Combustible:", 20, yStart);
      doc.setFont("helvetica", "bold");
      doc.text(`${reciboData.cantidad} litros`, 80, yStart);
    
      yStart += 10;
    
      // Cálculo de tarifa por litro
      const tarifaPorLitro = (parseFloat(reciboData.importeTotal) / parseFloat(reciboData.cantidadCombustible)).toFixed(2);
      doc.setFont("helvetica", "normal");
      doc.text("Tarifa por litro:", 20, yStart);
      doc.setFont("helvetica", "bold");
      doc.text(`$${tarifaPorLitro}`, 80, yStart);
    
      yStart += 10;
    
      // Observaciones
      doc.setFont("helvetica", "bold");
      doc.text("Observaciones:", 20, yStart);
    
      doc.setFont("helvetica", "normal");
      doc.text(`${reciboData.observaciones}`, 80, yStart, { maxWidth: 180 });
    
      // Línea divisoria
      yStart += 10;
      doc.setLineWidth(0.5);
      doc.line(10, yStart, 200, yStart);
    
      yStart += 8;
      
      // Total a pagar
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Total a pagar:", 80, yStart);
      doc.setFontSize(16);
      doc.text(`$${parseFloat(reciboData.importeTotal).toFixed(2)}`, 125, yStart);

      // Línea divisoria
      yStart += 4;
      doc.setLineWidth(0.5);
      doc.line(10, yStart, 200, yStart);

    } else if (reciboData.tipoRecibo === "cuota_social" || reciboData.tipoRecibo === null ) {
      let yStart = 74;

      // Detalle del recibo
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
    
      // recibo
      doc.text("Recibo:", 20, yStart);
      doc.setFont("helvetica", "bold");
      doc.text("Cuota social", 70, yStart);
    
      yStart += 10;
    
      // Observaciones
      doc.setFont("helvetica", "normal");
      doc.text("Observaciones:", 20, yStart);
    
      doc.setFont("helvetica", "normal");
      doc.text(`${reciboData.observaciones}`, 70, yStart, { maxWidth: 180 });

      // Línea divisoria
      yStart += 10;
      doc.setLineWidth(0.5);
      doc.line(10, yStart, 200, yStart);
    
      yStart += 8;
      
      // Total a pagar
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Total a pagar:", 80, yStart);
      doc.setFontSize(16);
      doc.text(`$${parseFloat(reciboData.importeTotal).toFixed(2)}`, 125, yStart);

      // Línea divisoria
      yStart += 4;
      doc.setLineWidth(0.5);
      doc.line(10, yStart, 200, yStart);

    }
    
  
      // Crear la previsualización
      const pdfOutput = doc.output("bloburl");
      const newWindow = window.open();

      if (!newWindow) {
        toast.error("Popup bloqueado o fallo al abrir la ventana");
        return;
      }

      newWindow.document.write(`
        <style>
          body, html { margin: 0; padding: 0; height: 100%; width: 100%; }
          iframe { border: none; width: 100%; height: 100%; margin: 0; padding: 0; }
        </style>
        <iframe src="${pdfOutput}"></iframe>
      `);
    };
  
    img.src = logo; // Cambia esto por la ruta de tu logo


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
                {rowData.tipo !== null && rowData.tipo !== "pago" && ( // Condición para mostrar el ícono solo si tipo no es null y es "pago"
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
             {detailData && detailData.length > 0 && detailData.map((data, index) => (
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
