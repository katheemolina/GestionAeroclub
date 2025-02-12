import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { listarInstructores } from '../../services/generarReciboApi';
import { tarifaEspecial } from '../../services/usuariosApi';
import '../../styles/datatable-style.css';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import Tooltip from '@mui/material/Tooltip';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogTitle from '@mui/material/DialogTitle';
import { Dialog } from 'primereact/dialog';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dropdown } from 'primereact/dropdown';
import './Styles/GestorAsociados.css';
import PantallaCarga from '../../components/PantallaCarga';

const GestorAsociados = () => {
    const [instructores, setInstructores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [estadoCMAFiltro, setEstadoCMAFiltro] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [tarifaChecked, setTarifaChecked] = useState(false);

    const fetchInstructores = async () => {
        setLoading(true);
        try {
            const response = await listarInstructores();
            //console.log("Instructores", response)
            if (response && response.data) {
                setInstructores(response.data);
            }
        } catch (error) {
            console.error('Error fetching instructores:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchInstructores();
    }, []);

    const handleOpenDialog = (instructor) => {
        setSelectedInstructor(instructor);
        setTarifaChecked(instructor.tarifa_especial === 1);
        setDialogOpen(true);
    };

    const handleSaveTarifa = async () => {
        if (!selectedInstructor) return;
        
        try {
            await tarifaEspecial(selectedInstructor.id_usuario, tarifaChecked);
            toast.success('Tarifa especial actualizada correctamente');
            fetchInstructores();
        } catch (error) {
            toast.error('Error al actualizar la tarifa especial');
        }

        setDialogOpen(false);
    };

         // Función para transformar el valor de 'tarifa_especial'
         const tarifaEspecialTemplate = (rowData) => {
            if (rowData.tarifa_especial === 0) {
                return "No aplica";
            } else if (rowData.tarifa_especial === 1) {
                return "Aplica";
            } else {
                return "No definido";
            }
        };

    const estadoCMATemplate = (rowData) => {
        const color = rowData.estadoCMA === "Vigente" ? "rgb(76, 175, 80)" : rowData.estadoCMA === "Actualizar CMA" ? "rgb(255, 152, 0)" : "rgb(169, 70, 70)";
        return <span style={{ fontWeight: "bold", color }}>{rowData.estadoCMA}</span>;
    };

    const OpcionesCMA = [
        { label: "Vigente", value: "Vigente" },
        { label: "Actualizar CMA", value: "Actualizar CMA" },
        { label: "Cargar CMA", value: "Cargar CMA" },
        { label: "No vigente", value: "No vigente" },
        { label: "Seleccione CMA", value: " " }
    ];

    if (loading) {
        return <PantallaCarga />;
    }

    return (
        <div className="background">
            <ToastContainer />
            <header className="header">
                <h1>Instructores</h1>
            </header>
            <DataTable
                filterDisplay="row"
                value={instructores}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                removableSort
                scrollable
                scrollHeight="800px"
                style={{ width: '100%' }}
            >
                <Column field="usuario" header="Instructor" sortable filter filterPlaceholder="Buscar por instructor" showFilterMenu={false} />
                <Column field="estado" header="Estado" sortable filter filterPlaceholder="Buscar por estado" showFilterMenu={false} />
                <Column field="tarifa_especial" header="Tarifa especial" body={tarifaEspecialTemplate} sortable filter filterPlaceholder="Buscar por estado" showFilterMenu={false} />
                <Column field="horas_vuelo" header="Horas de vuelo totales" sortable filter filterPlaceholder="Buscar por horas de vuelo" showFilterMenu={false} />
                <Column field="estadoCMA" header="Estado del CMA" body={estadoCMATemplate} sortable filter filterPlaceholder='Buscar por estado' showFilterMenu={false}
                    filterElement={(options) => (
                        <Dropdown
                            value={estadoCMAFiltro}
                            options={OpcionesCMA}
                            onChange={(e) => setEstadoCMAFiltro(e.value)}
                            placeholder="Seleccione instrucción"
                            style={{ width: '100%', height: '40px', padding: '10px' }}
                        />
                    )}
                />
                <Column field="saldo" header="Saldo" sortable filter filterPlaceholder="Buscar por saldo" showFilterMenu={false} />
                <Column
                    header="Acciones"
                    body={(rowData) => (
                        <div className="acciones">
                            <Tooltip title="Modificar tarifa especial">
                                <IconButton color="primary" onClick={() => handleOpenDialog(rowData)}>
                                    <SettingsIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    )}
                />
            </DataTable>

            <Dialog
                visible={dialogOpen}
                onHide={() => setDialogOpen(false)}
                header="Modificar Tarifa Especial"
                style={{ width: '450px'}}
                footer={
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '1rem' }}>
                    <Button onClick={() => setDialogOpen(false)} label="Cancelar"/>
                    <Button
                        onClick={handleSaveTarifa}
                        label="Guardar"
                        className='gestor-btn-confirmar'
                    />
                </div>
                }
            >
                    <FormControlLabel
                        control={<Checkbox checked={tarifaChecked} onChange={(e) => setTarifaChecked(e.target.checked)} />}
                        label="Aplicar tarifa especial"
                    />
            </Dialog>

        </div>
    );
};

export default GestorAsociados;
