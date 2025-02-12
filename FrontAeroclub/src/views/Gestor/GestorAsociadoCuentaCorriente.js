import React, { useEffect, useRef, useState } from 'react';
import "./Styles/AsociadoCuentaCorriente.css";
import { obtenerCuentaCorrientePorUsuario } from '../../services/movimientosApi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import PantallaCarga from '../../components/PantallaCarga';
import { useLocation } from 'react-router-dom';
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


function GestorAsociadoCuentaCorriente() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovimientos, setSelectedMovimientos] = useState([]); // Almacena los movimientos seleccionados
  const [dialogVisible, setDialogVisible] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const location = useLocation(); // Hook para obtener el estado de la navegación
  const { user } = location.state || {}; // Accedemos al estado pasado
  const usuarioId = user.id_usuario;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cuentaCorrienteResponse = await obtenerCuentaCorrientePorUsuario(usuarioId);
        //console.log("Cuenta corriente:", cuentaCorrienteResponse)
        setData(cuentaCorrienteResponse);
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

  // Función para abrir el diálogo de detalles
  const openDialog = (rowData) => {
    setSelectedRowData(rowData);
    setDialogVisible(true);
  };

  // Función para cerrar el diálogo
  const closeDialog = () => {
    setDialogVisible(false);
    setSelectedRowData(null);
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

  if (loading) {
    return <PantallaCarga />;
  }

  return (
    <>
      <ToastContainer />
      <div className="background">
        <header className="header">
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
              </div>
            )}
          />
        </DataTable>

        <Dialog header="Detalles del Movimiento" visible={dialogVisible} style={{ width: '600px' }} onHide={closeDialog}>
          {selectedRowData && (
            <div className="p-fluid details-dialog">
              <Card><p><strong>Fecha:</strong> {selectedRowData.fecha}</p></Card>
              <Card><p><strong>Tipo de movimiento:</strong> {selectedRowData.tipo_movimiento}</p></Card>
              <Card><p><strong>Importe:</strong> {formatoMoneda(selectedRowData)}</p></Card>
              <Card><p><strong>Descripción:</strong> {selectedRowData.descripcion_completa}</p></Card>
              <Card><p><strong>Estado:</strong> {selectedRowData.estado}</p></Card>
            </div>
          )}
        </Dialog>
      </div>
    </>
  );
}

export default GestorAsociadoCuentaCorriente;
