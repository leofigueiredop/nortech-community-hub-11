import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface FrequencySettingsProps {
  frequency: string;
  onFrequencyChange: (value: string) => void;
}

const frequencyOptions = [
  { 
    value: 'realtime', 
    label: 'Tempo real', 
    description: 'Receba notificações assim que acontecerem'
  },
  { 
    value: 'daily', 
    label: 'Resumo diário', 
    description: 'Receba um resumo uma vez por dia'
  },
  { 
    value: 'weekly', 
    label: 'Resumo semanal', 
    description: 'Receba um resumo uma vez por semana'
  }
];

export const FrequencySettings: React.FC<FrequencySettingsProps> = ({ frequency, onFrequencyChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold">Frequência de notificações</Label>
        <p className="text-muted-foreground text-sm mb-4">Escolha com que frequência você recebe notificações</p>
      </div>

      <RadioGroup 
        value={frequency} 
        onValueChange={onFrequencyChange} 
        className="space-y-4"
      >
        {frequencyOptions.map((item) => (
          <div key={item.value} className="flex items-center space-x-2">
            <RadioGroupItem value={item.value} id={item.value} />
            <Label htmlFor={item.value}>
              <span className="font-semibold">{item.label}</span>
              <p className="text-muted-foreground text-sm">{item.description}</p>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
