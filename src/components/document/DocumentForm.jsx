import React, { useState, useContext } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentContext } from '../../contexts/DocumentContext';
import { ProcessContext } from '../../contexts/ProcessContext';

export default function DocumentForm() {
  const { addDocument } = useContext(DocumentContext);
  const { processes } = useContext(ProcessContext);
  
  const [document, setDocument] = useState({
    name: '',
    file: null,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    processId: '',
    status: 'brouillon',
    currentStepId: null,
    history: []
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDocument({ ...document, [name]: value });
  };
  
  const handleFileChange = (e) => {
    setDocument({ ...document, file: e.target.files[0] });
  };
  
  const handleStartDateChange = (date) => {
    setDocument({ ...document, startDate: date });
  };
  
  const handleEndDateChange = (date) => {
    setDocument({ ...document, endDate: date });
  };
  
  const handleProcessChange = (value) => {
    const selectedProcess = processes.find(p => p.id === value);
    setDocument({ 
      ...document, 
      processId: value,
      currentStepId: selectedProcess?.steps[0]?.id || null
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    addDocument(document);
    // Réinitialiser le formulaire
    setDocument({
      name: '',
      file: null,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      processId: '',
      status: 'brouillon',
      currentStepId: null,
      history: []
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Créer un nouveau document (DTE)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du document</Label>
            <Input 
              id="name" 
              name="name" 
              value={document.name} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">Fichier</Label>
            <Input 
              id="file" 
              name="file" 
              type="file" 
              onChange={handleFileChange} 
              required 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de début</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    {format(document.startDate, 'dd/MM/yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={document.startDate}
                    onSelect={handleStartDateChange}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Date de fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    {format(document.endDate, 'dd/MM/yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={document.endDate}
                    onSelect={handleEndDateChange}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="processId">Processus de validation</Label>
            <Select 
              value={document.processId} 
              onValueChange={handleProcessChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un processus" />
              </SelectTrigger>
              <SelectContent>
                {processes.map(process => (
                  <SelectItem key={process.id} value={process.id}>
                    {process.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="w-full">Créer le document</Button>
        </form>
      </CardContent>
    </Card>
  );
}