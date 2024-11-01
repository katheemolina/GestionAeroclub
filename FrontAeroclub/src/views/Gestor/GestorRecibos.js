import React from "react";
import TableComponent from "../../components/TableComponent"
import '../../styles/Gestor_styles/GestorRecibos.css'

function GestorRecibos(){

    const columns = [
        { header: 'Fecha', accessor: 'fecha' },
        { header: 'N° Recibo', accessor: 'numero' },
        { header: 'Concepto', accessor: 'concepto' },
        { header: 'Importe', accessor: 'importe' },
        { header: 'Generado por', accessor: 'generado_por' }
      ];

    const data = [
        {
            fecha: '2024-10-01',
            numero: 234,
            concepto: 'vuelo',
            importe: 120000.00,
            generado_por: 'Gustavo Cerati'
        },
        {
            fecha: '2024-10-02',
            numero: 235,
            concepto: 'combustible',
            importe: 8000.00,
            generado_por: 'Luis Alberto Spinetta'
        },
        {
            fecha: '2024-11-08',
            numero: 236,
            concepto: 'vuelo',
            importe: 120000.00,
            generado_por: 'Mercedes Sosa'
        },
        {
            fecha: '2024-11-20',
            numero: 237,
            concepto: 'vuelo',
            importe: 120000.00,
            generado_por: 'Trueno'
        }
    ]
    
    return (
        <div className="background">
        <header className="header">
          <h1>Recibos</h1>
        </header>
        <div className="button-container">
            <div className="nuevo-recibo-btn"> Nuevo </div>
            <div className="filtrar-dropdown"> Filtrar por: </div>
            <div className="fecha-campo"> Desde </div>
            <div className="fecha-campo"> Hasta </div>
        </div>

        
        {/* no sé qué iría acá */}
        <TableComponent columns={columns} data={data} />
      </div>
    );
}

export default GestorRecibos;