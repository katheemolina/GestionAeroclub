import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { RoleProvider } from './context/RoleContext';
import { UserProvider } from './context/UserContext';


const root = createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <UserProvider>
      <RoleProvider>
        <App />
      </RoleProvider>
    </UserProvider>
  // </React.StrictMode>
);
