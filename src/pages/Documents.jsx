import React, { useContext, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentContext } from '../contexts/DocumentContext';
import DocumentForm from '../components/document/DocumentForm';
import DocumentList from '../components/document/DocumentList';
import DocumentDetail from '../components/document/DocumentDetail';

export default function Documents() {
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Gestion des Documents</h1>
      
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Liste des documents</TabsTrigger>
          <TabsTrigger value="create">Créer un document</TabsTrigger>
          {selectedDocumentId && (
            <TabsTrigger value="detail">Détails du document</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="list">
          <DocumentList onSelectDocument={setSelectedDocumentId} />
        </TabsContent>
        
        <TabsContent value="create">
          <DocumentForm />
        </TabsContent>
        
        {selectedDocumentId && (
          <TabsContent value="detail">
            <DocumentDetail documentId={selectedDocumentId} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}