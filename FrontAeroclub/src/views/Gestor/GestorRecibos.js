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

  const handleEnviarSeleccionados = async () => {
    const idsMovimientos = selectedRecibos.map((recibo) => recibo.id_movimiento).join(",");

    try {
      const result = await pagarReciboApi(idsMovimientos);
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
    // Datos simulados (modifícalos con datos de tu API más adelante)
    const reciboData = {
      asociado: rowData.usuario || "-",
      aeronave: rowData.aeronave || "-",
      reciboNo: rowData.numero_recibo || "-",
      fecha: rowData.fecha || new Date().toLocaleDateString(),
      salida: rowData.salida || "-",
      llegada: rowData.llegada || "-",
      origen: rowData.origen || "-",
      destino: rowData.destino || "-",
      duracion: rowData.duracion || "-",
      aterrizajes: rowData.aterrizajes || "-",
      observaciones: rowData.observaciones || "Sin observaciones",
      tarifa: rowData.tarifa || "-",
      instruccion: rowData.instruccion || "-",
      importe: rowData.importe || "-",
    };
  
    // Crear un nuevo documento PDF
    const doc = new jsPDF();
  
    // Logo (esperar a que la imagen se cargue)
    const img = new Image();
    img.onload = () => {
      // Insertar logo más ancho en la parte superior izquierda
      doc.addImage(img, "PNG", 10, 10, 60, 30); // Ajusté el ancho a 60 y la altura a 30
  
      // Header principal
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Aero Club Lincoln", 105, 20, { align: "center" });
  
      doc.setFontSize(12);
      doc.text("Lincoln - Buenos Aires", 105, 28, { align: "center" });
      doc.text("Fundado el 22 de Mayo de 1945", 105, 34, { align: "center" });
  
      // Línea divisoria
      doc.setLineWidth(0.5);
      doc.line(10, 50, 200, 50);
  
      // Sección de datos principales
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Asociado: ${reciboData.asociado}`, 10, 60);
      doc.text(`Aeronave: ${reciboData.aeronave}`, 10, 70);
      doc.text(`Recibo Nº: ${reciboData.reciboNo}`, 10, 80);
      doc.text(`Fecha: ${reciboData.fecha}`, 10, 90);
  
      // Línea divisoria
      doc.setLineWidth(0.5);
      doc.line(10, 100, 200, 100);
  
      // Itinerarios en formato tabla con diseño de 3 columnas
      doc.setFont("helvetica", "bold");
      doc.text("Itinerarios", 10, 110);
      doc.setFont("helvetica", "normal");
  
      const itinerarios = [
        ["Salida", reciboData.salida],
        ["Llegada", reciboData.llegada],
        ["Origen", reciboData.origen],
        ["Destino", reciboData.destino],
        ["Duración", reciboData.duracion],
        ["Aterrizajes", reciboData.aterrizajes],
      ];
  
      const columnWidth = 60; // Ancho de cada columna
      let yOffset = 120; // Punto inicial de la tabla
      let xOffset = 10; // Punto inicial horizontal
  
      itinerarios.forEach(([key, value], index) => {
        const columnIndex = index % 3; // Columna actual (0, 1 o 2)
        const rowIndex = Math.floor(index / 3); // Fila actual (0 o 1)
  
        const xPosition = xOffset + columnIndex * columnWidth; // Posición horizontal de la columna
        const yPosition = yOffset + rowIndex * 10; // Posición vertical según la fila
  
        // Escribir el campo y su valor
        doc.text(`${key}:`, xPosition, yPosition);
        doc.text(`${value}`, xPosition + 25, yPosition);
      });
  
      // Espaciado para observaciones
      yOffset += 30; // Espaciado después de itinerarios
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Observaciones:", 10, yOffset);
  
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      yOffset += 8;
      doc.text(`${reciboData.observaciones}`, 10, yOffset, { maxWidth: 180 }); // Ajustar texto si es muy largo
  
      // Sección de tarifa e instrucción
  
      doc.setFont("helvetica", "normal");
      yOffset += 8;
      doc.text(`Tarifa: ${reciboData.tarifa}`, 10, yOffset);
      yOffset += 8;
      doc.text(`Instructor: ${reciboData.instruccion}`, 10, yOffset);
  
      // Total a pagar
      yOffset += 15;
      doc.setFont("helvetica", "bold");
      doc.text("Total a pagar:", 10, yOffset);
      doc.setFont("helvetica", "normal");
      doc.text(`${reciboData.importe}`, 60, yOffset);
  
      // Línea divisoria final
      yOffset += 10;
      doc.setLineWidth(0.5);
      doc.line(10, yOffset, 200, yOffset);
  
      // Crear la previsualización en una nueva ventana
      const pdfOutput = doc.output("bloburl"); // Genera una URL temporal del PDF
      const newWindow = window.open(); // Abre una nueva ventana
      newWindow.document.write(`
        <style>
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
          }
          iframe {
            border: none;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }
        </style>
        <iframe src="${pdfOutput}"></iframe>
      `);
    };
  
    img.src = logo; // Reemplaza con la ruta de tu logo
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