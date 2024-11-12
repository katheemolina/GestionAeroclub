import React, { useEffect, useState } from 'react';
import './Styles/GestorNuevoRecibo.css';
import { Dropdown } from 'primereact/dropdown';
import { obtenerAeronaves } from '../../services/aeronavesApi';
import { obtenerTarifas } from '../../services/tarifasApi';
import { listarAsociados } from '../../services/usuariosApi';
import { useNavigate } from 'react-router-dom';
import { generarReciboApi, listarInstructores, obtenerTiposVuelos } from '../../services/generarReciboApi';


function FormularioGestorRecibos({ idUsuario = 0 }) {
    const [cantidad, setCantidad] = useState(''); // Cantidad de combustible
    const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10)); // Fecha por defecto al día de hoy
    const [monto, setMonto] = useState(''); // Monto total
    const [observaciones, setObservaciones] = useState(''); // Observaciones
    const [itinerarios, setItinerarios] = useState(1);
    const [currentItinerario, setCurrentItinerario] = useState(0); // Estado para el tab seleccionado
    const [itinerarioData, setItinerarioData] = useState([{ origen: '', destino: '', horaSalida: '', horaLlegada: '',instruccion: false }]);
    const [instruccionSeleccionada, setInstruccionSeleccionada] = useState(false);
    const [instructorSeleccionado, setInstructorSeleccionado] = useState('');
    
    // Traigo datos de tipos de recibos
    const [tipoRecibo, setTipoRecibo] = useState([{ 'value': "Vuelo" }, { 'value': "Combustible" }]);
    const [tipoReciboSeleccionado, setTipoReciboSeleccionado] = useState(null);

    // Traigo datos de aeronaves
    const [aeronaves, setAeronaves] = useState([]);
    const [aeronavesSeleccionado, setAeronavesSeleccionado] = useState(null);
    const fetchAeronaves = async () => {
        try {
            const data = await obtenerAeronaves();
            setAeronaves(data);
        } catch (error) {
            console.error('Error fetching tarifas:', error);
        }
    };
    useEffect(() => {
        fetchAeronaves();
    }, []);

    // Traigo datos de tarifas
    const [tarifas, setTarifas] = useState([]);
    const [tarifasSeleccionado, setTarifasSeleccionado] = useState(null);
    const [tarifasFiltradas, setTarifasFiltradas] = useState([]);
    const fetchTarifas = async () => {
        try {
            const data = await obtenerTarifas();
            setTarifas(data.data);
        } catch (error) {
            console.error('Error fetching tarifas:', error);
        }
    };
    useEffect(() => {
        fetchTarifas();
    }, []);

    // useEffect para filtrar las tarifas cuando la aeronave seleccionada cambia
    useEffect(() => {
        if (aeronavesSeleccionado) {
        // Filtra las tarifas que corresponden a la aeronave seleccionada
        const tarifasFiltradasPorAeronave = tarifas.filter(
            (tarifa) => tarifa.id_aeronave === aeronavesSeleccionado.id_aeronave
        );
        setTarifasFiltradas(tarifasFiltradasPorAeronave);
        }
    }, [aeronavesSeleccionado, tarifas]);  // Vuelve a ejecutar cuando cambian la aeronave o las tarifas

    // Manejar el cambio de aeronave seleccionada
    const handleAeronaveChange = (e) => {
    const selectedAeronave = aeronaves.find(
        (aeronave) => aeronave.id_aeronave === e.target.value
    );
        setAeronavesSeleccionado(selectedAeronave);
        setTarifasSeleccionado(null);  // Reseteamos la tarifa seleccionada al cambiar de aeronave
    };

    // Manejar el cambio de tarifa seleccionada
    const handleTarifaChange = (e) => {
        setTarifasSeleccionado(e.target.value);
    };

    // Traigo datos de tipos de vuelo
    const [tiposVuelo, setTiposVuelo] = useState([]);
    const [tiposVueloSeleccionado, setTiposVueloSeleccionado] = useState(null);
    const fetchTiposVuelo = async () => {
        try {
            const data = await obtenerTiposVuelos();
            setTiposVuelo(data.data);
        } catch (error) {
            console.error('Error fetching tarifas:', error);
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
            console.error('Error fetching tarifas:', error);
        }
    };
    useEffect(() => {
        fetchAsociados();
    }, []);

    // Traigo datos de instructores
    const [instructores, setInstructores] = useState([]);
    const [instructoresSeleccionado, setInstructoresSeleccionado] = useState(null);
    const fetchInstructores = async () => {
        try {
            const data = await listarInstructores();
            setInstructores(data.data);
        } catch (error) {
            console.error('Error fetching tarifas:', error);
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
                 className="w-full md:w-14rem" /> ) : (
                    <p>Cargando opciones...</p>
                )}
            </div>
            <div className="form-group">
                <label className="label-recibo">Tarifa:</label>
                {tarifas && tarifas.length > 0 ? (
                <Dropdown value={tarifasSeleccionado}
                 onChange={(e) => setTarifasSeleccionado(e.value)} 
                 options={tarifas} 
                 optionLabel="importe"
                 placeholder="Seleciona la tarifa"
                 filter
                 className="w-full md:w-14rem" /> ) : (
                    <p>Cargando opciones...</p>
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
                 className="w-full md:w-14rem" /> ) : (
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
                 className="w-full md:w-14rem" /> ) : (
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
                    className="w-full md:w-14rem" /> ) : (
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
                <span>0.0</span>
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
                    type="text"
                    value={itinerarioData[index]?.aterrizajes || ''}
                    onChange={(e) => handleItinerarioChange(index, 'aterrizajes', e.target.value)}
                />
            </div>
            <hr />
        </div>
    );
    
    const calcularMonto = () => {
        if (cantidad > 0 && tarifasSeleccionado) {
            const nuevoMonto = cantidad * tarifasSeleccionado.importe;
            setMonto(nuevoMonto);  // Actualizamos el monto calculado
        } else {
            setMonto(0);  // Si no hay cantidad o tarifa, el monto es 0
        }
    };

    // Llamamos a la función de cálculo cada vez que cambia la cantidad o la tarifa
    useEffect(() => {
        calcularMonto();
    }, [cantidad, tarifasSeleccionado]);

    const renderFormularioCombustible = () => (
        <>    
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
                {tarifas && tarifas.length > 0 ? (
                <Dropdown value={tarifasSeleccionado}
                 onChange={(e) => setTarifasSeleccionado(e.value)} 
                 options={tarifas} 
                 optionLabel="importe"
                 placeholder="Seleciona la tarifa"
                 filter
                 className="w-full md:w-14rem" /> ) : (
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
                 className="w-full md:w-14rem" /> ) : (
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

    const navigate = useNavigate();
    const handleCancelar = () => {
        navigate('/gestor/recibos');
    };

    const handleGenerar = async () => {    
        // Construir el objeto con los datos del formulario
        let reciboData = {};
        if (!['Combustible', 'Vuelo'].includes(tipoReciboSeleccionado)) {
            alert('El tipo de recibo es inválido');
            return false;
        }
        if (tipoReciboSeleccionado === 'Combustible')
        {
            reciboData = {
                IdUsuario: asociadosSeleccionado?.id_usuario ?? 0,
                TipoRecibo: 'Combustible',
                Cantidad: Number(cantidad), 
                Importe: monto,
                Fecha: fecha,
                Instruccion: 0, // Valor predeterminado
                IdInstructor: 0, // Valor predeterminado
                Itinerarios: 0,                     // Valor predeterminado
                Datos: JSON.stringify(''),
                Observaciones: observaciones ?? '',
                Aeronave: 0,  // Valor predeterminado
                Tarifa: 0,
                TipoItinerario: 0
            };
            if (reciboData.IdUsuario === 0) {
                alert('El usuario es obligatorio');
                return false;
            }
            if (reciboData.Cantidad <= 0 || reciboData.Importe <= 0) {
                alert('La cantidad y el importe deben ser mayores que 0');
                return false;
            }
            if (!reciboData.Fecha || isNaN(new Date(reciboData.Fecha))) {
                alert('La fecha es inválida');
                return false;
            }
        } else if (tipoReciboSeleccionado === 'Vuelo'){
            reciboData = {
                IdUsuario: asociadosSeleccionado?.id_usuario ?? 0,  // Valor predeterminado si es null o undefined
                TipoRecibo: tipoReciboSeleccionado ?? 'Tipo_Recibo_Predeterminado',            // Valor predeterminado
                Cantidad: 0,                                    // Valor predeterminado
                Importe: monto ?? 0,                                        // Valor predeterminado
                Fecha: fecha,
                Instruccion: instruccionSeleccionada ?? 0, // Valor predeterminado
                IdInstructor: instructorSeleccionado?.id_usuario ?? 0, // Valor predeterminado
                Itinerarios: itinerarioData.length ?? 0,                     // Valor predeterminado
                Datos: JSON.stringify(itinerarioData),
                Observaciones: observaciones,
                Aeronave: aeronavesSeleccionado?.id_aeronave ?? 0,  // Valor predeterminado
                Tarifa: tarifasSeleccionado?.id_tarifa ?? 0,
                TipoItinerario: tiposVueloSeleccionado?.id_tipo_itinerario ?? 0
            };
            // Validaciones
            if (reciboData.IdUsuario === 0) {
                alert('El usuario es obligatorio');
                return false;
            }
            if (!reciboData.Fecha || isNaN(new Date(reciboData.Fecha))) {
                alert('La fecha es inválida');
                return false;
            }
            if (![0, 1,true,false].includes(reciboData.Instruccion)) {
                alert('El valor de instrucción debe ser 0 o 1');
                return false;
            }
            if (reciboData.IdInstructor === 0) {
                alert('El instructor es obligatorio');
                return false;
            }
            if (reciboData.Itinerarios <= 0) {
                alert('Debe haber al menos un itinerario');
                return false;
            }
            if (!reciboData.Datos || reciboData.Datos === '[]') {
                alert('Los datos de itinerarios son obligatorios');
                return false;
            }
            if (reciboData.Aeronave === 0) {
                alert('La aeronave es obligatoria');
                return false;
            }
            if (reciboData.Tarifa === 0) {
                alert('La tarifa es obligatoria');
                return false;
            }
            if (reciboData.TipoItinerario === 0) {
                alert('El tipo de itinerario es obligatorio');
                return false;
            }
        }

        try {
            const result = await generarReciboApi(reciboData);
            console.log('Recibo generado con éxito:', result);
            // Aquí puedes mostrar un mensaje de éxito al usuario
            alert(result.message);
            navigate('/gestor/recibos'); // Redirigir a la lista de recibos
        } catch (error) {
            console.error('Error al generar el recibo:', error);
            // Aquí puedes manejar el error en el UI, como mostrando un mensaje de error
        }
    };
    
    return (
        <div className="formulario-recibos">
            <h1>Nuevo Recibo</h1>
            <div className="form-group">
                <label className="label-recibo">Tipo de recibo:</label>
                {tipoRecibo && tipoRecibo.length > 0 ? (
                <Dropdown value={tipoReciboSeleccionado}
                 onChange={(e) => setTipoReciboSeleccionado(e.value)} 
                 options={tipoRecibo} 
                 optionLabel="value"
                 placeholder="Seleciona el tipo de vuelo"
                 className="w-full md:w-14rem" /> ) : (
                    <p>Cargando opciones...</p>
                )}
            </div>
            <hr></hr>
            {tipoReciboSeleccionado === "Vuelo" && renderFormularioVuelo()}
            {tipoReciboSeleccionado === "Combustible" && renderFormularioCombustible()}
            <div className="buttons">
                <button className="generate-btn" onClick={handleGenerar}>Generar</button>
                <button className="cancel-btn" onClick={handleCancelar}>Cancelar</button>
            </div>
        </div>
    );
}

export default FormularioGestorRecibos;