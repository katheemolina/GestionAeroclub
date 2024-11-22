import React from "react";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

// Estilos para el recibo
const styles = StyleSheet.create({
page: {
padding: 30,
fontFamily: "Helvetica",
},
header: {
textAlign: "center",
marginBottom: 20,
},
section: {
marginBottom: 10,
padding: 10,
borderBottom: "1px solid #ccc",
},
title: {
fontSize: 16,
fontWeight: "bold",
marginBottom: 5,
},
text: {
fontSize: 12,
},
footer: {
textAlign: "center",
marginTop: 20,
fontSize: 10,
color: "#555",
},
});

// Componente para el recibo
const ReciboPDF = ({ recibo }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.title}>Aeroclub - Recibo de Pago</Text>
        <Text style={styles.text}>Fecha: {new Date().toLocaleDateString()}</Text>
      </View>

      {/* Información del Asociado */}
      <View style={styles.section}>
        <Text style={styles.title}>Información del Asociado:</Text>
        <Text style={styles.text}>Nombre: {recibo.usuario}</Text>
        <Text style={styles.text}>N° de Recibo: {recibo.numero_recibo}</Text>
      </View>

      {/* Detalles del Recibo */}
      <View style={styles.section}>
        <Text style={styles.title}>Detalles del Recibo:</Text>
        <Text style={styles.text}>Tipo de Recibo: {recibo.tipo_recibo}</Text>
        <Text style={styles.text}>Estado: {recibo.estado}</Text>
        <Text style={styles.text}>Importe: ${recibo.importe}</Text>
        <Text style={styles.text}>Fecha: {recibo.fecha}</Text>
      </View>

      {/* Pie de página */}
      <View style={styles.footer}>
        <Text>Gracias por confiar en nuestro servicio.</Text>
      </View>
    </Page>
  </Document>
);

export const PDFButton = ({ recibo }) => (
<PDFDownloadLink
    document={<ReciboPDF recibo={recibo} />}
    fileName={`Recibo_${recibo.numero_recibo}.pdf`}
>
{({ loading }) =>
    loading ? "Generando PDF..." : <button>Descargar Recibo</button>
}
</PDFDownloadLink>
);

export default ReciboPDF;
