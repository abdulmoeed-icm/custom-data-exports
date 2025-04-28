
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Edit, ArrowUp, ArrowDown } from "lucide-react";
import { type Field } from '@/data/fields';
import { Input } from "@/components/ui/input";

interface SelectedFieldsProps {
  selectedFields: Array<{
    field: Field;
    displayName: string;
  }>;
  onRemoveField: (fieldId: string) => void;
  onMoveField: (fieldId: string, direction: "up" | "down") => void;
  onRenameField: (fieldId: string, displayName: string) => void;
}

export const SelectedFields = ({
  selectedFields,
  onRemoveField,
  onMoveField,
  onRenameField,
}: SelectedFieldsProps) => {
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (fieldId: string, currentName: string) => {
    setEditingFieldId(fieldId);
    setEditValue(currentName);
  };

  const handleSave = (fieldId: string) => {
    if (editValue.trim()) {
      onRenameField(fieldId, editValue.trim());
    }
    setEditingFieldId(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selected Fields</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedFields.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No fields selected. Please select fields from the list on the left.
          </div>
        ) : (
          <div className="space-y-3">
            {selectedFields.map((item, index) => (
              <div key={item.field.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex-1">
                  {editingFieldId === item.field.id ? (
                    <div className="flex gap-2">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSave(item.field.id);
                          if (e.key === "Escape") setEditingFieldId(null);
                        }}
                        autoFocus
                        className="text-sm"
                      />
                      <Button size="sm" variant="outline" onClick={() => handleSave(item.field.id)}>
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="font-medium">
                        {item.displayName || item.field.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 ml-2"
                        onClick={() => handleEdit(item.field.id, item.displayName || item.field.name)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    disabled={index === 0}
                    onClick={() => onMoveField(item.field.id, "up")}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    disabled={index === selectedFields.length - 1}
                    onClick={() => onMoveField(item.field.id, "down")}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-red-500"
                    onClick={() => onRemoveField(item.field.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
