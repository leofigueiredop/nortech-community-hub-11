
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  containerClassName?: string;
}

export function TimePicker({ 
  value, 
  onChange, 
  label, 
  className,
  containerClassName
}: TimePickerProps) {
  return (
    <div className={cn("flex flex-col space-y-1.5", containerClassName)}>
      {label && <Label>{label}</Label>}
      <div className={cn("flex items-center border rounded-md pl-2", className)}>
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
