import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { SubjectArea, subjectAreas } from '@/data/events';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface SubjectTagInputProps {
  selectedSubjects: SubjectArea[];
  onChange: (subjects: SubjectArea[]) => void;
  error?: string;
}

const SubjectTagInput = ({ selectedSubjects, onChange, error }: SubjectTagInputProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSubject = (subject: SubjectArea) => {
    if (selectedSubjects.includes(subject)) {
      onChange(selectedSubjects.filter(s => s !== subject));
    } else {
      onChange([...selectedSubjects, subject]);
    }
  };

  const removeSubject = (subject: SubjectArea) => {
    onChange(selectedSubjects.filter(s => s !== subject));
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
              {selectedSubjects.length === 0 
                ? 'Select one or more subjects' 
                : `${selectedSubjects.length} subject${selectedSubjects.length > 1 ? 's' : ''} selected`}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-2 bg-card" align="start">
          <div className="grid grid-cols-2 gap-2">
            {subjectAreas.map((subject) => (
              <button
                key={subject}
                type="button"
                onClick={() => toggleSubject(subject)}
                className={`px-3 py-2 text-sm rounded-md text-left transition-colors ${
                  selectedSubjects.includes(subject)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected Tags */}
      {selectedSubjects.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedSubjects.map((subject) => (
            <span
              key={subject}
              className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-primary/10 text-primary rounded-full"
            >
              {subject}
              <button
                type="button"
                onClick={() => removeSubject(subject)}
                className="hover:bg-primary/20 rounded-full p-0.5"
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

export default SubjectTagInput;
