import React, { useState } from 'react';
import '../../styles/datatable-style.css';
import PantallaCarga from '../../components/PantallaCarga';
import { useUser } from '../../context/UserContext';
import { generarCuotasSociales } from '../../services/generarCuotasSociales'; // Asegúrate de importar la función

const GestorGenerarCuotasSociales = () => {
    const [loading, setLoading] = useState(false);
    const [mes, setMes] = useState('');
    const [importe, setImporte] = useState('');
    const [fechaMovimiento, setFechaMovimiento] = useState(''); // Nueva variable para la fecha del movimiento
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
            alert('Por favor, complete todos los campos.');
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
        console.log(reciboData);
        try {
            // Llamamos al backend para generar las cuotas sociales
            const response = await generarCuotasSociales(reciboData);
            setResultado('Cuotas sociales generadas con éxito.');
        } catch (error) {
            console.error('Error al generar las cuotas sociales:', error);
            setResultado('');  // Limpiar cualquier mensaje de éxito previo
            setError(error.message || 'Error desconocido');  // Mostrar el error recibido del backend
        } finally {
            setLoading(false); // Desactivar la carga
        }
    };

    if (loading) {
        return <PantallaCarga />;
    }

    return (
        <div className="background">
            <header className="header">
                <h1>Gestión de Cuotas Sociales</h1>
            </header>
            <div className="form-container">
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
                <button className="btn-primary" onClick={handleSubmit}>
                    Generar Cuotas
                </button>
            </div>
            {resultado && <div className="resultado"><p>{resultado}</p></div>}
            {error && <div className="error"><p>{error}</p></div>} {/* Mostrar el mensaje de error */}
        </div>
    );
};

export default GestorGenerarCuotasSociales;
