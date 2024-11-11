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
import FlightIcon from '@mui/icons-material/Flight';
import './Styles/GestorAsociados.css';
import { useNavigate } from 'react-router-dom';

const GestorAsociados  = () => {
    const navigate = useNavigate();
    const [asociados, setAsociados] = useState([]);
    const [asociadosDialog, setAsociadosDialog] = useState(false);
    const [asocicadosData, setAsociadosData] = useState({
        estado: ''
    });
    const [isEdit, setIsEdit] = useState(false);

    // Fetch aeronaves data from the API
    const fetchAsociados = async () => {
        try {
            const data = await listarAsociados(); // Asumiendo que ya es el array de aeronaves
            setAsociados(data);
        } catch (error) {
            console.error('Error fetching aeronaves:', error);
        }
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
      
    return (
        <div className="background">
            <header className="header">
                <h1>Asociados</h1>
            </header>
            <DataTable 
                value={asociados} 
                paginator rows={10} 
                rowsPerPageOptions={[5, 10, 25]} 
                style={{ width: '100%' }} >
                <Column field="usuario" header="Asociado"></Column>
                <Column field="estado" header="Estado"></Column>
                <Column field="horas_vuelo" header="Horas de vuelo totales"></Column>
                <Column field="estadoCMA" header="Estado del CMA"></Column>
                <Column field="estado_cuenta_corriente" header="Estado Cuenta Corriente"></Column>
                <Column field="saldo" header="Saldo"></Column>
                <Column header="Acciones"
                        body={(rowData) => (
                            <div className='acciones'>
                            {/* Botón de editar */}
                            <IconButton color="primary" aria-label="edit" onClick={() => handleEdit(rowData)}>
                                <FlightIcon />
                            </IconButton>

                            {/* Botón de detalles */}
                            <IconButton color="primary" aria-label="view-details" onClick={() => handleGoToDetails(rowData.id_usuario)}>
                                <AccountCircleIcon />
                            </IconButton>
                            </div>
                        )}
                        />
            </DataTable>

            <Dialog header={isEdit ? 'Actualizar Estado Asociado' : 'Agregar Aeronave'} visible={asociadosDialog} onHide={() => setAsociadosDialog(false)}>
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
                        <Button label="Guardar" icon="pi pi-check" onClick={handleSave} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default GestorAsociados ;
