import React, { useEffect, useRef, useState } from 'react';
import './Styles/InstructorAsociados.css';
import { listarAsociados } from '../../services/usuariosApi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import IconButton from '@mui/material/IconButton';
import FlightIcon from '@mui/icons-material/Flight';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Icono de perfil
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import PantallaCarga from '../../components/PantallaCarga';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';


function InstructorAsociados({idUsuario = 0}){
  const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
        try {
            // Obtener vuelos
            const asociadosResponse = await listarAsociados(idUsuario);
            setData(asociadosResponse);
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
        setLoading(false); // Cambia el estado de carga
        };

        fetchData();
    }, [idUsuario]);
    
    // Función para manejar la redirección cuando se hace clic en el botón
    const handleGoToDetails = (user) => {
      navigate('/instructor/dashboardAsociado', {
        state: { user }  // Aquí pasamos el objeto 'user' como estado
      });
    };

    const handleGoToLibroVuelo = (user) => {
      navigate('/instructor/vuelos', {
        state: { user }  // Aquí pasamos el objeto 'user' como estado
      });
    };
    const estadoTemplate = (rowData) => (
      <span
        style={{
          fontWeight: "bold",
          color: rowData.estado === "Habilitado" ? "rgb(76, 175, 80)" : "rgb(169, 70, 70)",
        }}
      >
        {rowData.estado}
      </span>
  );
  
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

    const [estadoFiltro, setEstadoFiltro] = useState(null);
    const [estadoCMAFiltro, setEstadoCMAFiltro] = useState(null);

    const onEstadoChange = (e, options) => {
      setEstadoFiltro(e.value);
      options.filterApplyCallback(e.value); // Aplica el filtro
    };

    const onEstadoCMAChange = (e, options) => {
      setEstadoCMAFiltro(e.value);
      options.filterApplyCallback(e.value); // Aplica el filtro
    };

    const dt = useRef(null);
    const clearFilters = () => {
      if (dt.current) {
        dt.current.reset(); // Limpia los filtros de la tabla
        setEstadoFiltro(" ");
        setEstadoCMAFiltro(" ");
        }
    }

    const OpcionesEstados = [
      { label: "Habilitado", value: "Habilitado" },
      { label: "Deshabilitado", value: "Deshabilitado" },
      { label: "Seleccione estado", value: " "}
    ]

    const OpcionesCMA = [
      { label: "Vigente", value: "Vigente" },
      { label: "Actualizar CMA", value: "Actualizar CMA" },
      { label: "Cargar CMA", value: "Cargar CMA" },
      { label: "No vigente", value: "No vigente" },
      { label: "Seleccione CMA", value: " "}
    ]
      
  
    if (loading) {
      return <PantallaCarga/>
    }
    return (
        <div className="background">
        <header className="header">
          <h1>Asociados</h1>
        </header>
        <DataTable
                filterDisplay='row'
                ref={dt}
                value={data} 
                paginator rows={10} 
                rowsPerPageOptions={[5, 10, 25]} 
                style={{ width: '100%' }} >
                <Column field="usuario" header="Asociado" sortable filter filterPlaceholder='Buscar por asociado' showFilterMenu={false}></Column>
                <Column field="estado" header="Estado" body={estadoTemplate} sortable filter filterPlaceholder='Buscar por asociado' showFilterMenu={false}
                        filterElement={(options) => (
                            <Dropdown
                            value={estadoFiltro}
                            options={OpcionesEstados}
                            onChange={(e) => onEstadoChange(e, options)}
                            placeholder="Seleccione instrucción"
                            style={{ width: '100%', height: '40px',  padding: '10px'}}
                        />
                      )
                    }></Column>
                <Column field="horas_vuelo" header="Tiempo de vuelo total" sortable filter filterPlaceholder='Buscar por tiempo' showFilterMenu={false}></Column>
                <Column field="estadoCMA" header="Estado del CMA" body={estadoCMATemplate} sortable filter filterPlaceholder='Buscar por CMA' showFilterMenu={false}
                filterElement={(options) => (
                    <Dropdown
                    value={estadoCMAFiltro}
                    options={OpcionesCMA}
                    onChange={(e) => onEstadoCMAChange(e, options)}
                    placeholder="Seleccione instrucción"
                    style={{ width: '100%', height: '40px',  padding: '10px'}}
                    />
                    )
                 }></Column>
                <Column header="Acciones"
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
                            <div className='acciones'>

                            {/* Botón de editar */}
                            <Tooltip title="Ver libro de vuelo">
                            <IconButton color="primary" aria-label="view-flight-details" onClick={() => handleGoToLibroVuelo(rowData)}>
                                <FlightIcon />
                            </IconButton>
                            </Tooltip>

                            {/* Botón de detalles */}
                            <Tooltip title="Ver detalles">
                            <IconButton color="primary" aria-label="view-details" onClick={() => handleGoToDetails(rowData.id_usuario)}>
                                <AccountCircleIcon />
                            </IconButton>
                            </Tooltip>
                            </div>
                        )}
                        />
            </DataTable>
      </div>
    );
}

export default InstructorAsociados;