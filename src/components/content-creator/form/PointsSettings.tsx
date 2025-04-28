
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

interface PointsSettingsProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  value: number;
  setValue: (value: number) => void;
}

const PointsSettings: React.FC<PointsSettingsProps> = ({
  enabled,
  setEnabled,
  value,
  setValue
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="points-enabled">Enable Points</Label>
          <p className="text-sm text-muted-foreground">
            Award points to users when they complete this content
          </p>
        </div>
        <Switch 
          id="points-enabled" 
          checked={enabled}
          onCheckedChange={setEnabled}
        />
      </div>
      
      {enabled && (
        <div className="space-y-2">
          <Label htmlFor="points-value">Points Value</Label>
          <Input
            id="points-value"
            type="number"
            min={0}
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value) || 0)}
            placeholder="Enter points value"
          />
          <p className="text-xs text-muted-foreground">
            Users will receive this many points when they complete the content
          </p>
        </div>
      )}
    </div>
  );
};

export default PointsSettings;
