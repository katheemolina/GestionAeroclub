import React, { useEffect, useState } from "react";
import "./Styles/GestorRecibos.css";
import { obtenerTodosLosRecibos } from "../../services/recibosApi";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "../../styles/datatable-style.css"; // Estilado para la tabla
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import PantallaCarga from "../../components/PantallaCarga";
import { pagarReciboApi } from "../../services/generarReciboApi";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dropdown } from 'primereact/dropdown'; // P
import { Dialog } from 'primereact/dialog';

import { IconButton, Tooltip } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import jsPDF from "jspdf";
import logo from '../../icon-aeroclub.png'; // Ajusta la ruta según tu estructura
import { useUser } from "../../context/UserContext";


function GestorRecibos({ idUsuario = 0 }) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedRecibos, setSelectedRecibos] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recibosResponse = await obtenerTodosLosRecibos(idUsuario);
        setData(recibosResponse);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
      setLoading(false);
    };

    fetchData();
    console.log(data);
  }, [idUsuario]);

  const handleCheckboxChange = (recibo) => {
    const isAlreadySelected = selectedRecibos.some(
      (selected) => selected.numero_recibo === recibo.numero_recibo
    );

    if (isAlreadySelected) {
      // Deselect if already selected
      const updatedSelection = selectedRecibos.filter(
        (selected) => selected.numero_recibo !== recibo.numero_recibo
      );
      setSelectedRecibos(updatedSelection);

      // If no more recibos are selected, clear selectedUsuario
      if (updatedSelection.length === 0) setSelectedUsuario(null);
    } else {
      // Ensure same user is selected
      if (selectedUsuario && selectedUsuario !== recibo.usuario) {
        toast.warning("No puedes seleccionar recibos de diferentes usuarios.");
        return;
      }

      setSelectedRecibos([...selectedRecibos, recibo]);
      setSelectedUsuario(recibo.usuario);
    }
  };
  const idUsuarioEvento = useUser();
  const handleEnviarSeleccionados = async () => {
    const idsMovimientos = selectedRecibos.map((recibo) => recibo.id_movimiento).join(",");

    try {
      const result = await pagarReciboApi(idsMovimientos, idUsuarioEvento.usuarioId);
      toast.success("Recibos pagados correctamente.");
      setSelectedRecibos([]);
      setSelectedUsuario(null);

      // Recargar datos después de la operación
      const updatedData = await obtenerTodosLosRecibos(idUsuario);
      setData(updatedData);
    } catch (error) {
      toast.error(`Error al pagar los recibos: ${error.message}`);
    }
  };

  const renderCheckbox = (rowData) => {
    const isDisabled =
      selectedUsuario && selectedUsuario !== rowData.usuario; // Disable if different user
    const isChecked = selectedRecibos.some(
      (selected) => selected.numero_recibo === rowData.numero_recibo
    );

    return (
      <input
        type="checkbox"
        disabled={isDisabled || rowData.estado !== "Impago"}
        checked={isChecked}
        onChange={() => handleCheckboxChange(rowData)}
      />
    );
  };

  function reciboAdd(){
    navigate('/gestor/recibos/nuevo', {
      state: {  }  // Aquí pasamos el objeto 'user' como estado
    });
  }

  const estados = [
    { label: 'Pago', value: 'Pago' },
    { label: 'Impago', value: 'Impago' },
  ];
  const onEstadoChange = (e, options) => {
    setFiltroEstado(e.value);
    options.filterApplyCallback(e.value); // Aplica el filtro
  };





  const handlePreviewAndPrint = (rowData) => {
    console.log("Datos del recibo para generar PDF:", rowData);
    
    // Datos del recibo
    const reciboData = {
      recibo: rowData.tipo_recibo || "-",
      asociado: rowData.asociado || "-",
      aeronave: rowData.matricula || "-",
      reciboNo: rowData.numero_recibo || "-",
      fecha: rowData.fecha || new Date().toLocaleDateString(),
      observaciones: rowData.observaciones || "Sin observaciones",
      tarifa: rowData.importe_tarifa || "-",
      fechaViegenciaTarifa: rowData.fecha_vigencia_tarifa || "-",
      instructor: rowData.instructor || "-",
      importeTotal: rowData.importe_total || "-",
      importePorInstruccion: rowData.importe_por_instruccion|| "-",

    };
  
    // Parsear itinerarios
    const itinerarios = JSON.parse(rowData.datos_itinerarios || "[]");
  
    // Crear el documento PDF
    const doc = new jsPDF();
  
    const img = new Image();
    img.onload = () => {
      // Añadir cabecera con logo y datos de la empresa
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Aero Club Lincoln", 52, 20, { align: "center" });
      doc.setFontSize(12);
      doc.text("Lincoln - Buenos Aires", 52, 28, { align: "center" });
      doc.text("Fundado el 22 de Mayo de 1945", 52, 34, { align: "center" });
      doc.addImage(img, "PNG", 110, 10, 80, 30);
  
      // Añadir datos del recibo
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Asociado: ${reciboData.asociado}`, 20, 50);
      doc.text(`Aeronave: ${reciboData.aeronave}`, 20, 58);
      doc.setFont("helvetica", "bold");
      doc.text(`Recibo Nº: ${reciboData.reciboNo}`, 120, 50);
      doc.setFont("helvetica", "normal");
      doc.text(`Fecha: ${reciboData.fecha}`, 120, 58);
      doc.setLineWidth(0.3);
      doc.line(10, 66, 200, 66);
  
      // Encabezado de itinerarios
      doc.setFont("helvetica", "bold");
      doc.text("Itinerarios", 10, 74);
      doc.setFontSize(10);
  
      // Encabezados de la tabla
      const tableHeaders = ["Hora Salida", "Hora Llegada", "Origen", "Destino", "Duración", "Aterrizajes"];
      let xStart = 10;
      let yStart = 80;
      let colWidths = [30, 30, 40, 40, 30, 30]; // Ancho de cada columna
  
      tableHeaders.forEach((header, index) => {
        doc.setFont("helvetica", "bold");
        doc.text(header, xStart, yStart);
        xStart += colWidths[index];
      });
  
      // Renderizar los itinerarios
      yStart += 6; // Saltar al siguiente renglón después del encabezado
      itinerarios.forEach((itinerario, rowIndex) => {
        const {
          hora_salida = "-",
          hora_llegada = "-",
          origen = "-",
          destino = "-",
          duracion = "-",
          aterrizajes = "-",
        } = itinerario;
  
        // Alternar el fondo para las filas
        if (rowIndex % 2 === 0) {
          doc.setFillColor(230, 230, 230); // Gris claro
          doc.rect(10, yStart - 4, 190, 8, "F"); // Fondo de la fila
        }
  
        // Escribir los datos
        xStart = 10;
        const rowData = [hora_salida, hora_llegada, origen, destino, duracion, aterrizajes];
        rowData.forEach((data, colIndex) => {
          doc.setFont("helvetica", "normal");
          doc.text(`${data}`, xStart, yStart);
          xStart += colWidths[colIndex];
        });
  
        yStart += 10; // Avanzar al siguiente renglón
      });
  
      // Observaciones
      yStart += 10;
      doc.setFont("helvetica", "bold");
      doc.text("Observaciones:", 10, yStart);
      yStart += 6; // Espaciado para el contenido de observaciones
      doc.setFont("helvetica", "normal");
      doc.text(`${reciboData.observaciones}`, 20, yStart, { maxWidth: 180 });
      yStart += 6;
      doc.text(`Tarifa ${reciboData.aeronave} vigente desde ${reciboData.fechaViegenciaTarifa} - Valor hora: $${reciboData.tarifa}`, 20, yStart, { maxWidth: 180 });
  
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
      const duracionTotal = itinerarios.reduce((suma, itinerario) => {
        const duracion = parseFloat(itinerario.duracion) || 0; // Convertir a número flotante, si no es válido usa 0
        return suma + duracion;
      }, 0);

      // Calcular importe y importe de instrucción
      const tarifa = parseFloat(reciboData.tarifa) || 0; // Convertir tarifa a número flotante
      //const importePorInstruccion = parseFloat(reciboData.importePorInstruccion) || 0; // Usar la propiedad correcta del objeto reciboData

      // Importe total (sin instrucción)
      const importe = tarifa * duracionTotal; 

      // Importe por instrucción (si aplica)
      const instruccionImporte = reciboData.importePorInstruccion * duracionTotal; // Multiplicar por la duración total

      // Cuadro de importes en el PDF
      yStart += 10;
      doc.setFont("helvetica", "bold");
      doc.text("Importe:", 10, yStart);
      doc.setFont("helvetica", "normal");
      doc.text(`$${importe.toFixed(2)}`, 50, yStart); // Mostrar importe con 2 decimales

      
        yStart += 6;
        doc.setFont("helvetica", "bold");
        doc.text("Instrucción:", 10, yStart);
        doc.setFont("helvetica", "normal");
        doc.text(`$${instruccionImporte.toFixed(2)}`, 50, yStart); // Mostrar importe por instrucción con 2 decimales

      // Cuadro de duración total en el PDF
      yStart += 10;
      doc.setFont("helvetica", "bold");
      doc.text("Duración total:", 10, yStart);
      doc.setFont("helvetica", "normal");
      doc.text(`${duracionTotal.toFixed(1)}`, 50, yStart); // Mostrará la duración total con un decimal
  
      // Calcular el total de aterrizajes
      const totalAterrizajes = itinerarios.reduce((suma, itinerario) => {
        const aterrizajes = parseInt(itinerario.aterrizajes, 10) || 0; // Convertir a número entero, si no es válido usa 0
        return suma + aterrizajes;
      }, 0);

      // Cuadro de total de aterrizajes
      yStart += 10;
      doc.setFont("helvetica", "bold");
      doc.text("Total de aterrizajes:", 10, yStart);
      doc.setFont("helvetica", "normal");
      doc.text(`${totalAterrizajes}`, 50, yStart); // Muestra el total de aterrizajes
  
      yStart += 6;
      doc.setFont("helvetica", "bold");
      doc.text("Total a pagar:", 10, yStart);
      doc.setFont("helvetica", "normal");
      doc.text(`$${reciboData.importeTotal}`, 50, yStart);
  
      // Crear la previsualización
      const pdfOutput = doc.output("bloburl");
      const newWindow = window.open();
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

  // Formatear fecha a DD/MM/AAAA
  const formatearFecha = (fecha) => {
    const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

  // Plantilla para mostrar la fecha 
  const plantillaFecha = (rowData) => {
    return formatearFecha(rowData.fecha);
  };
  


  if (loading) {
    return <PantallaCarga />;
  }
  return (
    <div className="background">
      <ToastContainer />
      <header className="header">
        <h1>Recibos</h1>
      </header>
      <Button className="nuevo" label="Agregar Recibo" onClick={reciboAdd} />
      <Button
        className="enviar"
        label="Generar Pago de Recibo/os"
        onClick={() => setShowConfirmDialog(true)} /*handleEnviarSeleccionados*/ 
        disabled={selectedRecibos.length === 0}
      />
      <DataTable
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
          filterType='date' 
          showFilterMenu={false}
          className="columna-ancho-min"
          body={plantillaFecha}
        />
        <Column
          field="usuario"
          header="Asociado"
          sortable
          filter
          filterPlaceholder="Buscar por asociado"
          filterMatchMode="contains"
          showFilterMenu={false}
          className="columna-ancho-min"
        />
        <Column
          field="numero_recibo"
          header="N° Recibo"
          sortable
          filter
          filterPlaceholder="Buscar por número"
          filterMatchMode="contains"
          showFilterMenu={false}
          className="columna-ancho-min"
        />
        <Column
          field="tipo_recibo"
          header="Tipo de recibo"
          sortable
          filter
          filterPlaceholder="Buscar por tipo"
          filterMatchMode="contains"
          showFilterMenu={false}
          className="columna-ancho-min"
        />
        <Column
      field="estado"
      header="Estado"
      sortable
      filter
      filterField="estado"
      showFilterMenu={false}
      filterElement={(options) => (
        <Dropdown
          value={filtroEstado}
          options={estados}
          onChange={(e) => onEstadoChange(e, options)}
          placeholder="Seleccionar estado"
          className="p-column-filter"
        />
      )}
      
      
      className="columna-ancho-min"
    />
        <Column
          field="importe"
          header="Importe"
          sortable
          filter
          filterPlaceholder="Buscar por importe"
          filterMatchMode="contains"
          showFilterMenu={false}
          className="columna-ancho-min"
        />

        <Column
          body={(rowData) => (
            <IconButton
              onClick={() => handlePreviewAndPrint(rowData)}
              color="primary"
              title="Ver Recibo"
            >
              <PrintIcon />
            </IconButton>
          )}
          header="Acciones"
          className="columna-ancho-min"
        />
      </DataTable>

      <Dialog header="Confirmar" className="modal-confirmar-habilitacion" visible={showConfirmDialog} style={{ width: '350px' }} modal footer={
                <>
                    <Button label="Cancelar" 
                      className="p-button-text gestor-btn-cancelar" 
                      icon="pi pi-times" 
                      onClick={() => setShowConfirmDialog(false)}/>
                    <Button label="Confirmar" 
                      className="gestor-btn-confirmar" 
                        icon="pi pi-check"
                        onClick={() => {
                          handleEnviarSeleccionados();
                          setShowConfirmDialog(false);
                        }} autoFocus />
                </>
            } onHide={() => setShowConfirmDialog(false)}>
                <p>¿Está seguro de que desea generar el pago de la/los recibos seleccionados?</p>
      </Dialog>
    
    </div>
    
  );
}

export default GestorRecibos;