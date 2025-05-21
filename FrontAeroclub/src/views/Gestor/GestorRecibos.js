import React, { useEffect, useRef, useState } from "react";
import "./Styles/GestorRecibos.css";
import { obtenerTodosLosRecibos} from "../../services/recibosApi";
import { obtenerCuentaCorrientePorUsuario, obtenerCuentaCorrienteAeroclubDetalle } from '../../services/movimientosApi';
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
import '../../components/styles/DialogConfirmacion.css'

import { IconButton, Tooltip } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import jsPDF from "jspdf";
import logo from '../../icon-aeroclub.png'; // Ajusta la ruta según tu estructura
import { useUser } from "../../context/UserContext";

import { generarReciboPDF } from "../generarRecibosPDF";

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
        //console.log(recibosResponse);
        
      } catch (error) {
        //console.error("Error al obtener datos:", error);
      }
      setLoading(false);
    };

    fetchData();
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
    { label: 'Seleccione estado', value: ' ' }
  ];
  const onEstadoChange = (e, options) => {
    setFiltroEstado(e.value);
    options.filterApplyCallback(e.value); // Aplica el filtro
  };

//IMPRIMIR RECIBO
  const handlePreviewAndPrint = async (rowData) => {
    // Variable para guardar la descripción de la cuota social (si aplica)
    let descripcionCuotaSocial = "-";

    // Solo si el tipo de recibo es 'cuota_social', se intenta obtener la descripción detallada
    if (rowData.tipo_recibo === "cuota_social") {
        try {
            // Se obtiene el detalle de movimientos del Aeroclub usando el ID del movimiento
            const detalles = await obtenerCuentaCorrienteAeroclubDetalle(rowData.id_movimiento);

            // Se busca dentro de los detalles el movimiento cuyo id_ref coincida con el número del recibo
            // y se extrae su descripción (si existe)
            descripcionCuotaSocial = detalles.find(mov => mov.id_ref === rowData.numero_recibo)?.descripcion_mov || "-";
        } catch {
            // Si ocurre algún error (por ejemplo, fallo en la API), se muestra un mensaje al usuario
            toast.error("No se encontró la descripción de la cuota.");
        }
    }

    // Se añade la descripción encontrada (o "-") directamente al objeto rowData
    // Así, la función de generación de PDF ya recibe todo listo sin necesidad de más lógica
    rowData.descripcionCuotaSocial = descripcionCuotaSocial;

    // Se llama a la función que genera el PDF, en modo directo (true),
    // lo que evita buscar en dataRecibo o recibosTodos
    generarReciboPDF(rowData, null, null, true);
};

  
  const plantillaFecha = (rowData) => {
    const fecha = new Date(rowData.fecha);
    const formatoFecha = fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    });
    const formatoHora = fecha.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    return `${formatoFecha} ${formatoHora}`;
  };

  const estadoPagoTemplate = (rowData) => (
    <span
      style={{
        fontWeight: "bold",
        color: rowData.estado === "Pago" ? "rgb(76, 175, 80)" : "rgb(169, 70, 70)",
      }}
    >
      {rowData.estado}
    </span>
  );

  const dt = useRef(null);
    const clearFilters = () => {
      if (dt.current) {
        dt.current.reset(); // Limpia los filtros de la tabla
      }
      setFiltroEstado('');
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
      <Button className="nuevo gestor-btn-confirmar" label="Agregar Recibo" onClick={reciboAdd} />
      <Button
        className="enviar"
        label="Generar Pago de Recibo/os"
        onClick={() => setShowConfirmDialog(true)} /*handleEnviarSeleccionados*/ 
        disabled={selectedRecibos.length === 0}
      />
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
        sortField="numero_recibo"
        sortOrder={-1}
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
        body={(rowData) => {
          if (rowData.tipo_recibo === 'cuota_social') {
            return 'Cuota Social';
          }
          if (rowData.tipo_recibo === 'vuelo') {
            return 'Vuelo';
          }
          if (rowData.tipo_recibo === 'combustible') {
            return 'Combustible';
          }
          return rowData.tipo_recibo;
        }}
      />
        <Column
      field="estado"
      header="Estado"
      sortable
      filter
      style={{width: '150px'}}
      filterField="estado"
      showFilterMenu={false}
      body={estadoPagoTemplate}
      filterElement={(options) => (
        <Dropdown
          value={filtroEstado}
          options={estados}
          onChange={(e) => onEstadoChange(e, options)}
          placeholder="Seleccione estado"
          className="p-column-filter"
          style={{ width: '100%', height: '40px',  padding: '10px'}}
        />
      )}
      
      
      className="columna-ancho-min"
    />
        <Column
          field="importe_total"
          header="Importe"
          sortable
          filter
          filterPlaceholder="Buscar por importe"
          filterMatchMode="contains"
          showFilterMenu={false}
          className="columna-ancho-min"
          body={(rowData) => `$ ${rowData.importe_total}`}
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

      <Dialog
        header="Confirmar"
        className="dialogConfirmar"
        visible={showConfirmDialog}
        style={{ width: '400px' }}
        modal
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '1rem' }}>
            <Button
              label="Cancelar"
              className="gestor-btn-cancelar"
              icon="pi pi-times"
              style={{ marginRight: '10px' }}
              onClick={() => setShowConfirmDialog(false)}
            />
            <Button
              label="Confirmar"
              className="p-button-secondary gestor-btn-confirmar"
              icon="pi pi-check"
              onClick={() => {
                handleEnviarSeleccionados();
                setShowConfirmDialog(false);
              }}
              autoFocus
            />
          </div>
        }
        onHide={() => setShowConfirmDialog(false)}
      >
        <p>¿Está seguro de que desea <b>realizar el pago de los recibos seleccionados</b>?</p>
      </Dialog>

    
    </div>
    
  );
}

export default GestorRecibos;