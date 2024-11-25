import React, { useEffect, useState } from 'react';
import './Styles/GestorNuevoRecibo.css';
import { Dropdown } from 'primereact/dropdown';
import { obtenerAeronaves } from '../../services/aeronavesApi';
import { obtenerTarifas, obtenerTarifasCombustible } from '../../services/tarifasApi';
import { listarAsociados } from '../../services/usuariosApi';
import { useNavigate } from 'react-router-dom';
import { generarReciboApi, listarInstructores, obtenerTiposVuelos } from '../../services/generarReciboApi';

import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PantallaCarga from '../../components/PantallaCarga';
import { useUser } from '../../context/UserContext';

function FormularioGestorRecibos() {
    const [cantidad, setCantidad] = useState(''); // Cantidad de combustible
    const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10)); // Fecha por defecto al día de hoy
    const [monto, setMonto] = useState(''); // Monto total
    const [observaciones, setObservaciones] = useState(''); // Observaciones
    const [itinerarios, setItinerarios] = useState(1);
    const [currentItinerario, setCurrentItinerario] = useState(0); // Estado para el tab seleccionado
    const [itinerarioData, setItinerarioData] = useState([{ origen: '', destino: '', horaSalida: '', horaLlegada: '',instruccion: false }]);
    const [instruccionSeleccionada, setInstruccionSeleccionada] = useState(false);
    const [instructorSeleccionado, setInstructorSeleccionado] = useState('');
    const [checkboxDisabled, setCheckboxDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    
    // Traigo datos de tipos de recibos
    const [tipoRecibo] = useState([{ 'value': "Vuelo" }, { 'value': "Combustible" }]);
    const [tipoReciboSeleccionado, setTipoReciboSeleccionado] = useState(null);

    // Traigo datos de aeronaves
    const [aeronaves, setAeronaves] = useState([]);
    const [aeronavesSeleccionado, setAeronavesSeleccionado] = useState(null);
    const fetchAeronaves = async () => {
        try {
            const data = await obtenerAeronaves();
            setAeronaves(data);
        } catch (error) {
            //console.error('Error fetching aeronaves:', error);
        }
    };
    useEffect(() => {
        fetchAeronaves();
    }, []);

    // Traigo datos de tarifas
    const [tarifas, setTarifas] = useState([]);
    const [tarifasSeleccionado, setTarifasSeleccionado] = useState(null);
    const [tarifasFiltradasAeronave, setTarifasFiltradasAeronave] = useState([]);
    const fetchTarifas = async () => {
        try {
            const data = await obtenerTarifas();
            setTarifas(data.data);
        } catch (error) {
            //console.error('Error fetching tarifas:', error);
        }
    };
    useEffect(() => {
        fetchTarifas();
    }, []);
    // useEffect para filtrar las tarifas cuando la aeronave seleccionada cambia
    
    useEffect(() => {
        if (aeronavesSeleccionado) {
            const tarifasFiltradasPorAeronave = tarifas.filter((tarifa) => {
                // Si no hay aeronaves asociadas a esta tarifa, saltamos
                if (!tarifa.Aeronaves) return false;
    
                // Convierte el campo Aeronaves (que puede ser null, un único valor o varios) en un array de números
                const idsAeronaves = tarifa.Aeronaves
                    .split(',')
                    .map(id => parseInt(id.trim(), 10)) // Convertimos a números
                    .filter(id => !isNaN(id)); // Filtramos valores NaN
    
                // Verifica si el ID de la aeronave seleccionada está en el array de IDs
                return idsAeronaves.includes(aeronavesSeleccionado.id_aeronave);
            });
            setTarifasFiltradasAeronave(tarifasFiltradasPorAeronave);
        } else {
            setTarifasFiltradasAeronave([]); // Si no hay aeronave seleccionada, limpiamos el estado
        }
    }, [aeronavesSeleccionado, tarifas]);
    
    useEffect(() => {
        // Si la tarifa no incluye instrucción, el checkbox se deshabilita
        if (tarifasSeleccionado){
            if ((tarifasSeleccionado.importe_por_instruccion ?? 0) <= 0) {
                setCheckboxDisabled(true);
                setInstruccionSeleccionada(false); // Reseteamos si está deshabilitado
            } else {
                setCheckboxDisabled(false);
            }
        }
    }, [tarifasSeleccionado]);
    

    const [tarifasCombustible, setTarifasCombustible] = useState([]);
    const [tarifasCombustibleSeleccionado, setTarifasCombustibleSeleccionado] = useState(null);
    const fetchTarifasCombustible = async () => {
        try {
            const data = await obtenerTarifasCombustible();
            setTarifasCombustible(data.data);
        } catch (error) {
            //console.error('Error fetching tarifas:', error);
        }
    };
    useEffect(() => {
        fetchTarifasCombustible();
    }, []);

    // Traigo datos de tipos de vuelo
    const [tiposVuelo, setTiposVuelo] = useState([]);
    const [tiposVueloSeleccionado, setTiposVueloSeleccionado] = useState(null);
    const fetchTiposVuelo = async () => {
        try {
            const data = await obtenerTiposVuelos();
            setTiposVuelo(data.data);
        } catch (error) {
            //console.error('Error fetching tarifas:', error);
        }
    };
    useEffect(() => {
        fetchTiposVuelo();
    }, []);

    // Traigo datos de asociados
    const [asociados, setAsociados] = useState([]);
    const [asociadosSeleccionado, setAsociadosSeleccionado] = useState(null);
    const fetchAsociados = async () => {
        try {
            const data = await listarAsociados();
            setAsociados(data);
        } catch (error) {
            //console.error('Error fetching tarifas:', error);
        }
    };
    useEffect(() => {
        fetchAsociados();
    }, []);

    // Traigo datos de instructores
    const [instructores, setInstructores] = useState([]);
    const fetchInstructores = async () => {
        try {
            const data = await listarInstructores();
            setInstructores(data.data);
        } catch (error) {
            //console.error('Error fetching tarifas:', error);
        }
    };
    useEffect(() => {
        fetchInstructores();
    }, []);

    const handleItinerariosChange = (e) => { // Declara la función que maneja cambios en el número de itinerarios.
        const value = parseInt(e.target.value, 10); // Convierte el valor del campo de entrada a un número entero.
        setItinerarios(value); // Actualiza el estado `itinerarios` al nuevo valor.
    
        // Ajusta el número de itinerarios en `itinerarioData`.
        setItinerarioData((prev) => 
            Array.from({ length: value }, (_, i) => // Crea un nuevo array con longitud `value`.
                prev[i] || { // Si existe un itinerario anterior en `prev` en la posición `i`.
                    origen: '', // Si no, crea un nuevo objeto con valores vacíos.
                    destino: '',
                    horaSalida: '',
                    horaLlegada: '',
                    aterrizajes:''
                }
            )
        );
    };

    const handleItinerarioChange = (index, field, value) => { // Declara la función que maneja cambios en un itinerario específico.
        setItinerarioData((prev) => // Actualiza el estado `itinerarioData`.
            prev.map((itinerario, i) => // Mapea sobre los itinerarios existentes en `prev`.
                i === index ? { // Si el índice actual coincide con el índice del itinerario que se está cambiando.
                    ...itinerario, // Crea un nuevo objeto itinerario con los datos existentes.
                    [field]: value // Actualiza solo el campo específico con el nuevo valor.
                } : itinerario // Si no coincide, devuelve el itinerario sin cambios.
            )
        );
    };

    const handleCheckboxChange = () => {
        setInstruccionSeleccionada(!instruccionSeleccionada); // Cambia el estado del checkbox instrucción
    };

    const renderFormularioVuelo = () => (
        <>
            {/* NO OLVIDARSE DE TRABAJAR CON EL NÚMERO DE RECIBO*/}
            
            {/* Campos generales del vuelo */}
            <div className="form-group">
                <label className="label-recibo">Aeronave:</label>
                {aeronaves && aeronaves.length > 0 ? (
                <Dropdown value={aeronavesSeleccionado}
                 onChange={(e) => setAeronavesSeleccionado(e.value)} 
                 options={aeronaves} 
                 optionLabel="matricula"
                 placeholder="Seleciona la aeronave"
                 filter
                 className="w-full md:w-14rem dropdown-generar-recibo" /> ) : (
                    <p>Cargando opciones...</p>
                )}
            </div>
            <div className="form-group">
                <label className="label-recibo">Tarifa:</label>
                {tarifasFiltradasAeronave && tarifasFiltradasAeronave.length > 0 ? (
                <Dropdown value={tarifasSeleccionado}
                 onChange={(e) => setTarifasSeleccionado(e.value)} 
                 options={tarifasFiltradasAeronave} 
                 optionLabel="importe"
                 placeholder="Seleciona la tarifa"
                 filter
                 className="w-full md:w-14rem dropdown-generar-recibo" /> ) : (
                    <p>No se encuentran tarifas para la aeronave seleccionada.</p>
                )}
            </div>
            <div className="form-group">
                <label className="label-recibo">Fecha de vuelo:</label>
                <input className="input-recibo" type="date" 
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)} />
            </div>
            <div className="form-group">
                <label className="label-recibo">Tipo de vuelo:</label>
                {tiposVuelo && tiposVuelo.length > 0 ? (
                <Dropdown value={tiposVueloSeleccionado}
                 onChange={(e) => setTiposVueloSeleccionado(e.value)} 
                 options={tiposVuelo} 
                 optionLabel="descripcion"
                 placeholder="Seleciona el tipo de vuelo"
                 filter
                 className="w-full md:w-14rem dropdown-generar-recibo" /> ) : (
                    <p>Cargando opciones...</p>
                )}
            </div>
            <div className="form-group">
                <label className="label-recibo">Asociado:</label>
                {asociados && asociados.length > 0 ? (
                <Dropdown value={asociadosSeleccionado}
                 onChange={(e) => setAsociadosSeleccionado(e.value)} 
                 options={asociados} 
                 optionLabel="usuario"
                 placeholder="Seleciona el asociado"
                 filter 
                 className="dropdown-generar-recibo" /> ) : (
                    <p>Cargando opciones...</p>
                )}
            </div>

             {/* Checkbox de instrucción y selección de instructor */}
            <div className="form-group">
                <label className="label-recibo">Instrucción:</label>
                <input
                    className="checkbox-recibo"
                    type="checkbox"
                    checked={instruccionSeleccionada}
                    onChange={handleCheckboxChange}
                    disabled={checkboxDisabled}
                />
            </div>

            {instruccionSeleccionada && (
                <div className="form-group">
                    <label className="label-recibo">Instructor:</label>
                    {instructores && instructores.length > 0 ? (
                    <Dropdown value={instructorSeleccionado}
                    onChange={(e) => setInstructorSeleccionado(e.value)} 
                    options={instructores} 
                    optionLabel="usuario"
                    placeholder="Seleciona el instructor"
                    filter 
                    className="w-full md:w-14rem dropdown-generar-recibo" /> ) : (
                        <p>Cargando opciones...</p>
                    )}
                </div>
            )}

            {/* Opciones de itinerarios */}
            <div className="form-group">
                <label className="label-recibo">Itinerarios:</label>
                <select className="input-recibo" value={itinerarios} onChange={handleItinerariosChange}>
                    {[...Array(10).keys()].map((i) => (
                        <option key={i + 1} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tabs y formulario de cada vuelo */}
            <div className="tabs">
                {[...Array(itinerarios).keys()].map((i) => (
                    <button 
                        key={i} 
                        className={`tab-button ${i === currentItinerario ? 'active' : ''}`} 
                        onClick={() => setCurrentItinerario(i)}
                    >
                        Vuelo {i + 1}
                    </button>
                ))}
            </div>
            <hr></hr>
            {/* Formulario específico para el vuelo seleccionado */}
            {renderFormularioItinerario(currentItinerario)}

            {/* Duración total */}
            <div className="form-group">
                <label className="label-recibo">Duración total:</label>
                <span>{calcularDuracionTotal()}</span>
            </div>

            {/* Observaciones */}
            <div className="form-group">
                <label className="label-recibo">Observaciones:</label>
                <textarea
                    className="input-recibo"
                    rows="3"
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    placeholder="Añadir observaciones"
                ></textarea>
            </div>
        </>
    );
    
    const renderFormularioItinerario = (index) => (
        <div className="itinerario-form" key={index}>
            <ToastContainer />
            <div className="form-group">
                <label className="label-recibo">Origen:</label>
                <input
                    className="input-recibo"
                    type="text"
                    value={itinerarioData[index]?.origen || ''}
                    onChange={(e) => handleItinerarioChange(index, 'origen', e.target.value)}
                />
            </div>
            <div className="form-group">
                <label className="label-recibo">Hora salida:</label>
                <input
                    className="input-recibo"
                    type="time"
                    placeholder="HH"
                    maxLength={2}
                    value={itinerarioData[index]?.horaSalida || ''}
                    onChange={(e) => handleItinerarioChange(index, 'horaSalida', e.target.value)}
                />
                
            </div>
            <div className="form-group">
                <label className="label-recibo">Hora llegada:</label>
                <input
                    className="input-recibo"
                    type="time"
                    placeholder="HH"
                    maxLength={2}
                    value={itinerarioData[index]?.horaLlegada || ''}
                    onChange={(e) => handleItinerarioChange(index, 'horaLlegada', e.target.value)}
                />
            </div>
            <div className="form-group">
                <label className="label-recibo">Destino:</label>
                <input
                    className="input-recibo"
                    type="text"
                    value={itinerarioData[index]?.destino || ''}
                    onChange={(e) => handleItinerarioChange(index, 'destino', e.target.value)}
                />
            </div>
            <div className="form-group">
                <label className="label-recibo">Aterrizajes:</label>
                <input
                    className="input-recibo"
                    type="number"
                    min={0}
                    value={itinerarioData[index]?.aterrizajes || ''}
                    onChange={(e) => handleItinerarioChange(index, 'aterrizajes', e.target.value)}
                />
            </div>
            <hr />
        </div>
    );
    
    const convertirMinutosAHorasDecimales = (minutos) => {
        if (minutos >= 1 && minutos <= 2) return 0.0;
        if (minutos >= 3 && minutos <= 8) return 0.1;
        if (minutos >= 9 && minutos <= 14) return 0.2;
        if (minutos >= 15 && minutos <= 20) return 0.3;
        if (minutos >= 21 && minutos <= 26) return 0.4;
        if (minutos >= 27 && minutos <= 33) return 0.5;
        if (minutos >= 34 && minutos <= 39) return 0.6;
        if (minutos >= 40 && minutos <= 45) return 0.7;
        if (minutos >= 46 && minutos <= 51) return 0.8;
        if (minutos >= 52 && minutos <= 57) return 0.9;
        if (minutos >= 58 && minutos <= 60) return 1.0;
        return 0.0;
    };
    
    const calcularDuracionTotal = () => {
        const totalHoras = itinerarioData.reduce((acumulador, itinerario) => {
            if (itinerario.horaSalida && itinerario.horaLlegada) {
                const [horasSalida, minutosSalida] = itinerario.horaSalida.split(':').map(Number);
                const [horasLlegada, minutosLlegada] = itinerario.horaLlegada.split(':').map(Number);
    
                const salidaEnMinutos = horasSalida * 60 + minutosSalida;
                const llegadaEnMinutos = horasLlegada * 60 + minutosLlegada;
    
                // Considera si la hora de llegada es al día siguiente
                const duracionEnMinutos = llegadaEnMinutos >= salidaEnMinutos
                    ? llegadaEnMinutos - salidaEnMinutos
                    : 1440 - salidaEnMinutos + llegadaEnMinutos;
    
                const horas = Math.floor(duracionEnMinutos / 60); // Horas completas
                const minutos = duracionEnMinutos % 60; // Minutos restantes
    
                return acumulador + horas + convertirMinutosAHorasDecimales(minutos);
            }
            return acumulador;
        }, 0);
    
        return totalHoras.toFixed(1); // Duración total con un decimal
    };

    
    const calcularMonto = () => {
        if (cantidad > 0 && tarifasCombustibleSeleccionado) {
            const nuevoMonto = cantidad * tarifasCombustibleSeleccionado.importe;
            setMonto(nuevoMonto);  // Actualizamos el monto calculado
        } else {
            setMonto(0);  // Si no hay cantidad o tarifa, el monto es 0
        }
    };

    // Llamamos a la función de cálculo cada vez que cambia la cantidad o la tarifa
    useEffect(() => {
        calcularMonto();
    }, [cantidad, tarifasCombustibleSeleccionado]);

    const renderFormularioCombustible = () => (
        <>  
            <ToastContainer />
            <div className="form-group">
                <label className="label-recibo">Cantidad:</label>
                <input
                    className="input-recibo"
                    type="number"
                    min="0"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    placeholder="Cantidad en litros"
                />
            </div>

            <div className="form-group">
                <label className="label-recibo">Tarifa:</label>
                {tarifasCombustible && tarifasCombustible.length > 0 ? (
                <Dropdown value={tarifasCombustibleSeleccionado}
                 onChange={(e) => setTarifasCombustibleSeleccionado(e.value)} 
                 options={tarifasCombustible} 
                 optionLabel="importe"
                 placeholder="Seleciona la tarifa"
                 filter
                 className="w-full md:w-14rem dropdown-generar-recibo" /> ) : (
                    <p>Cargando opciones...</p>
                )}
            </div>

            <div className="form-group">
                <label className="label-recibo">Asociado:</label>
                {asociados && asociados.length > 0 ? (
                <Dropdown value={asociadosSeleccionado}
                 onChange={(e) => setAsociadosSeleccionado(e.value)} 
                 options={asociados} 
                 optionLabel="usuario"
                 placeholder="Seleciona el asociado"
                 filter 
                 className="w-full md:w-14rem dropdown-generar-recibo" /> ) : (
                    <p>Cargando opciones...</p>
                )}
            </div>
    
            <div className="form-group">
                <label className="label-recibo">Fecha:</label>
                <input
                    className="input-recibo"
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                />
            </div>
    
            <div className="form-group">
                <label className="label-recibo">Monto:</label>
                <input
                    className="input-recibo"
                    type="text"
                    value={`$${monto.toFixed(2)}`}
                    readOnly
                    disabled
                />
            </div>
    
            <div className="form-group">
                <label className="label-recibo">Observaciones:</label>
                <textarea
                    className="input-recibo"
                    rows="3"
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    placeholder="Añadir observaciones"
                ></textarea>
            </div>
            <hr/>
        </>
    );
    
    const now = new Date();
    const horaActual = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:00`;
    const fechaConHora = `${fecha} ${horaActual}`;
    const fechaHoraRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

    const navigate = useNavigate();
    const handleCancelar = () => {
        navigate('/gestor/recibos');
    };
    const idUsuarioEvento = useUser();
    const handleGenerar = async () => {
        // Si ya está en proceso, no ejecutar de nuevo
        if (loading) return;
    
        // Construir el objeto con los datos del formulario
        let reciboData = {};
        if (!['Combustible', 'Vuelo'].includes(tipoReciboSeleccionado)) {
            toast.warning('El tipo de recibo es inválido');
            return false;
        }
        if (tipoReciboSeleccionado === 'Combustible') {
            reciboData = {
                IdUsuario: asociadosSeleccionado?.id_usuario ?? 0,
                TipoRecibo: 'Combustible',
                Cantidad: Number(cantidad),
                Importe: monto,
                Fecha: fechaConHora,
                Instruccion: 0, // Valor predeterminado
                IdInstructor: 0, // Valor predeterminado
                Itinerarios: 0, // Valor predeterminado
                Datos: JSON.stringify(''),
                Observaciones: observaciones ?? '',
                Aeronave: 0, // Valor predeterminado
                Tarifa: 0,
                TipoItinerario: 0,
                IdUsuarioEvento: idUsuarioEvento.usuarioId
            };
            if (reciboData.IdUsuario === 0) {
                toast.warning('El usuario es obligatorio');
                return false;
            }
            if (reciboData.Cantidad <= 0 || reciboData.Importe <= 0) {
                toast.warning('La cantidad y el importe deben ser mayores que 0');
                return false;
            }
            if (!reciboData.Fecha || !fechaHoraRegex.test(reciboData.Fecha))  {
                toast.warning('La fecha es inválida. Deah');
                console.log(reciboData.Fecha);
                return false;
            }
        } else if (tipoReciboSeleccionado === 'Vuelo') {
            console.log(fechaConHora)
            reciboData = {
                IdUsuario: asociadosSeleccionado?.id_usuario ?? 0, // Valor predeterminado si es null o undefined
                TipoRecibo: tipoReciboSeleccionado ?? 'Tipo_Recibo_Predeterminado', // Valor predeterminado
                Cantidad: calcularDuracionTotal() ?? 0, // Valor predeterminado
                Importe: monto ?? 0, // Valor predeterminado
                Fecha: fechaConHora,
                Instruccion: instruccionSeleccionada ? 1 : 0, // Valor predeterminado
                IdInstructor: instructorSeleccionado?.id_usuario ?? 0, // Valor predeterminado
                Itinerarios: itinerarioData.length ?? 0, // Valor predeterminado
                Datos: JSON.stringify(itinerarioData),
                Observaciones: observaciones,
                Aeronave: aeronavesSeleccionado?.id_aeronave ?? 0, // Valor predeterminado
                Tarifa: tarifasSeleccionado?.id_tarifa ?? 0,
                TipoItinerario: tiposVueloSeleccionado?.id_tipo_itinerario ?? 0,
                IdUsuarioEvento: idUsuarioEvento.usuarioId
            };
            if (reciboData.IdUsuario === 0) {
                toast.warning('El usuario es obligatorio');
                return false;
            }
            if (!reciboData.Fecha || isNaN(new Date(reciboData.Fecha))) {
                toast.warning('La fecha es inválida');
                return false;
            }
            if (![0, 1, true, false].includes(reciboData.Instruccion)) {
                toast.warning('El valor de instrucción debe ser 0 o 1');
                return false;
            }
            if (reciboData.IdInstructor === 0 && reciboData.Instruccion) {
                toast.warning('El instructor es obligatorio');
                return false;
            }
            if (reciboData.Itinerarios <= 0) {
                toast.warning('Debe haber al menos un itinerario');
                return false;
            }
            if (!reciboData.Datos || reciboData.Datos === '[]') {
                toast.warning('Los datos de itinerarios son obligatorios');
                return false;
            }
            if (reciboData.Aeronave === 0) {
                toast.warning('La aeronave es obligatoria');
                return false;
            }
            if (reciboData.Tarifa === 0) {
                toast.warning('La tarifa es obligatoria');
                return false;
            }
            if (reciboData.TipoItinerario === 0) {
                toast.warning('El tipo de itinerario es obligatorio');
                return false;
            }
        }
    
        try {
            setLoading(true); // Activar el estado de carga
            const result = await generarReciboApi(reciboData);
            toast.success('Recibo generado con éxito');
            setTimeout(() => navigate('/gestor/recibos'), 2000);
        } catch (error) {
            toast.error('Error al generar el recibo');
        } finally {
            setLoading(false); // Desactivar el estado de carga
        }
    };
    
    return (
        <div className="background">
            
            <div className="formulario-recibos">
                <h1>Nuevo Recibo</h1>
                <div className="form-group">
                    <label className="label-recibo">Tipo de recibo:</label>
                    {tipoRecibo && tipoRecibo.length > 0 ? (
                        <Dropdown
                            value={tipoReciboSeleccionado}
                            onChange={(e) => setTipoReciboSeleccionado(e.value)}
                            options={tipoRecibo}
                            optionLabel="value"
                            placeholder="Selecciona el tipo de vuelo"
                            className="w-full md:w-14rem dropdown-generar-recibo"
                        />
                    ) : (
                        <p>Cargando opciones...</p>
                    )}
                </div>
                <hr />
                {tipoReciboSeleccionado === 'Vuelo' && renderFormularioVuelo()}
                {tipoReciboSeleccionado === 'Combustible' && renderFormularioCombustible()}
                <div className="buttons">
                    <button
                        className="generate-btn"
                        onClick={handleGenerar}
                        disabled={loading} // Deshabilitar cuando loading es true
                    >
                        {loading ? 'Generando...' : 'Generar'}
                    </button>
                    <button className="cancel-btn" onClick={handleCancelar}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FormularioGestorRecibos;