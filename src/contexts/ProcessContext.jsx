import React, { createContext, useState, useEffect } from 'react';
import { testProcesses, testServices } from '../data/testData';
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
      setProcesses(testProcesses);
      setServices(testServices);
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