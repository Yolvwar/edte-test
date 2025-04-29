import React, { useState, useEffect, useContext } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProcessContext } from '../../contexts/ProcessContext';
import StepConfig from './StepConfig';

export default function ProcessBuilder({ editProcess = null, onCancel = null }) {
  const { addProcess, updateProcess, services } = useContext(ProcessContext);
  
  // État initial - sera rempli avec les données du processus en cours d'édition si disponible
  const [process, setProcess] = useState({
    name: '',
    description: '',
    serviceId: '', // Service responsable du processus
    createdBy: '', // Créateur du processus
    createdAt: new Date().toISOString(),
    steps: []
  });
  
  // Si un processus est passé pour édition, charger ses données
  useEffect(() => {
    if (editProcess) {
      setProcess(editProcess);
    }
  }, [editProcess]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProcess({ ...process, [name]: value });
  };
  
  const handleSelectChange = (name, value) => {
    setProcess({ ...process, [name]: value });
  };
  
  const addStep = () => {
    const newStep = {
      id: `step-${Date.now()}`,
      name: `Étape ${process.steps.length + 1}`,
      serviceId: '',
      order: process.steps.length + 1,
      isRequired: true
    };
    
    setProcess({
      ...process,
      steps: [...process.steps, newStep]
    });
  };
  
  const updateStep = (updatedStep) => {
    setProcess({
      ...process,
      steps: process.steps.map(step => 
        step.id === updatedStep.id ? updatedStep : step
      )
    });
  };
  
  const removeStep = (stepId) => {
    setProcess({
      ...process,
      steps: process.steps
        .filter(step => step.id !== stepId)
        .map((step, index) => ({
          ...step,
          order: index + 1
        }))
    });
  };
  
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(process.steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    const reorderedSteps = items.map((step, index) => ({
      ...step,
      order: index + 1
    }));
    
    setProcess({
      ...process,
      steps: reorderedSteps
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Préparer les données du processus
    const processData = {
      ...process,
      // Si le créateur n'est pas défini, utiliser une valeur par défaut
      createdBy: process.createdBy || "Utilisateur actuel", // Dans une vraie app, utilisez l'utilisateur connecté
      // Si c'est une création, mettre à jour la date, sinon garder la date originale
      createdAt: editProcess ? process.createdAt : new Date().toISOString()
    };
    
    if (editProcess) {
      // Mise à jour d'un processus existant
      updateProcess(processData);
    } else {
      // Création d'un nouveau processus
      addProcess(processData);
    }
    
    // Réinitialiser le formulaire si on ne quitte pas en mode édition
    if (!editProcess) {
      setProcess({
        name: '',
        description: '',
        serviceId: '',
        createdBy: '',
        createdAt: new Date().toISOString(),
        steps: []
      });
    } else if (onCancel) {
      // Si on était en mode édition et qu'une fonction onCancel est fournie, l'appeler
      onCancel();
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{editProcess ? 'Modifier le processus' : 'Créer un nouveau processus'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du processus</Label>
              <Input 
                id="name" 
                name="name" 
                value={process.name} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="serviceId">Service responsable</Label>
              <Select 
                value={process.serviceId} 
                onValueChange={(value) => handleSelectChange('serviceId', value)}
              >
                <SelectTrigger id="serviceId">
                  <SelectValue placeholder="Sélectionner un service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={process.description} 
              onChange={handleInputChange} 
              rows={3} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="createdBy">Créé par</Label>
            <Input 
              id="createdBy" 
              name="createdBy" 
              value={process.createdBy} 
              onChange={handleInputChange} 
              placeholder="Nom du créateur"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Étapes du processus</h3>
              <Button type="button" onClick={addStep} variant="outline">
                Ajouter une étape
              </Button>
            </div>
            
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="steps">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {process.steps.map((step, index) => (
                      <Draggable key={step.id} draggableId={step.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <StepConfig 
                              step={step} 
                              updateStep={updateStep} 
                              removeStep={() => removeStep(step.id)} 
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          
          <div className="flex justify-end space-x-3">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            )}
            <Button type="submit">
              {editProcess ? 'Mettre à jour' : 'Enregistrer le processus'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}