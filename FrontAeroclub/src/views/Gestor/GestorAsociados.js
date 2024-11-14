import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { listarAsociados, habilitarUsuario,deshabilitarUsuario,actualizarRoles ,eliminarRol} from '../../services/usuariosApi';
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
    const [loading, setLoading] = useState(true);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showEnableConfirmDialog, setShowEnableConfirmDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

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

      // Habilitar usuario
      const handleHabilitarUsuario = async () => {
        try {
            if (selectedUser) {
                await habilitarUsuario(selectedUser);
                fetchAsociados(); // Refresh data
            }
        } catch (error) {
            console.error('Error al habilitar usuario:', error);
        } finally {
            setShowEnableConfirmDialog(false);
            setSelectedUser(null);
        }
    };

    // Deshabilitar usuario
    const handleDeshabilitarUsuario = async () => {
        try {
            if (selectedUser) {
                await deshabilitarUsuario(selectedUser);
                fetchAsociados(); // Refresh data
            }
        } catch (error) {
            console.error('Error al deshabilitar usuario:', error);
        } finally {
            setShowConfirmDialog(false);
            setSelectedUser(null);
        }
    };

    // Actualizar roles
    const handleActualizarRoles = async (idUsuario, roles) => {
        try {
            await actualizarRoles(idUsuario, roles); // Aquí deberías definir 'roles' acorde a tus datos
            fetchAsociados(); // Refresh data
        } catch (error) {
            console.error('Error al actualizar roles:', error);
        }
    };


     // Abrir el diálogo de confirmación para habilitar usuario
     const confirmHabilitarUsuario = (idUsuario) => {
        setSelectedUser(idUsuario);
        setShowEnableConfirmDialog(true);
    };

    // Abrir el diálogo de confirmación para deshabilitar usuario
    const confirmDeshabilitarUsuario = (idUsuario) => {
        setSelectedUser(idUsuario);
        setShowConfirmDialog(true);
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
                <Column 
                        style={{width: '1px'}}
                        header="Acciones" 
                        body={(rowData) => (
                            <div className='acciones'>

                            {/* BOTON HABILTIAR USUARIO */}
                            <Tooltip title="Habilitar usuario">
                            <IconButton color="primary" aria-label="habilitar" onClick={() => confirmHabilitarUsuario(rowData.id_usuario)}>
                                <CheckCircleIcon /> 
                            </IconButton>
                            </Tooltip>

                            {/* BOTON DESHABILITAR USUARIO */}
                            <Tooltip title="Deshabilitar usuario">
                            <IconButton color="primary" aria-label="deshabilitar" onClick={() => confirmDeshabilitarUsuario(rowData.id_usuario)} >
                                <BlockIcon /> 
                            </IconButton>
                            </Tooltip>

                            {/* BOTON CAMBIO DE ROLES */}
                            <Tooltip title="Cambio de roles">
                            <IconButton color="primary" aria-label="roles" >
                                <SettingsIcon /> 
                            </IconButton>
                            </Tooltip>

                            {/* Botón de detalles del asociado */}
                            <Tooltip title="Ver perfil">
                            <IconButton color="primary" aria-label="view-details" onClick={() => handleGoToDetails(rowData.id_usuario)}>
                                <AccountCircleIcon />
                            </IconButton>
                            </Tooltip>
                            
                             {/* BOTON VER CUENTA CORRIENTE */}
                             <Tooltip title="Ver cuenta corriente">
                             <IconButton color="primary" aria-label="RequestQuote" >
                                <RequestQuoteIcon /> 
                            </IconButton>
                            </Tooltip>

                            </div>
                        )}
                        />
            </DataTable>
            
             {/* Dialogo de confirmación para habilitar */}
             <Dialog header="Confirmar" visible={showEnableConfirmDialog} style={{ width: '350px' }} modal footer={
                <>
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => setShowEnableConfirmDialog(false)} className="p-button-text" />
                    <Button label="Confirmar" icon="pi pi-check" onClick={handleHabilitarUsuario} autoFocus />
                </>
            } onHide={() => setShowEnableConfirmDialog(false)}>
                <p>¿Está seguro de que desea habilitar este usuario?</p>
            </Dialog>
            
            {/* Dialogo de confirmación para deshabilitar */}
            <Dialog header="Confirmar" visible={showConfirmDialog} style={{ width: '350px' }} modal footer={
                <>
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => setShowConfirmDialog(false)} className="p-button-text" />
                    <Button label="Confirmar" icon="pi pi-check" onClick={handleDeshabilitarUsuario} autoFocus />
                </>
            } onHide={() => setShowConfirmDialog(false)}>
                <p>¿Está seguro de que desea deshabilitar este usuario?</p>
            </Dialog>
            
        </div>
    );
};

export default GestorAsociados ;
