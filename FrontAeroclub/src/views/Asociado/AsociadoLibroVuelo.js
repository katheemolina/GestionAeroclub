import React, { useEffect, useState } from 'react';
import "./Styles/AsociadoLibroVuelo.css";
import { obtenerLibroDeVueloPorUsuario, totalesHorasVueloPorUsuario } from '../../services/vuelosApi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useUser } from '../../context/UserContext';
import PantallaCarga from '../../components/PantallaCarga';
import { toast } from 'react-toastify';
import KpiBox from '../../components/KpiBox';

function AsociadoLibroVuelo() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { usuarioId } = useUser();
  const [kpiData, setKpiData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vuelosResponse = await obtenerLibroDeVueloPorUsuario(usuarioId);
        setData(vuelosResponse);

        const kpiResponse = await totalesHorasVueloPorUsuario(usuarioId);
        if (kpiResponse && kpiResponse.length > 0) {
          const primerElemento = kpiResponse[0];
          setKpiData([
            { title: 'Total horas voladas', value: primerElemento.total_horas_voladas },
            { title: 'Horas históricas', value: primerElemento.horas_historicas },
            { title: 'Horas voladas último mes', value: primerElemento.horas_voladas_ultimo_mes },
            ...kpiResponse.map(item => ({
              title: `Vuelo en ${item.matricula}`,
              value: `${item.tiempo} horas`
            }))
          ]);
        }
      } catch (error) {
        toast.error("Error al obtener datos: " + error);
      }
      setLoading(false);
    };
    
    fetchData();
  }, [usuarioId]);

  if (loading) {
    return <PantallaCarga />;
  }

  return (
    <div className="background">
      <header className="header">
        <h1>Libro de Vuelo</h1>
      </header>
      <KpiBox data={kpiData} />
      <DataTable value={data} paginator rows={15} scrollable scrollHeight="800px">
        <Column field="fecha" header="Fecha" sortable />
        <Column field="matricula" header="Aeronave" sortable />
        <Column field="origen" header="Origen" sortable />
        <Column field="destino" header="Destino" sortable />
        <Column field="tiempo_vuelo" header="Tiempo" sortable />
      </DataTable>
    </div>
  );
}

export default AsociadoLibroVuelo;
