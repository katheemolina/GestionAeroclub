import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';  // Cambiado Switch a Routes y Redirect a Navigate
import SidebarAsociado from './components/SidebarAsociado';
import SidebarGestor from './components/SidebarGestor';
import SidebarInstructor from './components/SidebarInstructor';
// Asociados
import AsociadoDashboard from './views/Asociado/AsociadoDashboard';
import AsociadoCuentaCorriente from './views/Asociado/AsociadoCuentaCorriente';
import AsociadoLibroVuelo from './views/Asociado/AsociadoLibroVuelo';
import AsociadoPerfil from './views/Asociado/AsociadoPerfil';
// Gestores
import GestorDashboard from './views/Gestor/GestorDashboard';
import GestorCuentaCorriente from './views/Gestor/GestorCuentaCorriente';
import GestorAsociados from './views/Gestor/GestorAsociados';
import GestorVuelos from './views/Gestor/GestorVuelos';
import GestorTarifas from './views/Gestor/GestorTarifas';
import GestorAeronaves from './views/Gestor/GestorAeronaves';
// Instructores
import InstructorAsociados from './views/Instructor/InstructorAsociados';
import InstructorCuentaCorriente from './views/Instructor/InstructorCuentaCorriente';
import InstructorDashboard from './views/Instructor/InstructorDashboard';
import InstructorLibroVuelo from './views/Instructor/InstructorLibroVuelo';
import InstructorPerfil from './views/Instructor/InstructorPerfil';

import { useRole } from './context/RoleContext';
import './styles/Index.css';

function ProtectedRoute({ component: Component, allowedRoles, ...rest }) {
  const { role } = useRole();

  return allowedRoles.includes(role) ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/" replace />
  );
}

function App() {
  const { role } = useRole();
  return (
    <Router>
      {/* <Navbar /> */}
      <div className="app-container">
        {/* Sidebar condicional según el rol */}
        {role === 'asociado' && <SidebarAsociado />}
        {role === 'gestor' && <SidebarGestor />}
        {role === 'instructor' && <SidebarInstructor />}
        
        {/* Rutas según el rol */}
        <div className="layout">
          <Routes>
            {/* Rutas para Asociado */}
            <Route path="/asociado/dashboard" element={<ProtectedRoute component={AsociadoDashboard} allowedRoles={['asociado']} />} />
            <Route path="/asociado/cuenta-corriente" element={<ProtectedRoute component={AsociadoCuentaCorriente} allowedRoles={['asociado']} />} />
            <Route path="/asociado/libro-vuelo" element={<ProtectedRoute component={AsociadoLibroVuelo} allowedRoles={['asociado']} />} />
            <Route path="/asociado/perfil" element={<ProtectedRoute component={AsociadoPerfil} allowedRoles={['asociado']} />} />
            
            {/* Rutas para Gestor */}
            <Route path="/gestor/dashboard" element={<ProtectedRoute component={GestorDashboard} allowedRoles={['gestor']} />} />
            <Route path="/gestor/vuelos" element={<ProtectedRoute component={GestorVuelos} allowedRoles={['gestor']} />} />
            <Route path="/gestor/cuenta-corriente" element={<ProtectedRoute component={GestorCuentaCorriente} allowedRoles={['gestor']} />} />
            <Route path="/gestor/asociados" element={<ProtectedRoute component={GestorAsociados} allowedRoles={['gestor']} />} />
            <Route path="/gestor/tarifas" element={<ProtectedRoute component={GestorTarifas} allowedRoles={['gestor']} />} />
            <Route path="/gestor/aeronaves" element={<ProtectedRoute component={GestorAeronaves} allowedRoles={['gestor']} />} />
            
            {/* Rutas para Instructor */}
            <Route path="/instructor/dashboard" element={<ProtectedRoute component={InstructorDashboard} allowedRoles={['instructor']} />} />
            <Route path="/instructor/perfil" element={<ProtectedRoute component={InstructorPerfil} allowedRoles={['instructor']} />} />
            <Route path="/instructor/libro-vuelo" element={<ProtectedRoute component={InstructorLibroVuelo} allowedRoles={['instructor']} />} />
            <Route path="/instructor/cuenta-corriente" element={<ProtectedRoute component={InstructorCuentaCorriente} allowedRoles={['instructor']} />} />
            <Route path="/instructor/asociados" element={<ProtectedRoute component={InstructorAsociados} allowedRoles={['instructor']} />} />

            {/* Ruta por defecto */}
            <Route path="/" element={
              <>
                <h1>Bienvenido al Sistema de Gestión de Aeroclubes</h1>
                <p>Selecciona tu rol para acceder a las funcionalidades correspondientes.</p>
              </>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
