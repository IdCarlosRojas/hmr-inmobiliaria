import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

import HomePage from './pages/HomePage';
import PropiedadesPage from './pages/PropiedadesPage';
import PropiedadDetallePage from './pages/PropiedadDetallePage';
import LoginPage from './pages/LoginPage';
import NosotrosPage from './pages/NosotrosPage';
import ContactoPage from './pages/ContactoPage';
import DashboardPage from './pages/admin/DashboardPage';
import PropiedadesAdminPage from './pages/admin/PropiedadesAdminPage';
import ContratosPage from './pages/admin/ContratosPage';
import CitasPage from './pages/admin/CitasPage';
import UsuariosPage from './pages/admin/UsuariosPage';

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/propiedades" element={<PublicLayout><PropiedadesPage /></PublicLayout>} />
          <Route path="/propiedades/:id" element={<PublicLayout><PropiedadDetallePage /></PublicLayout>} />
          <Route path="/nosotros" element={<PublicLayout><NosotrosPage /></PublicLayout>} />
          <Route path="/contacto" element={<PublicLayout><ContactoPage /></PublicLayout>} />

          {/* Admin */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout><DashboardPage /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/propiedades" element={<ProtectedRoute><AdminLayout><PropiedadesAdminPage /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/contratos" element={<ProtectedRoute><AdminLayout><ContratosPage /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/citas" element={<ProtectedRoute><AdminLayout><CitasPage /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/usuarios" element={<ProtectedRoute><AdminLayout><UsuariosPage /></AdminLayout></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;