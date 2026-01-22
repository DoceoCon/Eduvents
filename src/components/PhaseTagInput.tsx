import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { EventPhase, eventPhases } from '@/data/events';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface PhaseTagInputProps {
  selectedPhases: EventPhase[];
  onChange: (phases: EventPhase[]) => void;
  error?: string;
}

const PhaseTagInput = ({ selectedPhases, onChange, error }: PhaseTagInputProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePhase = (phase: EventPhase) => {
    if (selectedPhases.includes(phase)) {
      onChange(selectedPhases.filter(p => p !== phase));
    } else {
      onChange([...selectedPhases, phase]);
    }
  };

  const removePhase = (phase: EventPhase) => {
    onChange(selectedPhases.filter(p => p !== phase));
  };

  return (
    <div className="space-y-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className={`w-full justify-between h-auto min-h-10 ${error ? 'border-destructive' : ''}`}
          >
            <span className="text-muted-foreground">
              {selectedPhases.length === 0 
                ? 'Select one or more phases (optional)' 
                : `${selectedPhases.length} phase${selectedPhases.length > 1 ? 's' : ''} selected`}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-2 bg-card" align="start">
          <div className="grid grid-cols-2 gap-2">
            {eventPhases.map((phase) => (
              <button
                key={phase}
                type="button"
                onClick={() => togglePhase(phase)}
                className={`px-3 py-2 text-sm rounded-md text-left transition-colors ${
                  selectedPhases.includes(phase)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
              >
                {phase}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected Tags */}
      {selectedPhases.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedPhases.map((phase) => (
            <span
              key={phase}
              className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-secondary/50 text-secondary-foreground rounded-full"
            >
              {phase}
              <button
                type="button"
                onClick={() => removePhase(phase)}
                className="hover:bg-secondary rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhaseTagInput;
