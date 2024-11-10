import React, { useEffect, useState } from 'react';
import './Styles/GestorNuevoRecibo.css';
import { FaSearch } from 'react-icons/fa';
import { Dropdown } from 'primereact/dropdown';
import { obtenerAeronaves } from '../../services/aeronavesApi';
import { obtenerTarifas } from '../../services/tarifasApi';
import { listarAsociados } from '../../services/usuariosApi';
import { useNavigate } from 'react-router-dom';


function FormularioGestorRecibos({ idUsuario = 0 }) {
    const [itinerarios, setItinerarios] = useState(1);
    const [currentItinerario, setCurrentItinerario] = useState(0); // Estado para el tab seleccionado
    const [itinerarioData, setItinerarioData] = useState([{ origen: '', destino: '', horaSalida: '', horaLlegada: '',instruccion: false }]);
    const [instruccionSeleccionada, setInstruccionSeleccionada] = useState(false);
    const [instructorSeleccionado, setInstructorSeleccionado] = useState('');
    
    // Traigo datos de tipos de recibos
    const [tipoRecibo, setTipoRecibo] = useState([{ 'value': "Vuelo" }, { 'value': "Combustible" }]);
    const [tipoReciboSeleccionado, setTipoReciboSeleccionado] = useState(null);
    // const fetchTiposRecibos = async () => {
    //     try {
    //         const data = [{ 'value': 1 }, { 'value': 2 }];//await obtenerTiposRecibos();
    //         setTipoRecibo(data.data);
    //     } catch (error) {
    //         console.error('Error fetching tarifas:', error);
    //     }
    // };
    // useEffect(() => {
    //     fetchTiposRecibos();
    // }, []);

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

    // Traigo datos de tipos de vuelo
    const [tiposVuelo, setTiposVuelo] = useState([]);
    const [tiposVueloSeleccionado, setTiposVueloSeleccionado] = useState(null);
    const fetchTiposVuelo = async () => {
        try {
            const data = [];//await obtenerTiposVuelo();
            setTiposVuelo(data);
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
            const data = [];//await listarInstructores();
            setInstructores(data);
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
                <input className="input-recibo" type="date" />
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
                <textarea className="textarea-recibo" placeholder="Please enter"></textarea>
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
                    type="text"
                    placeholder="HH"
                    maxLength={2}
                    value={itinerarioData[index]?.horaSalida || ''}
                    onChange={(e) => handleItinerarioChange(index, 'horaSalida', e.target.value)}
                />
                :
                <input
                    className="input-recibo"
                    type="text"
                    placeholder="MM"
                    maxLength={2}
                />
            </div>
            <div className="form-group">
                <label className="label-recibo">Hora llegada:</label>
                <input
                    className="input-recibo"
                    type="text"
                    placeholder="HH"
                    maxLength={2}
                    value={itinerarioData[index]?.horaLlegada || ''}
                    onChange={(e) => handleItinerarioChange(index, 'horaLlegada', e.target.value)}
                />
                :
                <input
                    className="input-recibo"
                    type="text"
                    placeholder="MM"
                    maxLength={2}
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
    

    const renderFormularioCombustible = () => (
        <>    
            <div className="form-group">
                <label className="label-recibo">Cantidad:</label>
                <input className="input-recibo" type="number" min="0" placeholder="Cantidad en litros" />
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
                <input className="input-recibo" type="date" />
            </div>
    
            <div className="form-group">
                <label className="label-recibo">Monto:</label>
                <input className="input-recibo" type="number" min="0" placeholder="Monto total ya calculado" />
            </div>
    
            <div className="form-group">
                <label className="label-recibo">Observaciones:</label>
                <textarea className="input-recibo" rows="3" placeholder="Añadir observaciones"></textarea>
            </div>
            <hr/>
        </>
    );

    const navigate = useNavigate();
    const handleCancelar = () => {
        navigate('/gestor/recibos');
    };

    const handleGenerar= () => {
        // Hacer la llamda a la api con la informacion
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
            {/* Agrega aquí los formularios para otros tipos de recibos si es necesario */}
            
            <div className="buttons">
                <button className="generate-btn" onClick={handleGenerar}>Generar</button>
                <button className="cancel-btn" onClick={handleCancelar}>Cancelar</button>
            </div>
        </div>
    );
}

export default FormularioGestorRecibos;
