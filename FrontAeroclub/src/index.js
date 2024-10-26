import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { RoleProvider } from './context/RoleContext'; // Asegúrate de que la ruta sea correcta


const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RoleProvider>
      <App />
    </RoleProvider>
  </React.StrictMode>
);
