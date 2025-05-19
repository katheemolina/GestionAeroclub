import React, { useState, useEffect } from 'react';
import '../../styles/datatable-style.css';
import PantallaCarga from '../../components/PantallaCarga';
import { useUser } from '../../context/UserContext';
import { generarCuotasSociales, obtenerCSGeneradas } from '../../services/generarCuotasSociales'; // Asegúrate de importar la función
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Styles/GestorGenerarCuotasSociales.css'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


const GestorGenerarCuotasSociales = () => {
    const [loading, setLoading] = useState(false);
    const [mes, setMes] = useState('');
    const [importe, setImporte] = useState('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [anio, setAnio] = useState('');
    const [resultado, setResultado] = useState(null);
    const [errorState, setError] = useState('');  // Nuevo estado para manejar el error
    const [cuotasSociales, setCuotasSociales] = useState([]);

    const { usuarioId } = useUser();

    useEffect(() => {
        const fechaActual = new Date();
        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        const mesActual = meses[fechaActual.getMonth()]; // getMonth devuelve de 0 a 11
        const anioActual = fechaActual.getFullYear().toString();

        setMes(mesActual);
        setAnio(anioActual);
    }, []);
    
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
        if (!mes || !anio || !importe) {
            toast.warning('Por favor, complete todos los campos.');
            return;
        }

        setLoading(true);
        setError('');

        const reciboData = {
            mes,
            anio,
            importe,
            id_usuario_evento: usuarioId,
        };

        try {
            const response = await generarCuotasSociales(reciboData);
            setResultado('Cuotas sociales generadas con éxito.');
        } catch (error) {
            setResultado('');
            setError(`Los datos no se han guardado. ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Fetch tarifas data from the API
    const fetchCuotasSociales = async () => {
        try {
            const data = await obtenerCSGeneradas();
            //console.log(data)
            setCuotasSociales(data.data);
        } catch (error) {
            console.error('Error fetching tarifas:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCuotasSociales();
    }, []);


    if (loading) {
        return <PantallaCarga />;
    }
    return (
        <div className="background">
            <ToastContainer/>
            <header className="header">
                <h1>Gestión de Cuotas Sociales</h1>
            </header>
            <p>{cuotasSociales?.[0]?.Validacion ?? " "}</p>
            <div className='contenedor-para-centrar'>
                <div className="form-container contenedor-generar-cuotas">
                    <label>
                        <strong>Año:</strong>
                        <input
                            type="number"
                            min="2000"
                            max="2100"
                            value={anio}
                            onChange={(e) => setAnio(e.target.value)}
                            placeholder="Ejemplo: 2025"
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
                    <button
                        id="btn-generar-cuotas"
                        className="btn-primary"
                        onClick={() => setShowConfirmDialog(true)}
                    >
                        Generar Cuotas
                    </button>
                </div>
                <div className="form-container contenedor-log-cuotas">
                    <DataTable 
                        filterDisplay='row'
                        value={cuotasSociales} 
                        paginator rows={10} 
                        rowsPerPageOptions={[5, 10, 25]} 
                        style={{ width: '100%' }} >
                        <Column field="periodo" header="Periodo mm/aaaa" ></Column>
                        <Column field="CantidadCSGeneradas" header="Cantidad de Cuotas Sociales Generadas" ></Column>
                    </DataTable>
                </div>
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
