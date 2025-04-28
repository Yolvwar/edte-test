import React, { useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DocumentContext } from '../../contexts/DocumentContext';
import { ProcessContext } from '../../contexts/ProcessContext';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';

export default function WorkflowVisualizer({ documentId }) {
  const { documents } = useContext(DocumentContext);
  const { processes, services } = useContext(ProcessContext);
  
  const document = documents.find(doc => doc.id === documentId);
  
  if (!document) {
    return <div>Document non trouvé</div>;
  }
  
  const process = processes.find(proc => proc.id === document.processId);
  
  if (!process) {
    return <div>Processus non trouvé</div>;
  }
  
  const getStepStatus = (stepId) => {
    // Si l'étape est dans l'historique, elle est validée
    const historyEntry = document.history.find(h => h.stepId === stepId);
    if (historyEntry) {
      return 'validated';
    }
    
    // Si c'est l'étape courante
    if (document.currentStepId === stepId) {
      return 'current';
    }
    
    // Sinon, l'étape est en attente
    return 'pending';
  };
  
  const getServiceNameById = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Service inconnu';
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Progression du document: {document.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {process.steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center text-center w-32">
                {getStepStatus(step.id) === 'validated' ? (
                  <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                ) : getStepStatus(step.id) === 'current' ? (
                  <Circle className="h-8 w-8 text-blue-500 mb-2 fill-blue-100" />
                ) : (
                  <Circle className="h-8 w-8 text-gray-300 mb-2" />
                )}
                <span className="font-medium">{step.name}</span>
                <span className="text-xs text-gray-500">{getServiceNameById(step.serviceId)}</span>
              </div>
              
              {index < process.steps.length - 1 && (
                <ArrowRight className="h-5 w-5 text-gray-400" />
              )}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}