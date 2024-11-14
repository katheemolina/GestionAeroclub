import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { listarAsociados, actualizarEstadoAsociado } from '../../services/usuariosApi';
import '../../styles/datatable-style.css';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Icono de perfil
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import Tooltip from '@mui/material/Tooltip';
import './Styles/GestorAsociados.css';
import { useNavigate } from 'react-router-dom';
import PantallaCarga from '../../components/PantallaCarga';

const GestorAsociados  = () => {
    const navigate = useNavigate();
    const [asociados, setAsociados] = useState([]);
    const [asociadosDialog, setAsociadosDialog] = useState(false);
    const [asocicadosData, setAsociadosData] = useState({
        estado: ''
    });
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch aeronaves data from the API
    const fetchAsociados = async () => {
        try {
            const data = await listarAsociados(); // Asumiendo que ya es el array de aeronaves
            setAsociados(data);
        } catch (error) {
            console.error('Error fetching aeronaves:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAsociados();
    }, []);

    // Handle adding or updating aeronave
    const handleSave = async () => {
        try {
            if (isEdit) {
                await actualizarEstadoAsociado(asocicadosData.id_usuario, asocicadosData);
            } 
            setAsociadosDialog(false);
            fetchAsociados(); // Refresh the list
        } catch (error) {
            console.error('Error saving aeronave:', error);
        }
    };

    // Handle edit
    const handleEdit = (asociados) => {
        setAsociadosData(asociados);
        setIsEdit(true);
        setAsociadosDialog(true);
    };

    // Función para manejar la redirección cuando se hace clic en el botón
    const handleGoToDetails = (user) => {
        navigate('/gestor/dashboardAsociado', {
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
                value={asociados} 
                paginator 
                rows={10} 
                rowsPerPageOptions={[5, 10, 25]} 
                removableSort 
                scrollable
                scrollHeight="800px"
                style={{ width: '100%' }} >
                <Column field="usuario" header="Asociado" sortable ></Column>
                <Column field="estado" header="Estado" sortable></Column>
                <Column field="horas_vuelo" header="Horas de vuelo totales" sortable></Column>
                <Column field="estadoCMA" header="Estado del CMA" sortable></Column>
                <Column field="saldo" header="Saldo" sortable ></Column>
                <Column header="Acciones" 
                        body={(rowData) => (
                            <div className='acciones'>

                            {/* BOTON HABILTIAR USUARIO */}
                            <Tooltip title="Habilitar usuario">
                            <IconButton color="primary" aria-label="CheckCircle"  >
                                <CheckCircleIcon /> 
                            </IconButton>
                            </Tooltip>

                            {/* BOTON DESHABILITAR USUARIO */}
                            <Tooltip title="Deshabilitar usuario">
                            <IconButton color="primary" aria-label="Block"  >
                                <BlockIcon /> 
                            </IconButton>
                            </Tooltip>

                            {/* BOTON CAMBIO DE ROLES */}
                            <Tooltip title="Cambio de roles">
                            <IconButton color="primary" aria-label="settings" onClick={() => handleEdit(rowData)}>
                                <SettingsIcon /> 
                            </IconButton>
                            </Tooltip>

                            {/* Botón de detalles del asociado */}
                            <Tooltip title="Ver perfil">
                            <IconButton color="primary" aria-label="view-details" onClick={() => handleGoToDetails(rowData.id_usuario)}>
                                <AccountCircleIcon />
                            </IconButton>
                            </Tooltip>
                            
                             {/* BOTON DESHABILITAR USUARIO */}
                             <Tooltip title="Ver cuenta corriente">
                             <IconButton color="primary" aria-label="RequestQuote" >
                                <RequestQuoteIcon /> 
                            </IconButton>
                            </Tooltip>

                            </div>
                        )}
                        />
            </DataTable>

            <Dialog header={isEdit ? 'Actualizar Estado Asociado' : ''} visible={asociadosDialog} onHide={() => setAsociadosDialog(false)}>
                    <div className="p-field">
                        <label htmlFor="estado">Estado</label>
                        <InputText
                            id="estado"
                            value={asocicadosData.estado}
                            onChange={(e) => setAsociadosData({ ...asocicadosData, estado: e.target.value })}
                            placeholder="Estado"
                        />
                    <div className="p-d-flex p-jc-end">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={() => setAsociadosDialog(false)} />
                        <Button label="Guardar" icon="pi pi-check" id='btn-guardar' onClick={handleSave} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default GestorAsociados ;
