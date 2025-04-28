import React, { useContext } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DocumentContext } from '../../contexts/DocumentContext';
import { ProcessContext } from '../../contexts/ProcessContext';
import WorkflowVisualizer from '../workflow/WorkflowVisualizer';
import StepValidation from '../workflow/StepValidation';

export default function DocumentDetail({ documentId }) {
  const { documents } = useContext(DocumentContext);
  const { processes, services } = useContext(ProcessContext);
  
  const document = documents.find(doc => doc.id === documentId);
  
  if (!document) {
    return <div>Document non trouvé</div>;
  }
  
  const process = processes.find(proc => proc.id === document.processId);
  
  const getServiceName = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Service inconnu';
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{document.name}</span>
            <Badge>{document.status}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Informations générales</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Date début</dt>
                  <dd>{format(new Date(document.startDate), 'dd MMMM yyyy', { locale: fr })}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Date fin</dt>
                  <dd>{format(new Date(document.endDate), 'dd MMMM yyyy', { locale: fr })}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Fichier</dt>
                  <dd>
                    {document.file ? (
                      document.file.name || 'Document.pdf'
                    ) : (
                      'Aucun fichier'
                    )}
                  </dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Processus de validation</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Nom du processus</dt>
                  <dd>{process ? process.name : 'Processus inconnu'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Étapes totales</dt>
                  <dd>{process ? process.steps.length : '0'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Étapes validées</dt>
                  <dd>{document.history ? document.history.length : '0'}</dd>
                </div>
              </dl>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold mb-4">Progression</h3>
            <WorkflowVisualizer documentId={document.id} />
          </div>
          
          {document.status === 'en cours' && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-4">Action requise</h3>
                <StepValidation documentId={document.id} />
              </div>
            </>
          )}
          
          {document.history && document.history.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-4">Historique de validation</h3>
                <div className="space-y-4">
                  {document.history.map((entry, index) => {
                    const step = process?.steps.find(s => s.id === entry.stepId);
                    
                    return (
                      <div key={index} className="flex items-start gap-4 py-2">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${entry.status === 'validé' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {entry.status === 'validé' ? '✓' : '✗'}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{step?.name || 'Étape inconnue'}</h4>
                            <span className="text-sm text-gray-500">
                              {format(new Date(entry.date), 'dd/MM/yyyy HH:mm')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Service: {getServiceName(entry.serviceId)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Validé par: {entry.validatedBy}
                          </p>
                          {entry.comment && (
                            <p className="mt-2 text-sm bg-gray-50 p-2 rounded">
                              {entry.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}