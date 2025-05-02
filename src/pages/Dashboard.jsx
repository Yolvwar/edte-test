import React, { useContext } from 'react';
import { DocumentContext } from '../contexts/DocumentContext';
import { ProcessContext } from '../contexts/ProcessContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, GitBranch, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { documents } = useContext(DocumentContext);
  const { processes } = useContext(ProcessContext);
  const navigate = useNavigate();
  
  // Statistiques des documents
  const totalDocuments = documents.length;
  const validatedDocuments = documents.filter(doc => doc.status === 'validé').length;
  const pendingDocuments = documents.filter(doc => doc.status === 'en cours').length;
  const rejectedDocuments = documents.filter(doc => doc.status === 'rejeté').length;
  
  // Documents nécessitant une action
  const documentsNeedingAction = documents.filter(doc => {
    if (doc.status !== 'en cours') return false;
    
    const process = processes.find(proc => proc.id === doc.processId);
    if (!process) return false;
    
    const currentStep = process.steps.find(step => step.id === doc.currentStepId);
    return currentStep && currentStep.serviceId === '1'; // Supposons que '1' est l'ID du service de l'utilisateur actuel
  });
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDocuments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <GitBranch className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDocuments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Validés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{validatedDocuments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rejetés</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedDocuments}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Actions requises</CardTitle>
          </CardHeader>
          <CardContent>
            {documentsNeedingAction.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                Aucune action requise pour le moment
              </div>
            ) : (
              <div className="space-y-4">
                {documentsNeedingAction.map(doc => {
                  const process = processes.find(p => p.id === doc.processId);
                  const currentStep = process?.steps.find(s => s.id === doc.currentStepId);
                  
                  return (
                    <Alert key={doc.id} className="cursor-pointer" onClick={() => navigate(`/document/${doc.id}`)}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>{doc.name}</AlertTitle>
                      <AlertDescription>
                        Étape en attente: {currentStep?.name || 'Étape inconnue'}
                      </AlertDescription>
                    </Alert>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Processus disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            {processes.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                Aucun processus disponible
              </div>
            ) : (
              <div className="space-y-2">
                {processes.map(process => (
                  <div key={process.id} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                    <div>
                      <h3 className="font-medium">{process.name}</h3>
                      <p className="text-sm text-gray-500">{process.steps.length} étapes</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate('/processes')}
                    >
                      Voir
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}