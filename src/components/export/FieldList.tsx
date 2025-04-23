
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tables } from "@/integrations/supabase/types";

type EntityField = Tables<'entity_fields'>

interface FieldListProps {
  fields: EntityField[];
  onFieldSelect: (field: EntityField, checked: boolean) => void;
}

export const FieldList = ({ fields, onFieldSelect }: FieldListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredFields = fields.filter(field => 
    field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search fields..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />
      <div className="space-y-2">
        {filteredFields.map((field) => (
          <div key={field.id} className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              onCheckedChange={(checked) => onFieldSelect(field, checked === true)}
            />
            <Label htmlFor={field.id} className="cursor-pointer">
              {field.label} ({field.name})
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
