import React, { createContext, useState, useEffect } from 'react';
import { testDocuments } from '../data/testData';
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
      setDocuments(testDocuments);
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
