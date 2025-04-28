import React, { useState, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DocumentContext } from '../../contexts/DocumentContext';
import { ProcessContext } from '../../contexts/ProcessContext';

export default function StepValidation({ documentId }) {
  const { documents, updateDocument } = useContext(DocumentContext);
  const { processes, services } = useContext(ProcessContext);
  const [comment, setComment] = useState('');
  
  const document = documents.find(doc => doc.id === documentId);
  
  if (!document) {
    return <div>Document non trouvé</div>;
  }
  
  const process = processes.find(proc => proc.id === document.processId);
  
  if (!process) {
    return <div>Processus non trouvé</div>;
  }
  
  const currentStep = process.steps.find(step => step.id === document.currentStepId);
  
  if (!currentStep) {
    return <div>Étape non trouvée</div>;
  }
  
  const currentService = services.find(service => service.id === currentStep.serviceId);
  
  const handleValidate = () => {
    // Ajouter l'étape actuelle à l'historique
    const updatedHistory = [
      ...document.history,
      {
        stepId: currentStep.id,
        serviceId: currentStep.serviceId,
        validatedBy: "Utilisateur actuel", // Dans une vraie app, prenez l'utilisateur connecté
        date: new Date(),
        status: 'validé',
        comment
      }
    ];
    
    // Trouver la prochaine étape
    const currentStepIndex = process.steps.findIndex(step => step.id === document.currentStepId);
    const nextStep = process.steps[currentStepIndex + 1];
    
    // Mettre à jour le document
    const updatedDocument = {
      ...document,
      history: updatedHistory,
      currentStepId: nextStep ? nextStep.id : null,
      status: nextStep ? 'en cours' : 'validé'
    };
    
    updateDocument(updatedDocument);
    setComment('');
  };
  
  const handleReject = () => {
    // Ajouter l'étape actuelle à l'historique comme rejetée
    const updatedHistory = [
      ...document.history,
      {
        stepId: currentStep.id,
        serviceId: currentStep.serviceId,
        validatedBy: "Utilisateur actuel", // Dans une vraie app, prenez l'utilisateur connecté
        date: new Date(),
        status: 'rejeté',
        comment
      }
    ];
    
    // Mettre à jour le document
    const updatedDocument = {
      ...document,
      history: updatedHistory,
      status: 'rejeté'
    };
    
    updateDocument(updatedDocument);
    setComment('');
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Validation de l'étape: {currentStep.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-medium">Document: {document.name}</p>
          <p className="text-sm text-gray-500">Service responsable: {currentService?.name || 'Service inconnu'}</p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="comment" className="font-medium">Commentaire</label>
          <Textarea 
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ajouter un commentaire (optionnel)"
            rows={3}
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={handleReject}>
            Rejeter
          </Button>
          <Button onClick={handleValidate}>
            Valider
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}