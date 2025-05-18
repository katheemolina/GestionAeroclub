
import { jsPDF } from "jspdf";
import { toast } from "react-toastify";
import logo from '../icon-aeroclub.png';
import {obtenerCuentaCorrienteAeroclubDetalle} from '../services/movimientosApi';


export const generarReciboPDF = async (rowData, dataRecibo, recibosTodos, modoDirecto = false) => {
    // rowData: contiene la información del recibo seleccionada.
    //console.log("rowData: ",rowData)
    // dataRecibo: lista de recibos filtrados (por id_movimiento).
    // recibosTodos: lista completa de recibos, por usuario claro.
    // modoDirecto: si es true, se utiliza directamente rowData como recibo (caso GestorRecibos).

    let recibo; // Variable donde se almacenará el recibo que se va a usar para generar el PDF.

    if (modoDirecto) {
        // Si viene desde GestorRecibos (modo directo), no hace falta buscar nada.
        // Se asume que rowData ya contiene toda la información necesaria y correcta.
        recibo = rowData;
    } else {
        // Si no es modo directo, se debe buscar el recibo dependiendo del tipo de dato en la fila.

        if (rowData.tipo === "recibo") {
            // Si es un recibo, lo buscamos por su id_movimiento en la lista filtrada de recibos.
            recibo = dataRecibo.find(r => r.id_movimiento == rowData.id_movimiento);
        } else if (rowData.tipo === "pago") {
            // Si es un pago, buscamos el número de recibo en la descripción del movimiento.
            // Por ejemplo: "Pago de Recibo Nro. 123"
            const numeroRecibo = rowData.descripcion_completa.match(/Recibo Nro\. (\d+)/)?.[1];

            if (numeroRecibo) {
                // Si se encontró el número, lo buscamos en la lista completa de recibos.
                recibo = recibosTodos.find(r => r.numero_recibo == numeroRecibo);
            }
        } else {
            // Si no es ni recibo ni pago, puede estar en otro formato (ej: "Cuota (123)").
            // Buscamos un número de recibo entre paréntesis.
            const numeroRecibo = rowData.descripcion_completa.match(/\((\d+)\)/)?.[1];

            if (numeroRecibo) {
                // Si se encontró el número, lo buscamos en los recibos filtrados.
                recibo = dataRecibo.find(r => r.numero_recibo == numeroRecibo);
            }
        }
    }

    // Si no se encontró ningún recibo (en modo normal), se muestra un mensaje de error.
    if (!recibo) {
        toast.error("No se encontró el recibo asociado.");
        return;
    }


  const reciboData = {
    tipoRecibo: recibo.tipo_recibo || "-",
    asociado: recibo.usuario || "-",
    aeronave: recibo.matricula || "-",
    numeroRecibo: (typeof recibo.numero_recibo === "number" && recibo.numero_recibo >= 0)? recibo.numero_recibo: "-", //para numeros mayor igual a cero
    fecha: recibo.fecha || new Date().toLocaleDateString(),
    observaciones: recibo.observaciones || "Sin observaciones",
    observacionesCuotaSocial: rowData.descripcionCuotaSocial || rowData.descripcion_completa || "-",
    tarifa: recibo.importe_tarifa || "-",
    fechaVigenciaTarifa: recibo.fecha_vigencia_tarifa || "-",
    instructor: recibo.instructor || "-",
    importePorInstruccion: recibo.importe_por_instruccion || "-",
    importeTotal: recibo.importe_total || "-",
    cantidad: recibo.cantidad || "-",
  };

  const itinerarios = JSON.parse(recibo.datos_itinerarios || "[]");

  const doc = new jsPDF();

  const img = new Image();
  img.onload = () => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Aero Club Lincoln", 52, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Lincoln - Buenos Aires", 52, 28, { align: "center" });
    doc.text("Fundado el 22 de Mayo de 1945", 52, 34, { align: "center" });
    doc.addImage(img, "PNG", 110, 10, 80, 30);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Asociado: ${reciboData.asociado}`, 20, 50);
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
      yStart += 6;

      doc.setFont("helvetica", "normal");

      // Divide el texto en líneas que no superen 180 de ancho
      const maxWidth = 180;
      const observacionesLineas = doc.splitTextToSize(reciboData.observaciones, maxWidth);

      // Imprime las líneas
      doc.text(observacionesLineas, 20, yStart);

      // Avanza yStart dinámicamente según la cantidad de líneas
      yStart += observacionesLineas.length * 5;

      // Ahora imprime la tarifa
      const tarifaText = `Tarifa ${reciboData.aeronave} vigente desde ${reciboData.fechaVigenciaTarifa} - Valor hora: $${reciboData.tarifa}`;
      const tarifaLineas = doc.splitTextToSize(tarifaText, maxWidth);

      doc.text(tarifaLineas, 20, yStart);

      // Detalles de instrucción (condicional)
      if (recibo.instructor && recibo.instructor.trim() !== "") {
        yStart += 6; // Espaciado solo si existe un instructor
        doc.text(`Vuelo con instrucción (Instructor: ${reciboData.instructor})`, 20, yStart, { maxWidth: 180 });
      }
  
      // Nueva línea divisoria
      yStart += 4;
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
      yStart += 7;

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
      yStart += 5;
      doc.setLineWidth(0.5);
      doc.line(10, yStart, 200, yStart);

      // Total a pagar (centrado y destacado al final)
      yStart += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14); // Tamaño más grande para destacar
      doc.text("Total a pagar:", 26, yStart, { align: "center" });
      doc.text(`$${parseFloat(reciboData.importeTotal).toFixed(2)}`, 80, yStart, { align: "center" });

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

      yStart += 1 + (observacionesTexto.length * 6); // Ajustamos el espaciado dinámicamente

  
      // Línea divisoria
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
      doc.text("Descripción:", 20, yStart);

      // Texto de la observación con ajuste automático de línea
      const maxWidth = 180;
      const lineasObs = doc.splitTextToSize(reciboData.observacionesCuotaSocial, maxWidth);
      doc.text(lineasObs, 70, yStart);

      // Ajustamos yStart dinámicamente
      yStart += lineasObs.length * 6;

      // Línea divisoria
      doc.setLineWidth(0.5);
      doc.line(10, yStart, 200, yStart);
    
      yStart += 8;
      
      // Total a pagar
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Total a pagar:", 20, yStart);
      doc.setFontSize(16);
      doc.text(`$${parseFloat(reciboData.importeTotal).toFixed(2)}`, 70, yStart);

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