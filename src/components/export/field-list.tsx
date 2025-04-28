
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { type Field } from '@/data/fields';
import { Search } from 'lucide-react';

interface FieldListProps {
  fields: Field[];
  selectedFields: string[];
  onSelectField: (fieldId: string, isChecked: boolean) => void;
  onKeyDown?: (event: React.KeyboardEvent, fieldId: string) => void;
}

export const FieldList = ({ 
  fields, 
  selectedFields, 
  onSelectField,
  onKeyDown
}: FieldListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredFields = fields.filter(field => 
    field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search fields..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="max-h-[500px] overflow-y-auto pr-2">
        <div className="space-y-3">
          {filteredFields.length > 0 ? (
            filteredFields.map((field) => (
              <div 
                key={field.id} 
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent/20 transition-colors"
                tabIndex={0}
                onKeyDown={(e) => onKeyDown?.(e, field.id)}
              >
                <Checkbox 
                  id={`field-${field.id}`} 
                  checked={selectedFields.includes(field.id)}
                  onCheckedChange={(checked) => {
                    onSelectField(field.id, checked === true);
                  }}
                />
                <label
                  htmlFor={`field-${field.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                >
                  <div>{field.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{field.description}</div>
                </label>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No matching fields found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
