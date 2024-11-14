import React, { useEffect, useState } from 'react';
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

    if (loading) {
      return <PantallaCarga/>
    }
    return (
        <div className="background">
        <header className="header">
          <h1>Asociados</h1>
        </header>
        <DataTable 
                value={data} 
                paginator rows={10} 
                rowsPerPageOptions={[5, 10, 25]} 
                style={{ width: '100%' }} >
                <Column field="usuario" header="Asociado"></Column>
                <Column field="estado" header="Estado"></Column>
                <Column field="horas_vuelo" header="Horas de vuelo totales"></Column>
                <Column field="estadoCMA" header="Estado del CMA"></Column>
                <Column header="Acciones"
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