import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';  // Cambiado Switch a Routes y Redirect a Navigate
import './utils/primeReactConfig';
// Asociados
import AsociadoDashboard from './views/Asociado/AsociadoDashboard';
import AsociadoCuentaCorriente from './views/Asociado/AsociadoCuentaCorriente';
import AsociadoLibroVuelo from './views/Asociado/AsociadoLibroVuelo';
import AsociadoPerfil from './views/Asociado/AsociadoPerfil';
// Gestores
import GestorDashboard from './views/Gestor/GestorDashboard';
import GestorRecibos from './views/Gestor/GestorRecibos';
import GestorCuentaCorriente from './views/Gestor/GestorCuentaCorriente';
import GestorAsociados from './views/Gestor/GestorAsociados';
import GestorVuelos from './views/Gestor/GestorVuelos';
import GestorTarifas from './views/Gestor/GestorTarifas';
import GestorAeronaves from './views/Gestor/GestorAeronaves';
import GestorAsociadoDashboard from './views/Gestor/GestorAsociadoDashboard';
import GestorAsociadoCuentaCorriente from './views/Gestor/GestorAsociadoCuentaCorriente';
import GestorNuevoRecibo from './views/Gestor/GestorNuevoRecibo';
import GestorGenerarCuotasSociales from './views/Gestor/GestorGenerarCuotasSociales';

// Instructores
import InstructorAsociados from './views/Instructor/InstructorAsociados';

// User deshabilitado
import UsuarioDeshabilitado from './components/UsuarioDeshabilitado';

import { useRole } from './context/RoleContext';
import { useUser } from './context/UserContext';
import './styles/Index.css';
import Inicio from './Inicio';
import Bienvenida from './views/Bienvenida';
import Sidebar from './components/Sidebar';

import 'primereact/resources/themes/lara-light-indigo/theme.css';  // O cualquier tema que prefieras
import 'primereact/resources/primereact.min.css';
import InstructorAsociadoDashboard from './views/Instructor/InstructorAsociadoDashboard';
import InstructorVuelosPorUsuario from './views/Instructor/InstructorVuelosPorUsuario';
import AsociadoTarifas from './views/Asociado/AsociadoTarifas';
import AsociadoAeronaves from './views/Asociado/AsociadoAeronaves';





function ProtectedRoute({ component: Component, allowedRoles, ...rest }) {
  const { role } = useRole();
  const { user, isAuthenticated, isUserEnabled  } = useUser();

return allowedRoles.includes(role.toLowerCase()) & isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/Bienvenido" replace />
  );
}

function App() {
  const { isUserEnabled, isAuthenticated } = useUser(); // Contexto que proporciona la información del usuario

  if (!isUserEnabled) {
    // Si el usuario está deshabilitado, renderiza solo este componente
    return (
      <Router>
        <Routes>
          <Route path="*" element={<UsuarioDeshabilitado />} />
        </Routes>
      </Router>
    );
  }

  if (!isAuthenticated) {
    
    // Si no está autenticado, redirige al login
    return (
      <Router>
        <Routes>
          <Route path="*" element={<Inicio />} />
        </Routes>
      </Router>
    );
  }

  return (



    <Router>
      {/* <Navbar /> */}

      


      <div className="app-container">
        <Sidebar />
        {/* Rutas según el rol */}
        <div className="layout">
          <Routes>

            {/* Rutas para Asociado */}
            <Route path="/asociado/dashboard" element={<ProtectedRoute component={AsociadoDashboard} allowedRoles={['asociado']} />} />
            <Route path="/asociado/cuenta-corriente" element={<ProtectedRoute component={AsociadoCuentaCorriente} allowedRoles={['asociado']} />} />
            <Route path="/asociado/libro-vuelo" element={<ProtectedRoute component={AsociadoLibroVuelo} allowedRoles={['asociado']} />} />
            <Route path="/asociado/perfil" element={<ProtectedRoute component={AsociadoPerfil} allowedRoles={['asociado']} />} />
            <Route path="/asociado/aeronaves" element={<ProtectedRoute component={AsociadoAeronaves} allowedRoles={['asociado']} />} />
            <Route path="/asociado/tarifas" element={<ProtectedRoute component={AsociadoTarifas} allowedRoles={['asociado']} />} />

            {/* Rutas para Gestor */}
            <Route path="/gestor/dashboard" element={<ProtectedRoute component={GestorDashboard} allowedRoles={['gestor']} />} />
            <Route path="/gestor/dashboardAsociado" element={<ProtectedRoute component={GestorAsociadoDashboard} allowedRoles={['gestor']} />} />
            <Route path="/gestor/asociadoCuentaCorriente" element={<ProtectedRoute component={GestorAsociadoCuentaCorriente} allowedRoles={['gestor']} />} />
            <Route path="/gestor/recibos" element={<ProtectedRoute component={GestorRecibos} allowedRoles={['gestor']} />} />
            <Route path="/gestor/vuelos" element={<ProtectedRoute component={GestorVuelos} allowedRoles={['gestor']} />} />
            <Route path="/gestor/cuenta-corriente" element={<ProtectedRoute component={GestorCuentaCorriente} allowedRoles={['gestor']} />} />
            <Route path="/gestor/asociados" element={<ProtectedRoute component={GestorAsociados} allowedRoles={['gestor']} />} />
            <Route path="/gestor/tarifas" element={<ProtectedRoute component={GestorTarifas} allowedRoles={['gestor']} />} />
            <Route path="/gestor/aeronaves" element={<ProtectedRoute component={GestorAeronaves} allowedRoles={['gestor']} />} />
            <Route path="/gestor/generarCuotaSocial" element={<ProtectedRoute component={GestorGenerarCuotasSociales} allowedRoles={['gestor']} />} />
            {/* ruta nuevo recibo */}
            <Route path="/gestor/recibos/nuevo" element={<ProtectedRoute component={GestorNuevoRecibo} allowedRoles={['gestor']} />} />

            {/* Rutas para Instructor */}
            <Route path="/instructor/dashboard" element={<ProtectedRoute component={AsociadoDashboard} allowedRoles={['instructor']} />} />
            <Route path="/instructor/dashboardAsociado" element={<ProtectedRoute component={InstructorAsociadoDashboard} allowedRoles={['instructor']} />} />
            <Route path="/instructor/perfil" element={<ProtectedRoute component={AsociadoPerfil} allowedRoles={['instructor']} />} />
            <Route path="/instructor/libro-vuelo" element={<ProtectedRoute component={AsociadoLibroVuelo} allowedRoles={['instructor']} />} />
            <Route path="/instructor/cuenta-corriente" element={<ProtectedRoute component={AsociadoCuentaCorriente} allowedRoles={['instructor']} />} />
            <Route path="/instructor/asociados" element={<ProtectedRoute component={InstructorAsociados} allowedRoles={['instructor']} />} />
            <Route path="/instructor/vuelos" element={<ProtectedRoute component={InstructorVuelosPorUsuario} allowedRoles={['instructor']} />} />
            <Route path="/instructor/aeronaves" element={<ProtectedRoute component={AsociadoAeronaves} allowedRoles={['instructor']} />} />
            <Route path="/instructor/tarifas" element={<ProtectedRoute component={AsociadoTarifas} allowedRoles={['instructor']} />} />

            <Route path="*" element={<ProtectedRoute component={Bienvenida} allowedRoles={['asociado', 'gestor', 'instructor']} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
