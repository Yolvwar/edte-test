import React, { useContext } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { GripVertical, X } from 'lucide-react';
import { ProcessContext } from '../../contexts/ProcessContext';

export default function StepConfig({ step, updateStep, removeStep }) {
  const { services } = useContext(ProcessContext);
  
  const handleNameChange = (e) => {
    updateStep({
      ...step,
      name: e.target.value
    });
  };
  
  const handleServiceChange = (value) => {
    updateStep({
      ...step,
      serviceId: value
    });
  };
  
  const handleRequiredChange = (checked) => {
    updateStep({
      ...step,
      isRequired: checked
    });
  };
  
  return (
    <Card className="relative border border-gray-200">
      <div className="absolute left-2 top-3 text-gray-400">
        <GripVertical size={20} />
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-2 top-2" 
        onClick={removeStep}
      >
        <X size={16} />
      </Button>
      <CardContent className="pt-6 pl-10">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`step-name-${step.id}`}>Nom de l'étape</Label>
            <Input 
              id={`step-name-${step.id}`} 
              value={step.name} 
              onChange={handleNameChange} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`step-service-${step.id}`}>Service</Label>
            <Select 
              value={step.serviceId} 
              onValueChange={handleServiceChange}
            >
              <SelectTrigger id={`step-service-${step.id}`}>
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
          
          <div className="flex items-center justify-end space-x-2 pt-6">
            <Label htmlFor={`step-required-${step.id}`}>Obligatoire</Label>
            <Switch 
              id={`step-required-${step.id}`} 
              checked={step.isRequired} 
              onCheckedChange={handleRequiredChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}