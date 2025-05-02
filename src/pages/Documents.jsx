import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DocumentForm from '../components/document/DocumentForm';
import DocumentList from '../components/document/DocumentList';

export default function Documents() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Gestion des Documents</h1>
      
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Liste des documents</TabsTrigger>
          <TabsTrigger value="create">Créer un document</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <DocumentList />
        </TabsContent>
        
        <TabsContent value="create">
          <DocumentForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}