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
                <p>¿Está seguro de que desea generar el pago de estos recibos?</p>
      </Dialog>
    
    </div>
    
  );
}

export default GestorRecibos;