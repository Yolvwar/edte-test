import React, { useState, useContext } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ProcessContext } from '../../contexts/ProcessContext';
import StepConfig from './StepConfig';

export default function ProcessBuilder() {
  const { addProcess } = useContext(ProcessContext);
  
  const [process, setProcess] = useState({
    name: '',
    description: '',
    steps: []
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
    addProcess(process);
    // Réinitialiser le formulaire
    setProcess({
      name: '',
      description: '',
      steps: []
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Créer un nouveau processus</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={process.description} 
              onChange={handleInputChange} 
              rows={3} 
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
          
          <Button type="submit" className="w-full">
            Enregistrer le processus
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}