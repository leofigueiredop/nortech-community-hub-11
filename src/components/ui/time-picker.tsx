
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function TimePicker({ value, onChange, label }: TimePickerProps) {
  return (
    <div className="flex flex-col space-y-1.5">
      {label && <Label>{label}</Label>}
      <div className="flex items-center border rounded-md pl-2">
        <Clock className="h-4 w-4 opacity-50 mr-2" />
        <Input 
          type="time" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="border-0"
        />
      </div>
    </div>
  );
}
