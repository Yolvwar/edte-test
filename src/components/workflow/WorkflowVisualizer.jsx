import React, { useContext, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DocumentContext } from '../../contexts/DocumentContext';
import { ProcessContext } from '../../contexts/ProcessContext';
import { CheckCircle, Circle, ArrowRight, XCircle, History } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function WorkflowVisualizer({ documentId }) {
  const { documents } = useContext(DocumentContext);
  const { processes, services } = useContext(ProcessContext);
  const [showHistory, setShowHistory] = useState(false);
  
  const document = documents.find(doc => doc.id === documentId);
  
  if (!document) {
    return <div>Document non trouvé</div>;
  }
  
  const process = processes.find(proc => proc.id === document.processId);
  
  if (!process) {
    return <div>Processus non trouvé</div>;
  }
  
  // Fonction pour identifier le cycle de validation en cours
  const getCurrentCycle = () => {
    // Si pas d'historique, nous sommes au premier cycle
    if (!document.history || document.history.length === 0) {
      return 1;
    }
    
    // Compter le nombre de rejets pour déterminer le cycle actuel
    const rejections = document.history.filter(entry => entry.status === 'rejeté').length;
    
    // Le cycle actuel est le nombre de rejets + 1
    return rejections + 1;
  };
  
  // Filtrer l'historique pour n'obtenir que les entrées du cycle actuel
  const getCurrentCycleHistory = () => {
    if (!document.history || document.history.length === 0) {
      return [];
    }
    
    // Trouver l'index du dernier rejet (s'il y en a)
    const lastRejectionIndex = [...document.history].reverse().findIndex(entry => entry.status === 'rejeté');
    
    // Si aucun rejet trouvé, nous sommes toujours au premier cycle
    if (lastRejectionIndex === -1) {
      return document.history;
    }
    
    // Sinon, prendre les entrées après le dernier rejet
    const lastRejectionPosition = document.history.length - 1 - lastRejectionIndex;
    return document.history.slice(lastRejectionPosition + 1);
  };
  
  // Obtenir toutes les entrées d'historique pour toutes les tentatives précédentes
  const getPreviousCyclesHistory = () => {
    if (!document.history || document.history.length === 0) {
      return [];
    }
    
    // Trouver l'index du dernier rejet (s'il y en a)
    const lastRejectionIndex = [...document.history].reverse().findIndex(entry => entry.status === 'rejeté');
    
    // Si aucun rejet trouvé, pas d'historique précédent
    if (lastRejectionIndex === -1) {
      return [];
    }
    
    // Sinon, prendre les entrées jusqu'au dernier rejet (inclus)
    const lastRejectionPosition = document.history.length - 1 - lastRejectionIndex;
    return document.history.slice(0, lastRejectionPosition + 1);
  };
  
  const getStepStatus = (stepId, useCurrentCycleOnly = true) => {
    // Utiliser soit l'historique complet, soit seulement celui du cycle actuel
    const historyToUse = useCurrentCycleOnly ? getCurrentCycleHistory() : document.history;
    
    // Récupérer toutes les entrées d'historique pour cette étape
    const historyEntries = historyToUse.filter(h => h.stepId === stepId);
    
    // Pas d'historique pour cette étape
    if (historyEntries.length === 0) {
      // Si c'est l'étape courante
      if (document.currentStepId === stepId) {
        return { status: 'current', lastAction: null };
      }
      // Sinon, l'étape est en attente
      return { status: 'pending', lastAction: null };
    }
    
    // Prendre la dernière entrée d'historique pour cette étape
    const lastEntry = historyEntries[historyEntries.length - 1];
    
    // Si la dernière action était une validation
    if (lastEntry.status === 'validé') {
      return { status: 'validated', lastAction: lastEntry };
    }
    
    // Si la dernière action était un rejet et que c'est l'étape courante
    if (lastEntry.status === 'rejeté' && document.currentStepId === stepId) {
      return { status: 'current', lastAction: lastEntry };
    }
    
    // Si la dernière action était un rejet mais ce n'est pas l'étape courante
    if (lastEntry.status === 'rejeté') {
      return { status: 'rejected', lastAction: lastEntry };
    }
    
    // Par défaut, en attente
    return { status: 'pending', lastAction: null };
  };
  
  const getServiceNameById = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Service inconnu';
  };
  
  // Grouper l'historique par cycle de validation pour l'affichage détaillé
  const groupHistoryByCycles = () => {
    const cycles = [];
    let currentCycle = [];
    
    // Si l'historique est vide, retourner un tableau vide
    if (!document.history || document.history.length === 0) {
      return [];
    }
    
    document.history.forEach((entry, index) => {
      // Ajouter l'entrée au cycle courant
      currentCycle.push(entry);
      
      // Si l'entrée est un rejet ou c'est la dernière entrée, fermer le cycle
      if (entry.status === 'rejeté' || index === document.history.length - 1) {
        cycles.push([...currentCycle]);
        
        // Si c'est un rejet, réinitialiser le cycle courant
        if (entry.status === 'rejeté') {
          currentCycle = [];
        }
      }
    });
    
    return cycles;
  };
  
  const currentCycle = getCurrentCycle();
  const hasPreviousCycles = currentCycle > 1;
  const cycles = groupHistoryByCycles();
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Progression du document</CardTitle>
          <CardDescription>
            Cycle de validation #{currentCycle}
            {hasPreviousCycles && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2" 
                onClick={() => setShowHistory(!showHistory)}
              >
                <History className="h-4 w-4 mr-1" />
                {showHistory ? 'Masquer l\'historique' : 'Afficher l\'historique'}
              </Button>
            )}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {/* Affichage du cycle actuel */}
        <div className="flex items-center justify-between mb-4">
          {process.steps.map((step, index) => {
            const stepStatus = getStepStatus(step.id, true); // N'utiliser que le cycle actuel
            
            return (
              <React.Fragment key={step.id}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center text-center w-32">
                        {stepStatus.status === 'validated' ? (
                          <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                        ) : stepStatus.status === 'rejected' ? (
                          <XCircle className="h-8 w-8 text-red-500 mb-2" />
                        ) : stepStatus.status === 'current' ? (
                          <Circle className="h-8 w-8 text-blue-500 mb-2 fill-blue-100" />
                        ) : (
                          <Circle className="h-8 w-8 text-gray-300 mb-2" />
                        )}
                        <span className="font-medium">{step.name}</span>
                        <span className="text-xs text-gray-500">{getServiceNameById(step.serviceId)}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {stepStatus.lastAction ? (
                        <div className="text-sm">
                          <p>{stepStatus.status === 'validated' ? 'Validé' : 'Rejeté'} par: {stepStatus.lastAction.validatedBy}</p>
                          {stepStatus.lastAction.comment && (
                            <p className="text-xs italic mt-1">"{stepStatus.lastAction.comment}"</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm">{stepStatus.status === 'current' ? 'En attente de validation' : 'Étape à venir'}</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {index < process.steps.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                )}
              </React.Fragment>
            );
          })}
        </div>
        
        {/* Affichage des cycles précédents si demandé */}
        {showHistory && hasPreviousCycles && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-medium text-sm mb-4">Historique des cycles précédents</h3>
            
            {cycles.slice(0, -1).map((cycle, cycleIndex) => (
              <div key={cycleIndex} className="mb-6">
                <h4 className="font-medium text-xs text-gray-600 mb-2">
                  Cycle #{cycleIndex + 1}
                  {cycle[cycle.length - 1].status === 'rejeté' && (
                    <span className="text-red-500 ml-2">(Rejeté)</span>
                  )}
                </h4>
                
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  {process.steps.map((step, stepIndex) => {
                    // Trouver l'entrée correspondante dans ce cycle
                    const cycleEntry = cycle.find(entry => entry.stepId === step.id);
                    const status = cycleEntry 
                      ? cycleEntry.status === 'validé' ? 'validated' : 'rejected'
                      : 'pending';
                    
                    return (
                      <React.Fragment key={`${cycleIndex}-${step.id}`}>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex flex-col items-center text-center w-24">
                                {status === 'validated' ? (
                                  <CheckCircle className="h-6 w-6 text-green-500 mb-1" />
                                ) : status === 'rejected' ? (
                                  <XCircle className="h-6 w-6 text-red-500 mb-1" />
                                ) : (
                                  <Circle className="h-6 w-6 text-gray-300 mb-1" />
                                )}
                                <span className="text-xs font-medium">{step.name}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              {cycleEntry ? (
                                <div className="text-sm">
                                  <p>{cycleEntry.status === 'validé' ? 'Validé' : 'Rejeté'} par: {cycleEntry.validatedBy}</p>
                                  <p className="text-xs">Le {format(new Date(cycleEntry.date), 'dd/MM/yyyy')}</p>
                                  {cycleEntry.comment && (
                                    <p className="text-xs italic mt-1">"{cycleEntry.comment}"</p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm">Étape non atteinte</p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        {stepIndex < process.steps.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}