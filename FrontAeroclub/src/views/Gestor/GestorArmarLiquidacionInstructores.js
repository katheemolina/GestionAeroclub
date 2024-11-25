import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { movimientosNoLiquidadosPorInstructor } from '../../services/usuariosApi';
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
import { Button } from 'primereact/button'; // Asegúrate de que tienes el componente Button de PrimeReact
import { useUser } from '../../context/UserContext'; // Contexto de usuario, si es necesario para la API
import { armarLiquidacionApi } from '../../services/generarReciboApi';

const GestorArmarLiquidacionInstructores = () => {
    const [movimientos, setMovimientos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovimientos, setSelectedMovimientos] = useState([]);
    const [selectedUsuario, setSelectedUsuario] = useState(null); // Aseguramos que todos los movimientos sean de un mismo usuario
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);

    const idUsuarioEvento = useUser(); // Supongo que este hook devuelve el id del usuario actual.

    // Fetch movimientos no liquidados
    const fetchInstructores = async () => {
        setLoading(true);
        try {
            const data = await movimientosNoLiquidadosPorInstructor(); // Fetch instructores
            setMovimientos(data);
        } catch (error) {
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

        return (
            <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleCheckboxChange(rowData)}
            />
        );
    };

    if (loading) {
        return <PantallaCarga />;
    }

    return (
        <div className="background">
            <ToastContainer />
            <div className="titulo-btn">
                <header className="header">
                    <h1>Liquidación para Instructores</h1>
                </header>
            </div>

            {/* Botón para generar la liquidación */}
            <Button
                className="enviar"
                label="Generar Liquidación"
                onClick={handleEnviarSeleccionados} 
                disabled={selectedMovimientos.length === 0} // Deshabilitar si no hay movimientos seleccionados
            />

            <DataTable
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
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                />

                {/* Columna de Acciones */}
                <Column
                    header="Acciones"
                    body={(rowData) => (
                        <div className="acciones">
                            <Tooltip title="Ver detalles">
                                <IconButton
                                    color="primary"
                                    aria-label="view-details"
                                    onClick={() => setSelectedRowData(rowData) && setDialogVisible(true)}
                                >
                                    <SearchIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    )}
                />
            </DataTable>

            {/* Diálogo de detalles */}
            <Dialog
                header="Detalles del Movimiento"
                visible={dialogVisible}
                style={{ width: '450px' }}
                onHide={() => setDialogVisible(false)}
            >
                {selectedRowData && (
                    <div>
                        <div className="p-fluid details-dialog">
                            <Card>
                                <p><strong>Fecha:</strong> {selectedRowData.fecha}</p>
                            </Card>
                            <Card>
                                <p><strong>Descripción:</strong> {selectedRowData.descripcion_completa}</p>
                            </Card>
                            <Card>
                                <p><strong>Importe:</strong> {formatoMoneda(selectedRowData)}</p>
                            </Card>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default GestorArmarLiquidacionInstructores;
