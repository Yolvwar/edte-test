import React, { useState, useContext } from 'react';
import { ProcessContext } from '../../contexts/ProcessContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Copy, Edit, ChevronDown, ChevronUp, Calendar, User, FileText, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import ProcessBuilder from './ProcessBuilder';

export default function ProcessList() {
  const { processes, addProcess, deleteProcess, services } = useContext(ProcessContext);
  const [editingProcess, setEditingProcess] = useState(null);
  const [expandedProcess, setExpandedProcess] = useState(null);
  
  const handleDuplicate = (process) => {
    const newProcess = {
      ...process,
      id: undefined,
      name: `${process.name} (copie)`,
      createdAt: new Date().toISOString(),
      steps: process.steps.map(step => ({
        ...step,
        id: `step-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      }))
    };
    
    addProcess(newProcess);
  };
  
  const handleEdit = (process) => {
    setEditingProcess(process);
  };
  
  const cancelEdit = () => {
    setEditingProcess(null);
  };
  
  const getServiceName = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Service non spécifié';
  };

  const toggleExpand = (processId) => {
    if (expandedProcess === processId) {
      setExpandedProcess(null);
    } else {
      setExpandedProcess(processId);
    }
  };
  
  // Rendu du schéma du workflow
  const renderWorkflowDiagram = (steps) => {
    return (
      <div className="mt-4 overflow-x-auto pb-2">
        <div className="flex items-center space-x-1 min-w-max">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Boîte de l'étape */}
              <div 
                className={`flex flex-col items-center p-2 min-w-24 rounded-md border 
                  ${step.isRequired ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
              >
                <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-500 flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                <div className="text-xs font-medium mt-1 text-center">{step.name}</div>
                <div className="text-xs text-gray-500 mt-0.5 text-center truncate max-w-24">
                  {getServiceName(step.serviceId)}
                </div>
                {!step.isRequired && (
                  <Badge variant="outline" className="mt-1 text-xs">
                    Optionnel
                  </Badge>
                )}
              </div>
              
              {/* Flèche de connexion (sauf pour la dernière étape) */}
              {index < steps.length - 1 && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-0.5 bg-blue-400"></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };
  
  // Si nous sommes en mode édition, afficher le formulaire d'édition
  if (editingProcess) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Modifier le processus</h2>
        <ProcessBuilder editProcess={editingProcess} onCancel={cancelEdit} />
      </div>
    );
  }
  
  const getStatusIndicator = (process) => {
    // Vérifier si toutes les étapes ont un service assigné
    const hasIncompleteSteps = process.steps.some(step => !step.serviceId);
    const totalSteps = process.steps.length;
    
    if (hasIncompleteSteps) {
      return (
        <div className="flex items-center text-amber-500 text-xs">
          <XCircle size={14} className="mr-1" />
          Configuration incomplète
        </div>
      );
    } else if (totalSteps === 0) {
      return (
        <div className="flex items-center text-red-500 text-xs">
          <XCircle size={14} className="mr-1" />
          Aucune étape définie
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-green-500 text-xs">
          <CheckCircle size={14} className="mr-1" />
          Prêt à l'emploi
        </div>
      );
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Processus disponibles</h2>
      
      {processes.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          Aucun processus disponible. Créez votre premier processus !
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {processes.map(process => (
            <Card key={process.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl flex items-center">
                      {process.name}
                      <Badge variant="outline" className="ml-2">
                        {process.steps.length} étapes
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {getServiceName(process.serviceId)}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end">
                    {getStatusIndicator(process)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {/* Informations principales */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>
                        Créé le {process.createdAt ? format(new Date(process.createdAt), 'dd MMMM yyyy', { locale: fr }) : 'Date inconnue'}
                      </span>
                    </div>
                    
                    {process.createdBy && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User size={16} />
                        <span>Par {process.createdBy}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FileText size={16} />
                      <span>{process.description || 'Aucune description'}</span>
                    </div>
                  </div>
                  
                  {/* Schéma du workflow */}
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Schéma du processus</h3>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {renderWorkflowDiagram(process.steps)}
                    </div>
                  </div>
                  
                  {/* Détails des étapes (collapsible) */}
                  <Collapsible 
                    open={expandedProcess === process.id} 
                    onOpenChange={() => toggleExpand(process.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-between mt-2">
                        <span>Détails des étapes</span>
                        {expandedProcess === process.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2">
                      <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                        {process.steps.map((step, index) => {
                          const serviceName = getServiceName(step.serviceId);
                          
                          return (
                            <div key={step.id} className="flex items-start p-2 bg-white rounded-md border border-gray-200">
                              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 font-medium text-xs mr-3">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">{step.name}</h4>
                                  {!step.isRequired && (
                                    <Badge variant="outline" className="ml-2">
                                      Optionnelle
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  {serviceName}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </CardContent>
              
              <CardFooter className="bg-gray-50 px-6 py-3">
                <div className="flex justify-end space-x-2 w-full">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(process)}
                  >
                    <Edit size={14} className="mr-1" /> Modifier
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDuplicate(process)}
                  >
                    <Copy size={14} className="mr-1" /> Dupliquer
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-500" 
                    onClick={() => deleteProcess(process.id)}
                  >
                    <Trash2 size={14} className="mr-1" /> Supprimer
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}