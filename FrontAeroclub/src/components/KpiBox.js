import React from 'react';
import './styles/KpiBox.css';

const KpiBox = ({ data }) => {
  return (
    <div className="kpi-container">
      {data.map((item, index) =>
        item.value ? ( // Renderiza solo si el valor existe
          <div key={index} className="kpi-box">
            <h3 className="kpi-title">{item.title}</h3>
            <p className="kpi-value">{item.value}</p>
          </div>
        ) : null
      )}
    </div>
  );
};

export default KpiBox;
