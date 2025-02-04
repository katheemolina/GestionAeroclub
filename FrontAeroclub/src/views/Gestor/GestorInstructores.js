import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { listarInstructores } from '../../services/generarReciboApi';
import '../../styles/datatable-style.css';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import Tooltip from '@mui/material/Tooltip';
import './Styles/GestorAsociados.css';
import { useNavigate } from 'react-router-dom';
import PantallaCarga from '../../components/PantallaCarga';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dropdown } from 'primereact/dropdown';

const GestorAsociados = () => {
    const [instructores, setInstructores] = useState([]);
    const [loading, setLoading] = useState(true);
     const [estadoCMAFiltro, setEstadoCMAFiltro] = useState(null);


    // Fetch instructores data from the API
    const fetchInstructores = async () => {
        setLoading(true);
        try {
            const response = await listarInstructores(); // Fetch instructores data
            console.log(response);
            // Actualizar el estado con la data
            if (response && response.data) {
                setInstructores(response.data);  // Aquí guardamos los datos
            }
        } catch (error) {
            console.error('Error fetching instructores or roles:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchInstructores();
    }, []);

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
        const color = rowData.estadoCMA === "Vigente"
          ? "rgb(76, 175, 80)"
          : rowData.estadoCMA === "Actualizar CMA"
          ? "rgb(255, 152, 0)" // Amarillo anaranjado
          : "rgb(169, 70, 70)"; // Rojo
      
        return (
          <span style={{ fontWeight: "bold", color }}>
            {rowData.estadoCMA}
          </span>
        );
    };

    const onEstadoCMAChange = (e, options) => {
        setEstadoCMAFiltro(e.value);
        options.filterApplyCallback(e.value); // Aplica el filtro
      };


      const OpcionesCMA = [
        { label: "Vigente", value: "Vigente" },
        { label: "Actualizar CMA", value: "Actualizar CMA" },
        { label: "Cargar CMA", value: "Cargar CMA" },
        { label: "No vigente", value: "No vigente" },
        { label: "Seleccione CMA", value: " "}
      ]


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
                <Column field="usuario" header="Instructor" sortable filter filterPlaceholder="Buscar por instructor" showFilterMenu={false}></Column>
                <Column field="estado" header="Estado" sortable filter filterPlaceholder="Buscar por estado" showFilterMenu={false}></Column>
                <Column field="tarifa_especial" header="Tarifa especial" body={tarifaEspecialTemplate} sortable filter filterPlaceholder="Buscar por estado" showFilterMenu={false}></Column>
                <Column field="horas_vuelo" header="Horas de vuelo totales" sortable filter filterPlaceholder="Buscar por horas de vuelo" showFilterMenu={false}></Column>
                <Column field="estadoCMA" header="Estado del CMA" body={estadoCMATemplate} sortable filter filterPlaceholder='Buscar por estado' showFilterMenu={false}
                                filterElement={(options) => (
                                    <Dropdown
                                    value={estadoCMAFiltro}
                                    options={OpcionesCMA}
                                    onChange={(e) => onEstadoCMAChange(e, options)}
                                    placeholder="Seleccione instrucción"
                                    style={{ width: '100%', height: '40px',  padding: '10px'}}
                                    />
                                    )
                                 }
                                ></Column>
                <Column field="saldo" header="Saldo" sortable filter filterPlaceholder="Buscar por saldo" showFilterMenu={false}></Column>
                <Column
                    filter
                    showFilterMenu={false}
                    filterElement={
                        <Button label="Limpiar" style={{ width: '100%', height: '40px', padding: '10px' }} />
                    }
                    style={{ width: '1px' }}
                    header="Acciones"
                    body={(rowData) => (
                        <div className="acciones">
                            <Tooltip title="Ver cuenta corriente">
                                <IconButton color="primary" aria-label="Settings">
                                    <SettingsIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    )}
                />
            </DataTable>
        </div>
    );
};

export default GestorAsociados;
