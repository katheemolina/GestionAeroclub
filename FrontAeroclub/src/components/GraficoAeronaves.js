import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { obtenerHorasPorDiaAeronaves } from "../services/dashboardGestor"; // Importa el servicio
import "./styles/GraficoAeronaves.css";

export function GraficoAeronaves() {
  // Estado para almacenar los datos
  const [data, setData] = useState([]);
  const [aeronaves, setAeronaves] = useState([]);
  const [diasDelMes, setDiasDelMes] = useState(31); 

  // Colores para las aeronaves, puedes agregar más colores según sea necesario
  const aeronavesColores = {
    "LV-YOH": "#8884d8", // Azul
    "LV-S141": "#82ca9d", // Verde
    "LV-NEW": "#ffc658", // Amarillo
    "LV-OMR": "#ff7300", // Naranja
  };



  // Función para calcular el número de días en un mes dado
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  // Fetch de los datos cuando el componente se monte
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await obtenerHorasPorDiaAeronaves();
        
        // Determinamos el mes y año de los datos (puedes cambiar esto según sea necesario)
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;  // Los meses empiezan desde 0, así que sumamos 1
        const year = currentDate.getFullYear();

        // Calculamos los días del mes
        const numDays = getDaysInMonth(year, month);
        setDiasDelMes(numDays);

        // Procesa los datos para el gráfico
        const formattedData = processData(result, numDays);
        setData(formattedData);
        
        // Extraemos las matrículas únicas
        const uniqueAeronaves = getUniqueAeronaves(result);
        setAeronaves(uniqueAeronaves);
      } catch (error) {
        console.error('Error al obtener los datos', error);
      }
    };

    fetchData();
  }, []);

  // Función para organizar los datos en el formato necesario para el gráfico
  const processData = (result, numDays) => {
    const processedData = [];
    
    
    // Creamos un objeto para almacenar las horas por día de cada matrícula
    const horasPorDia = {};

    // Inicializamos los días con las claves
    for (let dia = 1; dia <= numDays; dia++) {
      horasPorDia[dia] = { date: `${dia < 10 ? '0' + dia : dia}/${new Date().getMonth() + 1}` };  // Formato de fecha
      aeronaves.forEach(matricula => {
        horasPorDia[dia][matricula] = 0;  // Inicializa las horas para cada matrícula
      });
    }

    // Llenamos el objeto con los datos del resultado
    result.forEach(item => {
      if (item.matricula && horasPorDia[item.Dia]) {
        // Asignamos las horas correspondientes a la matrícula y al día
        horasPorDia[item.Dia][item.matricula] = parseFloat(item.HorasTotalesPorDia);
      }
    });

    // Convertimos el objeto a un array que es el formato esperado por el gráfico
    for (let dia = 1; dia <= 31; dia++) {
      processedData.push(horasPorDia[dia]);
    }

    return processedData;
  };

  // Función para obtener las matrículas únicas de los datos
  const getUniqueAeronaves = (result) => {
    const aeronavesSet = new Set();
    result.forEach(item => {
      if (item.matricula) {
        aeronavesSet.add(item.matricula);
      }
    });
    return [...aeronavesSet];
  };

  return (
    <div className="grafico-container">
      <div className="grafico-title">
        <h2>Horas de vuelo por Aeronave en el mes</h2>
      </div>
      <div className="grafico-content">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            
            {/* Creamos dinámicamente las líneas para cada aeronave */}
            {aeronaves.map((matricula) => (
              <Line 
                key={matricula} 
                type="monotone" 
                dataKey={matricula} 
                stroke={aeronavesColores[matricula] || "#000000"} // Color por aeronave
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
