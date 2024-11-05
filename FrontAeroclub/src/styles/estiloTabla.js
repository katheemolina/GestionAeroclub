const estiloTabla = {
    headCells: {
      style: {
        backgroundColor: 'rgba(169, 70, 70, 1)', // Color de fondo del encabezado
        color: 'white',             // Color del texto del encabezado
        fontWeight: 'bold',
        fontSize: '16px',
      },
    },
    tableWrapper: {
      style: {
        borderTopLeftRadius: '10px',    // Esquina superior izquierda
        borderTopRightRadius: '10px', 
        overflow: 'hidden', // Asegura que los bordes redondeados no se "salgan" si hay un scroll
      },
    },
    pagination: {
      style: {
        borderBottomLeftRadius: '10px', 
        borderBottomRightRadius: '10px',           
      },
    },
  };

export default estiloTabla;