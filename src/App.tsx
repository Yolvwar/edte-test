// App.jsx - Point d'entrée de l'application
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DocumentProvider } from './contexts/DocumentContext';
import { ProcessProvider } from './contexts/ProcessContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Processes from './pages/Processes';
import Validations from './pages/Validations';

function App() {
  return (
    <Router>
      <DocumentProvider>
        <ProcessProvider>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/processes" element={<Processes />} />
              <Route path="/validations" element={<Validations />} />
            </Routes>
          </MainLayout>
        </ProcessProvider>
      </DocumentProvider>
    </Router>
  );
}

export default App;