import React, { useContext } from 'react';
import { ProcessContext } from '../../contexts/ProcessContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Copy } from 'lucide-react';

export default function ProcessList() {
  const { processes, addProcess, deleteProcess } = useContext(ProcessContext);
  
  const handleDuplicate = (process) => {
    const newProcess = {
      ...process,
      id: undefined, // Supprimez l'ID pour qu'un nouveau soit généré lors de l'ajout
      name: `${process.name} (copie)`,
      steps: process.steps.map(step => ({
        ...step,
        id: `step-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` // Générez de nouveaux IDs pour les étapes
      }))
    };
    
    addProcess(newProcess);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Processus disponibles</h2>
      
      {processes.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          Aucun processus disponible. Créez votre premier processus !
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processes.map(process => (
            <Card key={process.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-lg">{process.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{process.description || 'Aucune description'}</p>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Étapes ({process.steps.length})</h4>
                    <ul className="space-y-1 text-sm">
                      {process.steps.map((step, index) => (
                        <li key={step.id} className="flex items-center">
                          <span className="bg-gray-100 text-gray-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">
                            {index + 1}
                          </span>
                          {step.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-2">
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}