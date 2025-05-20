import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import RubricsPage from './pages/schemas/SchemasPage';
import RubricDetailPage from './pages/schemas/SchemaDetailPage';
import DocumentsPage from './pages/documents/DocumentsPage';
import DocumentDetailPage from './pages/documents/DocumentDetailPage';
import GradingPage from './pages/grading/GradingPage';
import CollaboratorsPage from './pages/collaborators/CollaboratorsPage';
import SettingsPage from './pages/settings/SettingsPage';

// Providers
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          
          {/* App Routes */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/rubrics" element={<RubricsPage />} />
            <Route path="/rubrics/:id" element={<RubricDetailPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/documents/:id" element={<DocumentDetailPage />} />
            <Route path="/grading/:documentId" element={<GradingPage />} />
            <Route path="/collaborators" element={<CollaboratorsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;