import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { listarAsociados, habilitarUsuario,deshabilitarUsuario,actualizarRoles, obtenerRolPorIdUsuario} from '../../services/usuariosApi';
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
import { Checkbox } from 'primereact/checkbox';

import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dropdown } from 'primereact/dropdown';

const GestorAsociados  = () => {
    const navigate = useNavigate();
    const [asociados, setAsociados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showEnableConfirmDialog, setShowEnableConfirmDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [roles, setRoles] = useState([]); // Para almacenar los roles disponibles
    const [selectedRoles, setSelectedRoles] = useState([]); // Para almacenar los roles seleccionados por el usuario
    const [showRoleDialog, setShowRoleDialog] = useState(false); // Para controlar la visibilidad del diálogo
    const [estadoFiltro, setEstadoFiltro] = useState(null);
    const [estadoCMAFiltro, setEstadoCMAFiltro] = useState(null);

    // Fetch aeronaves data from the API
    const fetchAsociados = async () => {
        setLoading(true);
        try {
            const data = await listarAsociados(); // Fetch asociados data
            const asociadosWithRoles = await Promise.all(
                data.map(async (asociado) => {
                    const roles = await obtenerRolPorIdUsuario(asociado.id_usuario);
                    const activeRoles = roles
                        .filter((role) => role.estado === 'activo')
                        .map((role) => role.descripcion)
                        .join(', '); // Concatenate active role descriptions
                    return { ...asociado, roles: activeRoles };
                })
            );
            setAsociados(asociadosWithRoles);
            //console.log(data)
        } catch (error) {
            console.error('Error fetching asociados or roles:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAsociados();
    }, []);

      // Habilitar usuario
      const handleHabilitarUsuario = async () => {
        setLoading(true);
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
        setLoading(false);
    };

    // Deshabilitar usuario
    const handleDeshabilitarUsuario = async () => {
        setLoading(true);
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
        setLoading(false);
    };

    // Función para cargar los roles de un usuario específico
    const fetchRoles = async (userId) => {
        try {
            const data = await obtenerRolPorIdUsuario(userId); // Asumiendo que tienes un servicio para obtener los roles del usuario
            setRoles(data);
            setSelectedRoles(data.filter(role => role.estado === 'activo').map(role => role.id_rol)); // Los roles activos se marcarán por defecto
            setShowRoleDialog(true);
        } catch (error) {
            console.error('Error al obtener los roles:', error);
        }
        setSelectedUser(userId);
    };

    // Función para manejar el cambio de estado de los checkboxes
    const handleRoleChange = (event) => {
        const { value, checked } = event.target;
        setSelectedRoles((prevRoles) => 
            checked ? [...prevRoles, value] : prevRoles.filter(role => role !== value)
        );
    };

    // Función para enviar la actualización de roles
    const handleUpdateRoles = async () => {
        try {
            // Crear el arreglo de roles actualizado
            const updatedRoles = roles.map((role) => ({
                IdRol: role.id_rol,
                Estado: selectedRoles.includes(role.id_rol) ? 1 : 0 // 1 si está seleccionado, 0 si no
            }));
            //console.log(selectedUser,updatedRoles);
            // Llamar a la función que realiza la solicitud HTTP
            await actualizarRoles(selectedUser, updatedRoles); 
    
            // Refrescar la lista de asociados (u otros datos si es necesario)
            fetchAsociados(); 
        } catch (error) {
            console.error('Error al actualizar roles:', error);
        } finally {
            // Cerrar el diálogo de roles
            setShowRoleDialog(false);
        }
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
    
      const handleGoToCuentaCorriente = (user) => {
        navigate('/gestor/asociadoCuentaCorriente', {
          state: { user }  // Aquí pasamos el objeto 'user' como estado
        });
      };

      const onEstadoChange = (e, options) => {
        setEstadoFiltro(e.value);
        options.filterApplyCallback(e.value); // Aplica el filtro
      };

      const onEstadoCMAChange = (e, options) => {
        setEstadoCMAFiltro(e.value);
        options.filterApplyCallback(e.value); // Aplica el filtro
      };
      
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

    const dt = useRef(null);
    const clearFilters = () => {
      if (dt.current) {
        dt.current.reset(); // Limpia los filtros de la tabla
        }
    }
      
    if (loading) {
        return <PantallaCarga/>
    }  
    return (
        <div className="background">
            <ToastContainer></ToastContainer>
            <header className="header">
                <h1>Asociados</h1>
            </header>
            <DataTable 
                filterDisplay='row'
                ref={dt}
                value={asociados} 
                paginator 
                rows={10} 
                rowsPerPageOptions={[5, 10, 25]} 
                removableSort 
                scrollable
                scrollHeight="800px"
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
                    }
                
                />
                
                
                <Column field="roles" header="Roles Activos" sortable filter filterPlaceholder='Buscar por roles' showFilterMenu={false}></Column> 
                <Column field="horas_vuelo" header="Horas de vuelo totales" sortable filter filterPlaceholder='Buscar por asociado' showFilterMenu={false}></Column>
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
                <Column field="saldo" header="Saldo" sortable filter filterPlaceholder='Buscar por saldo' showFilterMenu={false}></Column>
                <Column filter
                    showFilterMenu={false}
                    filterElement={
                        <Button
                        label="Limpiar"
                        onClick={clearFilters}
                        style={{ width: '100%', height: '40px',  padding: '10px'}}
                        />
                        }
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
                            <IconButton color="primary" aria-label="roles" onClick={() => fetchRoles(rowData.id_usuario)}>
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
                             <IconButton color="primary" aria-label="RequestQuote" onClick={() => handleGoToCuentaCorriente(rowData)}>
                                <RequestQuoteIcon /> 
                            </IconButton>
                            </Tooltip>

                            </div>
                        )}
                        />
            </DataTable>
            
             {/* Dialogo de confirmación para habilitar */}
             <Dialog header="Confirmar" className="modal-confirmar-habilitacion" visible={showEnableConfirmDialog} style={{ width: '350px' }} modal footer={
                <>
                    <Button label="Cancelar" className="p-button-text gestor-btn-cancelar" icon="pi pi-times" onClick={() => setShowEnableConfirmDialog(false)}/>
                    <Button label="Confirmar" className="gestor-btn-confirmar" icon="pi pi-check" onClick={handleHabilitarUsuario} autoFocus />
                </>
            } onHide={() => setShowEnableConfirmDialog(false)}>
                <p>¿Está seguro de que desea habilitar este usuario?</p>
            </Dialog>
            
            {/* Dialogo de confirmación para deshabilitar */}
            <Dialog header="Confirmar"  className="modal-confirmar-habilitacion" visible={showConfirmDialog} style={{ width: '350px' }} modal footer={
                <>
                    <Button label="Cancelar" className="p-button-text gestor-btn-cancelar" icon="pi pi-times" onClick={() => setShowConfirmDialog(false)} />
                    <Button label="Confirmar" className="gestor-btn-confirmar" icon="pi pi-check" onClick={handleDeshabilitarUsuario} autoFocus />
                </>
            } onHide={() => setShowConfirmDialog(false)}>
                <p>¿Está seguro de que desea deshabilitar este usuario?</p>
            </Dialog>
            
            {/* Dialogo para el cambio de roles */}
            <Dialog 
                header="Cambio de Roles" 
                visible={showRoleDialog} 
                style={{ width: '400px' }} 
                modal 
                footer={
                    <>
                        <Button 
                            label="Cancelar" 
                            icon="pi pi-times" 
                            onClick={() => setShowRoleDialog(false)} 
                            className="p-button-text gestor-btn-cancelar" 
                        />
                        <Button 
                            label="Confirmar" 
                            icon="pi pi-check" 
                            onClick={handleUpdateRoles} 
                            autoFocus 
                            className="gestor-btn-confirmar"
                        />
                    </>
                } 
                onHide={() => setShowRoleDialog(false)}
            >
                <div className="p-d-flex p-flex-column gestor-contenedor-checkbox-roles">
                    {roles.map((role) => (
                        <div className="p-field-checkbox" key={role.id_rol}>
                            <Checkbox 
                                inputId={`role-${role.id_rol}`} 
                                value={role.id_rol} 
                                checked={selectedRoles.includes(role.id_rol)} 
                                onChange={handleRoleChange} 
                            />
                            <label htmlFor={`role-${role.id_rol}`}>{role.descripcion}</label> {/* Nombre del rol */}
                        </div>
                    ))}
                </div>
            </Dialog>
        </div>
    );
};

export default GestorAsociados ;
