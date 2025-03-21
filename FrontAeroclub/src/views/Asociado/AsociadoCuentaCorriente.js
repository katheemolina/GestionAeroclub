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


import PrintIcon from '@mui/icons-material/Print';
import jsPDF from "jspdf";
import logo from '../../icon-aeroclub.png';
import KpiBox from '../../components/KpiBox';


function AsociadoCuentaCorriente() {
  const [data, setData] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [loading, setLoading] = useState(true);
  const {usuarioId} = useUser();  
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [detalleMovimiento, setDetalleMovimiento] = useState(null);
  const [dataRecibos, setDataRecibos] = useState([]);
  //const [usuario, setUsuario] = useState(null);
  const [kpiData, setKpiData] = useState([]);

  const [recibosCache, setRecibosCache] = useState([]);

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
        setRecibosCache(recibosResponse);//Para los pdf
        //console.log("Todos los recibos:", recibosResponse);

        // Filtrar recibos utilizando un Set para optimizar la búsqueda
        const movimientosIds = new Set(cuentaCorrienteResponse.map((movimiento) => movimiento.id_movimiento));
        const filteredRecibos = recibosResponse.filter((recibo) => movimientosIds.has(recibo.id_movimiento));
        
        setDataRecibos(filteredRecibos);
        //console.log("Recibos filtrados:", filteredRecibos);

        // Obtener datos del usuario
        //const usuarioResponse = await obtenerDatosDelUsuario(usuarioId);
        //setUsuario(usuarioResponse); 
        
        

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
      //console.log("Detalles cta cte aeroclub x movimiento:", detalles)
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



  const mergedData = data.map((item) => {
    const recibo = dataRecibos.find((recibo) => recibo.id_movimiento === item.id_movimiento);
    //console.log("Recibo:", recibo)
    return { ...item, recibo }; // Añade los datos del recibo a cada fila
  });
  
  //RECIBOS PDF
  const handlePreviewAndPrint = async (rowData) => {
    //console.log("rowData", rowData);
  
    let recibo;
  
    // Si el tipo de recibo no es null
    if (rowData.tipo === "recibo") {
      // Buscar el recibo correspondiente en dataRecibos
      recibo = dataRecibos.find((recibo) => recibo.id_movimiento === rowData.id_movimiento);

    } else if (rowData.tipo === "pago") {
      // Obtener el número de recibo del texto después de "Recibo Nro."
      const numeroRecibo = rowData.descripcion_completa.match(/Recibo Nro\. (\d+)/)?.[1];
      //console.log("Número de recibo:", numeroRecibo);
  
      if (numeroRecibo) {
        //Busqueda del recibo de pago por intrucción 
        recibo = recibosCache.find((recibo) => recibo.numero_recibo == numeroRecibo);
      }
    } else {
      // Obtener el número de recibo del texto entre paréntesis en descripcion_completa
      const numeroRecibo = rowData.descripcion_completa.match(/\((\d+)\)/)?.[1];
      //console.log("Número de recibo (paréntesis):", numeroRecibo);
  
      if (numeroRecibo) {
        // Buscar el recibo por número en dataRecibos
        recibo = dataRecibos.find((recibo) => recibo.numero_recibo == numeroRecibo);
      }
    }
  
    // Si no se encuentra el recibo, mostrar un mensaje de error
    if (!recibo) {
      console.error("No se encontró el recibo asociado.");
      toast.error("No se encontró el recibo asociado.");
      return;
    }
  
    //console.log("Recibo encontrado:", recibo);
    

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
      if (recibo.instructor && recibo.instructor.trim() !== "") {
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

      if (recibo.instructor && recibo.instructor.trim() !== "") {
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
      let xTitle = 50; // Ajusta este valor para centrar títulos
      let xValue = 120; // Ajusta este valor para alinear con el monto
  
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
  
      // Insumo
      doc.text("Insumo:", xTitle, yStart);
      doc.setFont("helvetica", "bold");
      doc.text("Combustible 100LL", xValue, yStart);
  
      yStart += 10;
  
      // Cantidad de combustible
      doc.setFont("helvetica", "normal");
      doc.text("Cantidad de Combustible:", xTitle, yStart);
      doc.setFont("helvetica", "bold");
      doc.text(`${reciboData.cantidad} litros`, xValue, yStart);
  
      yStart += 10;
  
      // Cálculo de tarifa por litro
      const tarifaPorLitro = (parseFloat(reciboData.importeTotal) / parseFloat(reciboData.cantidad)).toFixed(2);
      doc.setFont("helvetica", "normal");
      doc.text("Tarifa por litro:", xTitle, yStart);
      doc.setFont("helvetica", "bold");
      doc.text(`$${tarifaPorLitro}`, xValue, yStart);
  
      yStart += 10;
    // Observaciones
    doc.setFont("helvetica", "normal");
    doc.text("Observaciones:", xTitle, yStart);

    // Ajuste automático del texto largo
    let observacionesTexto = doc.splitTextToSize(reciboData.observaciones, 70); // 60 es el ancho máximo en px
    doc.setFont("helvetica", "normal");
    doc.text(observacionesTexto, xValue, yStart, { align: "left" });

    yStart += 1 + (observacionesTexto.length * 3); // Ajustamos el espaciado dinámicamente

  
      // Línea divisoria
      yStart += 10;
      doc.setLineWidth(0.5);
      doc.line(10, yStart, 200, yStart);
  
      yStart += 8;
  
      // Total a pagar
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Total a pagar:", xTitle, yStart);
      doc.setFontSize(16);
      doc.text(`$${parseFloat(reciboData.importeTotal).toFixed(2)}`, xValue, yStart);
  
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
    
      // Mapeo de nombres de meses en inglés a español
      const meses = {
        "January": "Enero",
        "February": "Febrero",
        "March": "Marzo",
        "April": "Abril",
        "May": "Mayo",
        "June": "Junio",
        "July": "Julio",
        "August": "Agosto",
        "September": "Septiembre",
        "October": "Octubre",
        "November": "Noviembre",
        "December": "Diciembre"
      };

      // Reemplazar el mes en la observación si existe
      const observacionesLimpias = reciboData.observaciones.replace(
        /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/g,
        (match) => meses[match]
      );

      doc.setFont("helvetica", "normal");
      doc.text(observacionesLimpias, 70, yStart, { maxWidth: 180 });

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

export default AsociadoCuentaCorriente;
