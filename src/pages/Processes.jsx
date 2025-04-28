import React, { useContext, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProcessContext } from '../contexts/ProcessContext';
import ProcessBuilder from '../components/process/ProcessBuilder';
import ProcessList from '../components/process/ProcessList';

export default function Processes() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Gestion des Processus</h1>
      
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Liste des processus</TabsTrigger>
          <TabsTrigger value="create">Créer un processus</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <ProcessList />
        </TabsContent>
        
        <TabsContent value="create">
          <ProcessBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
}