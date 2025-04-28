import React, { useContext, useState } from 'react';
import { DocumentContext } from '../contexts/DocumentContext';
import { ProcessContext } from '../contexts/ProcessContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import StepValidation from '../components/workflow/StepValidation';

export default function Validations() {
  const { documents } = useContext(DocumentContext);
  const { processes, services } = useContext(ProcessContext);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  
  // Supposons que l'utilisateur est associé au service avec l'ID '1'
  const currentUserServiceId = '1';
  
  // Filtrer les documents nécessitant une validation de la part du service de l'utilisateur
  const documentsForValidation = documents.filter(doc => {
    if (doc.status !== 'en cours') return false;
    
    const process = processes.find(p => p.id === doc.processId);
    if (!process) return false;
    
    const currentStep = process.steps.find(s => s.id === doc.currentStepId);
    return currentStep && currentStep.serviceId === currentUserServiceId;
  });
  
  const getServiceName = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Service inconnu';
  };
  
  const getStepName = (processId, stepId) => {
    const process = processes.find(p => p.id === processId);
    if (!process) return 'Étape inconnue';
    
    const step = process.steps.find(s => s.id === stepId);
    return step ? step.name : 'Étape inconnue';
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Validations en attente</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Documents nécessitant votre validation</CardTitle>
        </CardHeader>
        <CardContent>
          {documentsForValidation.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              Aucun document ne nécessite votre validation pour le moment
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Étape</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date début</TableHead>
                  <TableHead>Date fin</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documentsForValidation.map(doc => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell>{getStepName(doc.processId, doc.currentStepId)}</TableCell>
                    <TableCell>{getServiceName(currentUserServiceId)}</TableCell>
                    <TableCell>{format(new Date(doc.startDate), 'dd MMM yyyy', { locale: fr })}</TableCell>
                    <TableCell>{format(new Date(doc.endDate), 'dd MMM yyyy', { locale: fr })}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedDocumentId(doc.id)}
                      >
                        Valider
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {selectedDocumentId && (
        <Card>
          <CardHeader>
            <CardTitle>Validation du document</CardTitle>
          </CardHeader>
          <CardContent>
            <StepValidation documentId={selectedDocumentId} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}