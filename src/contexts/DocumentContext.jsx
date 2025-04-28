import React, { createContext, useState, useEffect } from 'react';

export const DocumentContext = createContext();

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulons un chargement depuis une API
  useEffect(() => {
    setLoading(true);
    // Dans une application réelle, vous feriez un appel API ici
    setTimeout(() => {
      setDocuments([
        {
          id: '1',
          name: 'Contrat A',
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
          processId: '1',
          status: 'en cours',
          currentStepId: '2',
          history: [
            { 
              stepId: '1', 
              serviceId: '1', 
              validatedBy: 'John Doe', 
              date: new Date(new Date().setDate(new Date().getDate() - 3)), 
              status: 'validé' 
            }
          ]
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const addDocument = (document) => {
    setDocuments([...documents, { ...document, id: Date.now().toString() }]);
  };

  const updateDocument = (updatedDoc) => {
    setDocuments(documents.map(doc => doc.id === updatedDoc.id ? updatedDoc : doc));
  };

  const deleteDocument = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  return (
    <DocumentContext.Provider 
      value={{ 
        documents, 
        loading, 
        error, 
        addDocument, 
        updateDocument, 
        deleteDocument 
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
