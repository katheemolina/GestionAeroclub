import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { movimientosNoLiquidadosPorInstructor } from '../../services/usuariosApi';
import { obtenerCuentaCorrienteAeroclubDetalle } from '../../services/movimientosApi';
import { obtenerTodosLosRecibos } from "../../services/recibosApi";
import '../../styles/datatable-style.css';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';
import PantallaCarga from '../../components/PantallaCarga';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button'; 
import { useUser } from '../../context/UserContext'; 
import { armarLiquidacionApi } from '../../services/generarReciboApi';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';

const GestorArmarLiquidacionInstructores = () => {
    const [movimientos, setMovimientos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovimientos, setSelectedMovimientos] = useState([]);
    const [selectedUsuario, setSelectedUsuario] = useState(null); 
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [detalleMovimiento, setDetalleMovimiento] = useState(null);
    
    const [recibosTodos, setRecibosTodos] = useState([]);

    const idUsuarioEvento = useUser(); // Supongo que este hook devuelve el id del usuario actual.

    // Fetch movimientos no liquidados
    const fetchInstructores = async () => {
        setLoading(true);
        try {
            const data = await movimientosNoLiquidadosPorInstructor(); // Fetch instructores
            //console.log("Movimiento de liquidación:",data)
            setMovimientos(data);

            // Obtener todos los recibos
            const recibosResponse = await obtenerTodosLosRecibos(idUsuarioEvento);
            setRecibosTodos(recibosResponse);//Para los pdf
            //console.log("Todos los recibos:", recibosResponse);
            
        } catch (error) {
            setMovimientos([]);
            console.error('Error fetching movimientos:', error);
        }
        setLoading(false);
    };

    useEffect(() => {

        fetchInstructores();
    }, []);

    // Formato de moneda
    const formatoMoneda = (rowData) => {
        return `$ ${parseFloat(rowData.importe).toFixed(2)}`;
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

    const opcionesEstado = [
    { label: 'Seleccione una opción', value: ' ' },
    { label: 'Pago', value: 'Pago' },
    { label: 'Impago', value: 'Impago' }
];

    const estadoFilterTemplate = (options) => {
    return (
        <Dropdown
            value={options.value}
            options={opcionesEstado}
            onChange={(e) => options.filterApplyCallback(e.value)}
            placeholder="Seleccione opción"
            className="p-column-filter"
            style={{ width: '100%', height: '40px',  padding: '10px'}}
        />
    );
};

    // Manejar el cambio del checkbox
    const handleCheckboxChange = (movimiento) => {
        const isAlreadySelected = selectedMovimientos.some(
            (selected) => selected.id_movimiento === movimiento.id_movimiento
        );

        if (isAlreadySelected) {
            // Deseleccionar si ya está seleccionado
            const updatedSelection = selectedMovimientos.filter(
                (selected) => selected.id_movimiento !== movimiento.id_movimiento
            );
            setSelectedMovimientos(updatedSelection);

            // Si no hay movimientos seleccionados, limpiar selectedUsuario
            if (updatedSelection.length === 0) setSelectedUsuario(null);
        } else {
            // Asegurar que el usuario sea el mismo para todos los movimientos seleccionados
            if (selectedUsuario && selectedUsuario !== movimiento.usuario) {
                toast.warning("No puedes seleccionar movimientos de diferentes usuarios.");
                return;
            }

            setSelectedMovimientos([...selectedMovimientos, movimiento]);
            setSelectedUsuario(movimiento.usuario);
        }
    };

    // Función para manejar el envío de los movimientos seleccionados (Generar liquidación)
    const handleEnviarSeleccionados = async () => {
        if (selectedMovimientos.length === 0) {
            toast.error("Debe seleccionar al menos un movimiento.");
            return;
        }

        // Generar el listado de IDs de los movimientos seleccionados
        const idsMovimientos = selectedMovimientos.map((movimiento) => movimiento.id_movimiento).join(",");
        
        // Aquí se realiza el proceso de pago o liquidación de los movimientos
        try {
            // Llamar a la API para procesar los movimientos seleccionados
            // Aquí debes ajustar la llamada a la API según tu implementación
            const result = await armarLiquidacionApi(idsMovimientos, idUsuarioEvento.usuarioId);
            toast.success("Movimientos liquidados correctamente.");
            
            // Limpiar la selección después de procesar
            setSelectedMovimientos([]);

            // Recargar los movimientos después de la operación
            fetchInstructores(); // Recarga los datos
        } catch (error) {
            toast.error(`Error al liquidar los movimientos: ${error.message}`);
        }
    };

    // Renderizar el checkbox en la columna
    const renderCheckbox = (rowData) => {
    const isChecked = selectedMovimientos.some(
        (selected) => selected.id_movimiento === rowData.id_movimiento
    );

    const isPagado = rowData.estado === "Pago";

    return (
        <input
            type="checkbox"
            checked={isChecked}
            disabled={isPagado}
            onChange={() => handleCheckboxChange(rowData)}
        />
    );
    };

    const handleVerDetalleMovimiento = async (movimiento) => {
        const numeroRecibo = movimiento.descripcion_completa?.match(/Recibo Nro\. (\d+)/)?.[1];
        if (!numeroRecibo) return;

        const recibo = recibosTodos.find(r => r.numero_recibo == numeroRecibo);
        if (recibo && recibo.tipo_recibo === 'vuelo') {
            setSelectedRowData(movimiento);
            setDetalleMovimiento(recibo);
            setDialogVisible(true);
        } else {
            toast.warn("Este movimiento no corresponde a un vuelo.");
        }
    };




    const renderDetalleMovimiento = (movimiento, recibo) => {

        if (!movimiento || !recibo || recibo.tipo_recibo !== 'vuelo') return null;

        const itinerarios = JSON.parse(recibo.datos_itinerarios || "[]");
        const importeVuelo = recibo.importe_tarifa * recibo.cantidad;
        const importeInstructor = recibo.instructor ? (importeVuelo * 0.15) : 0;

         // Función auxiliar para renderizar el estado
            const renderEstado = (estado) => (
            <span className={`estado-badge ${estado === 'Pago' ? 'estado-pago' : 'estado-impago'}`}>
                {estado}
            </span>
            );

        const formatoMoneda = (valor) => `$ ${parseFloat(valor).toFixed(2)}`;
        const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString('es-AR');

        return (
            <div className="details-dialog">
            <div className="details-section">
                <h3>Recibo de vuelo Nro. {recibo.numero_recibo}</h3>
                <div className="vuelo-info">
                <div className="detail-item">
                    <span className="detail-label">Estado</span>
                    <span className="detail-value">{renderEstado(recibo.estado, movimiento.descripcion_completa)}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Fecha</span>
                    <span className="detail-value">{formatearFecha(movimiento.fecha)}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Matrícula</span>
                    <span className="detail-value">{recibo.matricula}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Horas de vuelo</span>
                    <span className="detail-value">{recibo.cantidad}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Tarifa por hora</span>
                    <span className="detail-value">{formatoMoneda(recibo.importe_tarifa)}</span>
                </div>
                {recibo.instructor && (
                    <div className="detail-item">
                    <span className="detail-label">Instructor</span>
                    <span className="detail-value">{recibo.instructor}</span>
                    </div>
                )}
                </div>

                <div className="importes-section">
                <h4>Desglose de Importes</h4>
                <div className="details-grid">
                    <div className="detail-item">
                    <span className="detail-label">Importe Vuelo</span>
                    <span className="detail-value importe-value">{formatoMoneda(importeVuelo)}</span>
                    </div>
                    {recibo.instructor && (
                    <div className="detail-item">
                        <span className="detail-label">Importe Instructor (15%)</span>
                        <span className="detail-value importe-value">{formatoMoneda(importeInstructor)}</span>
                    </div>
                    )}
                    <div className="detail-item total-importe">
                    <span className="detail-label">Total a Pagar</span>
                    <span className="detail-value importe-value">{formatoMoneda(movimiento.importe)}</span>
                    </div>
                </div>
                </div>

                {itinerarios.length > 0 && (
                <div className="vuelo-details">
                    <h4>Itinerarios</h4>
                    {itinerarios.map((itinerario, index) => (
                    <div key={index} className="itinerario-section">
                        <div className="details-grid">
                        <div className="detail-item"><span className="detail-label">Origen</span><span className="detail-value">{itinerario.origen}</span></div>
                        <div className="detail-item"><span className="detail-label">Destino</span><span className="detail-value">{itinerario.destino}</span></div>
                        <div className="detail-item"><span className="detail-label">Hora salida</span><span className="detail-value">{itinerario.hora_salida}</span></div>
                        <div className="detail-item"><span className="detail-label">Hora llegada</span><span className="detail-value">{itinerario.hora_llegada}</span></div>
                        <div className="detail-item"><span className="detail-label">Aterrizajes</span><span className="detail-value">{itinerario.aterrizajes}</span></div>
                        <div className="detail-item"><span className="detail-label">Duración</span><span className="detail-value">{itinerario.duracion} horas</span></div>
                        </div>
                    </div>
                    ))}
                </div>
                )}

                <div className="observaciones-section">
                <span className="observaciones-label">Observaciones</span>
                <p className="observaciones-value">{recibo.observaciones || "Ninguna"}</p>
                </div>
            </div>
            </div>
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
        <div className="background">
            <ToastContainer/>
            <div className="titulo-btn">
                <header className="header">
                    <h1>Liquidación para Instructores</h1>
                </header>
            </div>

            {/* Botón para generar la liquidación */}
            <Button
                className="enviar"
                label="Generar Liquidación"
                onClick={() => setShowConfirmDialog(true)} 
                disabled={selectedMovimientos.length === 0} // Deshabilitar si no hay movimientos seleccionados
            />

            <DataTable
                ref={dt}
                value={movimientos}
                paginator
                rows={15}
                rowsPerPageOptions={[10, 15, 25, 50]}
                scrollable
                scrollHeight="800px"
                filterDisplay="row"
            >
                {/* Columna de Checkboxes */}
                <Column body={renderCheckbox} header="Seleccionar" />

                {/* Columna de Fecha */}
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
                    filterType="date"
                    body={plantillaFecha}
                />

                {/* Columna del Instructor */}
                <Column
                    field="instructor"
                    header="Instructor"
                    sortable
                    filter
                    filterPlaceholder="Buscar por Instructor"
                    filterMatchMode="contains"
                    showFilterMenu={false}
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                />

                {/* Columna de Descripción */}
                <Column
                    field="descripcion_completa"
                    header="Descripción"
                    sortable
                    filter
                    filterPlaceholder="Buscar por descripción"
                    filterMatchMode="contains"
                    showFilterMenu={false}
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                />

                {/* Columna de Importe */}
                <Column
                    field="importe"
                    header="Importe"
                    sortable
                    filter
                    filterPlaceholder="Buscar por importe"
                    filterMatchMode="contains"
                    body={formatoMoneda}
                    showFilterMenu={false}
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}
                />
                <Column
                field="estado"
                header="Estado"
                sortable
                filter
                filterField="estado"
                showFilterMenu={false}
                filterElement={estadoFilterTemplate}
                style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                body={(rowData) => (
                    <span style={{ color: rowData.estado === "Pago" ? 'green' : 'red', fontWeight: 'bold' }}>
                        {rowData.estado}
                    </span>
                )}
                />
                {/* Columna de Acciones */}
                <Column
                    filter
                    showFilterMenu={false}
                    filterElement={
                        <Button
                        label="Limpiar"
                        onClick={clearFilters}
                        style={{ width: '100%', height: '40px', padding: '10px' }}
                        />
                    }
                    header="Acciones"
                    body={(rowData) => (
                        <div className="acciones">
                        <IconButton
                            color="primary"
                            title="Ver detalles"
                            aria-label="view-details"
                            onClick={() => handleVerDetalleMovimiento(rowData)} // <- asegurate de tener esto
                        >
                            <SearchIcon />
                        </IconButton>
                        </div>
                    )}
                />


            </DataTable>

            <Dialog
                header="Confirmar"
                className="modal-confirmar-habilitacion"
                visible={showConfirmDialog}
                style={{ width: '350px' }}
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
                <p>¿Está seguro de que desea ejecutar las liquidaciones indicadas?</p>
            </Dialog>

            <Dialog
                header="Detalle del Vuelo"
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                className="custom-dialog"
                style={{ width: '700px' }}
                >
                {selectedRowData && detalleMovimiento
                    ? renderDetalleMovimiento(selectedRowData, detalleMovimiento)
                    : <p>No hay datos disponibles.</p>
                }
            </Dialog>



        </div>
    );
};

export default GestorArmarLiquidacionInstructores;
