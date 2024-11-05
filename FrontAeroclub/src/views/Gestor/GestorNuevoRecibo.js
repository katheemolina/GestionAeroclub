import React, { useState } from 'react';
import './Styles/GestorNuevoRecibo.css';
import { FaSearch } from 'react-icons/fa';

function FormularioGestorRecibos({ idUsuario = 0 }) {
    const [tipoRecibo, setTipoRecibo] = useState("Vuelo");
    const [itinerarios, setItinerarios] = useState(1);
    const [currentItinerario, setCurrentItinerario] = useState(0); // Estado para el tab seleccionado
    const [itinerarioData, setItinerarioData] = useState([{ origen: '', destino: '', horaSalida: '', horaLlegada: '',instruccion: false }]);
    const [instructores] = useState([
        'Instructor 1',
        'Instructor 2',
        'Instructor 3'
        // Agrega los nombres de los instructores aquí
    ]);
    
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
                    horaLlegada: ''
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

    const handleCheckboxChange = (index) => { // Declara la función que maneja el cambio de estado del checkbox.
        setItinerarioData((prev) => // Actualiza el estado `itinerarioData`.
            prev.map((itinerario, i) => // Mapea sobre los itinerarios existentes en `prev`.
                i === index ? { // Si el índice actual coincide con el índice del itinerario que se está cambiando.
                    ...itinerario, // Crea un nuevo objeto itinerario con los datos existentes.
                    instruccion: !itinerario.instruccion // Invierte el estado del campo `instruccion`.
                } : itinerario // Si no coincide, devuelve el itinerario sin cambios.
            )
        );
    };

    const renderFormularioVuelo = () => (
        <>
            {/* Campos generales del vuelo */}
            <div className="form-group">
                <label className="label-recibo">N° Recibo:</label>
                <input className="input-recibo" type="text" placeholder="(número generado automáticamente)" />
            </div>
            <div className="form-group">
                <label className="label-recibo">Aeronave:</label>
                <select className="input-recibo">
                    <option value="-">-</option>
                    <option value="LV-YOH">LV-YOH</option>
                    <option value="LV-S141">LV-S141</option>
                </select>
            </div>
            <div className="form-group">
                <label className="label-recibo">Tarifa:</label>
                <select className="input-recibo">
                    <option value="-">-</option>
                </select>
            </div>
            <div className="form-group">
                <label className="label-recibo">Fecha de vuelo:</label>
                <input className="input-recibo" type="date" />
            </div>
            <div className="form-group">
                <label className="label-recibo">Tipo de vuelo:</label>
                <select className="input-recibo">
                    <option value="-">-</option>
                    <option value="Entrenamiento">Entrenamiento</option>
                    <option value="Privado">Privado</option>
                    <option value="Comercial">Comercial</option>
                </select>
            </div>
            <div className="form-group asociado-search">
                <label className="label-recibo">Asociado:</label>
                <input className="input-recibo" type="text" />
                <button className="search-btn"><FaSearch /></button>
            </div>

            {/* Opciones de itinerarios */}
            <div className="form-group">
                <label className="label-recibo">Itinerarios:</label>
                <select className="input-recibo" value={itinerarios} onChange={handleItinerariosChange}>
                    {[...Array(5).keys()].map((i) => (
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


            <div className="form-group">
                <label className="label-recibo">Aterrizajes:</label>
                <input className="input-recibo" type="text" />
            </div>

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
                <label className="label-recibo">Instrucción:</label>
                <input
                    className="checkbox-recibo"
                    type="checkbox"
                    checked={itinerarioData[index]?.instruccion || false}
                    onChange={() => handleCheckboxChange(index)}
                />
            </div>
            {/* Renderiza la lista de instructores si el checkbox de instrucción está marcado */}
            {itinerarioData[index]?.instruccion && (
                <div className="form-group">
                    <label className="label-recibo">Selecc. instructor:</label>
                    <select className="input-recibo">
                        {instructores.map((instructor, i) => (
                            <option key={i} value={instructor}>{instructor}</option>
                        ))}
                    </select>
                </div>
            )}
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
            <hr/>
        </div>
    );
    

    const renderFormularioCombustible = () => (
        <>
            <div className="form-group">
                <label className="label-recibo">N° Recibo:</label>
                <input className="input-recibo" type="text" placeholder="(número generado automáticamente)" />
            </div>

            <div className="form-group">
                <label className="label-recibo">Nombre de Combustible:</label>
                <select className="input-recibo">
                    <option value="">Selecciona un tipo</option>
                    <option value="nafta">Nafta</option>
                    <option value="gasoil">Gasoil</option>
                    <option value="kerosene">Kerosene</option>
                    {/* Puedes agregar más opciones según sea necesario */}
                </select>
            </div>
    
            <div className="form-group">
                <label className="label-recibo">Cantidad (litros):</label>
                <input className="input-recibo" type="number" min="0" placeholder="Cantidad en litros" />
            </div>

            <div className="form-group">
                <label className="label-recibo">Tarifa (especial):</label>
                <select className="input-recibo">
                    <option value="">Seleccionar</option>
                    <option value="100LL">Tarifa 100 LL</option>
                    <option value="mogas">Mogas</option>
                    {/* Puedes agregar más opciones según sea necesario */}
                </select>
            </div>
    
            <div className="form-group asociado-search">
                <label className="label-recibo">Asociado:</label>
                <input className="input-recibo" type="text" placeholder='Buscar asociado o tercero'/>
                <button className="search-btn"><FaSearch /></button>
            </div>
    
            <div className="form-group">
                <label className="label-recibo">Fecha:</label>
                <input className="input-recibo" type="date" />
            </div>
    
            <div className="form-group">
                <label className="label-recibo">Monto:</label>
                <input className="input-recibo" type="number" min="0" placeholder="Monto total" />
            </div>
    
            <div className="form-group">
                <label className="label-recibo">Observaciones:</label>
                <textarea className="input-recibo" rows="3" placeholder="Añadir observaciones"></textarea>
            </div>
            <hr/>
        </>
    );
    

    const renderFormularioOtros = () => (
    <>
        <div className="form-group">
            <label className="label-recibo">N° Recibo:</label>
            <input className="input-recibo" type="text" placeholder="(número generado automáticamente)" />
        </div>

        <div className="form-group">
            <label className="label-recibo">Producto:</label>
            <select className="input-recibo">
                <option value="">Seleccionar producto</option>
                {/* Puedes agregar más opciones según sea necesario */}
            </select>
        </div>

        <div className="form-group">
            <label className="label-recibo">Cantidad (unidades):</label>
            <input className="input-recibo" type="number" min="0" placeholder="Cantidad en unidades" />
        </div>

        <div className="form-group">
            <label className="label-recibo">Tarifa (especial):</label>
            <select className="input-recibo">
                <option value="">Seleccionar</option>
                <option value="tarifa1">Tarifa Especial 1</option>
                <option value="tarifa2">Tarifa Especial 2</option>
                {/* Puedes agregar más opciones según sea necesario */}
            </select>
        </div>

        <div className="form-group asociado-search">
            <label className="label-recibo">Asociado:</label>
            <input className="input-recibo" type="text" placeholder='Buscar asociado o tercero' />
            <button className="search-btn"><FaSearch /></button>
        </div>

        <div className="form-group">
            <label className="label-recibo">Fecha:</label>
            <input className="input-recibo" type="date" />
        </div>

        <div className="form-group">
            <label className="label-recibo">Monto:</label>
            <input className="input-recibo" type="number" min="0" placeholder="Monto total" />
        </div>

        <div className="form-group">
            <label className="label-recibo">Observaciones:</label>
            <textarea className="input-recibo" rows="3" placeholder="Añadir observaciones"></textarea>
        </div>
        <hr />
    </>
);


    return (
        <div className="formulario-recibos">
            <h1>Nuevo Recibo</h1>
            <div className="form-group">
                <label className="label-recibo">Tipo de recibo:</label>
                <select className="input-recibo" value={tipoRecibo} onChange={(e) => setTipoRecibo(e.target.value)}>
                    <option value="Vuelo">Vuelo</option>
                    <option value="Combustible">Combustible</option>
                    <option value="Otros">Otros</option>
                </select>
            </div>
            <hr></hr>
            {tipoRecibo === "Vuelo" && renderFormularioVuelo()}
            {tipoRecibo === "Combustible" && renderFormularioCombustible()}
            {tipoRecibo === "Otros" && renderFormularioOtros()}
            {/* Agrega aquí los formularios para otros tipos de recibos si es necesario */}
            
            <div className="buttons">
                <button className="generate-btn">Generar</button>
                <button className="cancel-btn">Cancelar</button>
            </div>
        </div>
    );
}

export default FormularioGestorRecibos;
