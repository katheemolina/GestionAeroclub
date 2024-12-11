import React, { useEffect, useState } from 'react';
import '../../styles/datatable-style.css';
import PantallaCarga from '../../components/PantallaCarga';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { actualizarConfiguraciones, obtenerConfiguraciones } from '../../services/configuracionesApi';

const AdministradorConfiguraciones = () => {
  const [loading, setLoading] = useState(true);
  const [configuraciones, setConfiguraciones] = useState([]);

  // Fetch configuraciones data from the API
  const fetchConfiguraciones = async () => {
    try {
      const data = await obtenerConfiguraciones();
      setConfiguraciones(data.data[0]); // Guardamos los datos obtenidos
    } catch (error) {
      console.error('Error fetching configuraciones:', error);
    }
    setLoading(false); // Cuando los datos se cargan, cambiamos el estado de loading
  };

  useEffect(() => {
    fetchConfiguraciones(); // Fetch configuraciones on component mount
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfiguraciones({
      ...configuraciones,
      [name]: value
    });
  };

  const validarFormulario = () => {
    const camposFaltantes = [];

    if (!configuraciones.tiempo_adaptacion) camposFaltantes.push("tiempo_adaptacion");
    if (!configuraciones.aterrizajes_adaptacion) camposFaltantes.push("aterrizajes_adaptacion");
    if (!configuraciones.dias_vencimiento_cma) camposFaltantes.push("dias_vencimiento_cma");
    if (!configuraciones.saldo_inicial) camposFaltantes.push("saldo_inicial");
    if (!configuraciones.numero_recibo_inicial) camposFaltantes.push("numero_recibo_inicial");

    if (camposFaltantes.length > 0) {
      toast.warning(`Completa los siguientes campos: ${camposFaltantes.join(", ")}`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      // Preparar el objeto de datos que se enviará al endpoint
      const dataToUpdate = {
        tiempo_adaptacion: configuraciones.tiempo_adaptacion,
        aterrizajes_adaptacion: configuraciones.aterrizajes_adaptacion,
        dias_vencimiento_cma: configuraciones.dias_vencimiento_cma,
        saldo_inicial: configuraciones.saldo_inicial,
        numero_recibo_inicial: configuraciones.numero_recibo_inicial
      };
      // Enviar los datos al endpoint de actualización
      await actualizarConfiguraciones(dataToUpdate);
      toast.success("Datos actualizados correctamente");

      // Vuelve a cargar las configuraciones después de actualizar
      await fetchConfiguraciones();
    } catch (error) {
      console.error("Error al actualizar datos:", error);
      toast.error("Error al actualizar datos");
    }
  };

  if (loading) {
    return <PantallaCarga />;
  }

  return (
    <div className="background">
      <ToastContainer />
      <header className="header">
        <h1>Configuraciones Generales</h1>
      </header>
      <div className='contenedor-para-centrar'>
        <form className="edit-form" onSubmit={handleSubmit}>
          <h3>Parametros para adaptacion de aeronave:</h3>
          <div className="form-row">
            <label>
              Horas de vuelo en el ultimo mes:
              <input
                type="number"
                name="tiempo_adaptacion"
                placeholder="Horas de vuelo"
                value={configuraciones.tiempo_adaptacion}
                onChange={handleChange}
                step="0.01"
              />
            </label>
            <label>
              Aterrizajes:
              <input
                type="number"
                name="aterrizajes_adaptacion"
                placeholder="Aterrizajes"
                value={configuraciones.aterrizajes_adaptacion}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Días para Vencimiento CMA:
              <input
                type="text"
                name="dias_vencimiento_cma"
                placeholder="Días para Vencimiento CMA"
                value={configuraciones.dias_vencimiento_cma}
                onChange={handleChange}
              />
            </label>
          </div>
          <h3>Parámetros Iniciales:</h3>
          <div className="form-row">
          <label>
            Saldo Inicial:
            <input
                type="number"
                name="saldo_inicial"
                placeholder="Saldo Inicial"
                value={configuraciones.saldo_inicial}
                onChange={handleChange}
                step="0.01"
            />
            </label>
            <label>
              Número de Recibo Inicial:
              <input
                type="number"
                name="numero_recibo_inicial"
                placeholder="Número de Recibo Inicial"
                value={configuraciones.numero_recibo_inicial}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="button-container">
            <button className="guardar" type="submit">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdministradorConfiguraciones;
