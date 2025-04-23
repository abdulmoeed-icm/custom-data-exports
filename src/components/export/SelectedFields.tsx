
import React, { useState } from 'react';
import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tables } from "@/integrations/supabase/types";

type EntityField = Tables<'entity_fields'> & { displayLabel?: string };

interface SelectedFieldsProps {
  fields: EntityField[];
  onLabelChange: (fieldId: string, newLabel: string) => void;
}

export const SelectedFields = ({ fields, onLabelChange }: SelectedFieldsProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEditStart = (field: EntityField) => {
    setEditingId(field.id);
    setEditValue(field.displayLabel || field.label);
  };

  const handleEditComplete = (fieldId: string) => {
    if (editValue.trim()) {
      onLabelChange(fieldId, editValue.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-2">
      {fields.map((field) => (
        <div key={field.id} className="flex items-center justify-between p-2 bg-background border rounded-md">
          {editingId === field.id ? (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => handleEditComplete(field.id)}
              onKeyDown={(e) => e.key === 'Enter' && handleEditComplete(field.id)}
              autoFocus
              className="w-full"
            />
          ) : (
            <div className="flex items-center justify-between w-full">
              <span>{field.displayLabel || field.label} ({field.name})</span>
              <button
                onClick={() => handleEditStart(field)}
                className="p-1 hover:bg-accent rounded-md"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
