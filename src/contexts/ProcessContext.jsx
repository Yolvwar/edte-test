import React, { createContext, useState, useEffect } from 'react';

export const ProcessContext = createContext();

export const ProcessProvider = ({ children }) => {
  const [processes, setProcesses] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulons un chargement depuis une API
  useEffect(() => {
    setLoading(true);
    // Dans une application réelle, vous feriez un appel API ici
    setTimeout(() => {
      setServices([
        { id: '1', name: 'Service Juridique', description: 'Validation juridique des documents' },
        { id: '2', name: 'Service Financier', description: 'Vérification des aspects financiers' },
        { id: '3', name: 'Direction', description: 'Approbation finale' }
      ]);
      
      setProcesses([
        {
          id: '1',
          name: 'Processus d\'approbation standard',
          description: 'Processus en 3 étapes pour les documents standard',
          steps: [
            { id: '1', name: 'Vérification juridique', serviceId: '1', order: 1, isRequired: true },
            { id: '2', name: 'Vérification financière', serviceId: '2', order: 2, isRequired: true },
            { id: '3', name: 'Approbation finale', serviceId: '3', order: 3, isRequired: true }
          ]
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const addProcess = (process) => {
    setProcesses([...processes, { ...process, id: Date.now().toString() }]);
  };

  const updateProcess = (updatedProcess) => {
    setProcesses(processes.map(proc => proc.id === updatedProcess.id ? updatedProcess : proc));
  };

  const deleteProcess = (id) => {
    setProcesses(processes.filter(proc => proc.id !== id));
  };

  return (
    <ProcessContext.Provider 
      value={{ 
        processes, 
        services,
        loading, 
        error, 
        addProcess, 
        updateProcess, 
        deleteProcess 
      }}
    >
      {children}
    </ProcessContext.Provider>
  );
};