import React, { useState } from 'react';
import '../../styles/datatable-style.css';
import PantallaCarga from '../../components/PantallaCarga';
import { useUser } from '../../context/UserContext';
import { generarCuotasSociales } from '../../services/generarCuotasSociales'; // Asegúrate de importar la función
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Styles/GestorGenerarCuotasSociales.css'


const GestorGenerarCuotasSociales = () => {
    const [loading, setLoading] = useState(false);
    const [mes, setMes] = useState('');
    const [importe, setImporte] = useState('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [fechaMovimiento, setFechaMovimiento] = useState(new Date().toISOString().split('T')[0]); 
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState('');  // Nuevo estado para manejar el error
    const { usuarioId } = useUser();

    // Opciones de meses
    const mesesDelAnio = [
        { label: 'Enero', value: 'Enero' },
        { label: 'Febrero', value: 'Febrero' },
        { label: 'Marzo', value: 'Marzo' },
        { label: 'Abril', value: 'Abril' },
        { label: 'Mayo', value: 'Mayo' },
        { label: 'Junio', value: 'Junio' },
        { label: 'Julio', value: 'Julio' },
        { label: 'Agosto', value: 'Agosto' },
        { label: 'Septiembre', value: 'Septiembre' },
        { label: 'Octubre', value: 'Octubre' },
        { label: 'Noviembre', value: 'Noviembre' },
        { label: 'Diciembre', value: 'Diciembre' },
    ];

    const handleSubmit = async () => {
        if (!mes || !importe || !fechaMovimiento) {  // Verificamos que todos los campos estén completos
            toast.warning('Por favor, complete todos los campos.');
            return;
        }

        setLoading(true); // Activar la carga mientras se realiza la solicitud
        setError('');  // Limpiar el error antes de hacer la solicitud
        const reciboData = {
            mes,
            importe,
            id_usuario_evento: usuarioId, // Agregar el usuario actual
            fecha_movimiento: fechaMovimiento, // Usamos la fecha seleccionada
        };
        try {
            // Llamamos al backend para generar las cuotas sociales
            const response = await generarCuotasSociales(reciboData);
            setResultado('Cuotas sociales generadas con éxito.');
        } catch (error) {
            console.error('Error al generar las cuotas sociales:', error);
            setResultado('');  // Limpiar cualquier mensaje de éxito previo
            setError(error.message || 'Error desconocido');  // Mostrar el error recibido del backend
            toast.error(error.message); // toast para mostrar error de la base
        } finally {
            setLoading(false); // Desactivar la carga
        }
    };

    if (loading) {
        return <PantallaCarga />;
    }
    return (
        <div className="background">
            <ToastContainer/>
            <header className="header">
                <h1>Gestión de Cuotas Sociales</h1>
            </header>
            <div className='contenedor-para-centrar'>
            <div className="form-container contenedor-generar-cuotas">
                <label>
                    <strong>Fecha del Movimiento:</strong>
                    <input
                        type="date"
                        value={fechaMovimiento}
                        onChange={(e) => setFechaMovimiento(e.target.value)}
                    />
                </label>
                <label>
                    <strong>Mes:</strong>
                    <select value={mes} onChange={(e) => setMes(e.target.value)}>
                        <option value="" disabled>
                            Seleccione un mes
                        </option>
                        {mesesDelAnio.map((mesOption) => (
                            <option key={mesOption.value} value={mesOption.value}>
                                {mesOption.label}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    <strong>Importe:</strong>
                    <input
                        type="number"
                        value={importe}
                        onChange={(e) => setImporte(e.target.value)}
                        placeholder="Ejemplo: 1000"
                    />
                </label>
                <button id="btn-generar-cuotas" className="btn-primary" onClick={() => setShowConfirmDialog(true)}>
                    Generar Cuotas
                </button>
            </div>
            {resultado && <div className="resultado"><p>{resultado}</p></div>}
            </div>

            <Dialog header="Confirmar" className="modal-confirmar-habilitacion" visible={showConfirmDialog} style={{ width: '350px' }} modal footer={
                <>
                    <Button label="Cancelar" 
                      className="p-button-text gestor-btn-cancelar" 
                      icon="pi pi-times" 
                      onClick={() => setShowConfirmDialog(false)}/>
                    <Button label="Confirmar" 
                      className="gestor-btn-confirmar" 
                        icon="pi pi-check"
                        onClick={() => {
                          handleSubmit();
                          setShowConfirmDialog(false);
                        }} autoFocus />
                </>
            } onHide={() => setShowConfirmDialog(false)}>
                <p>¿Está seguro de que desea generar las cuotas sociales?</p>
            </Dialog>
        </div>
        
    );
};

export default GestorGenerarCuotasSociales;
