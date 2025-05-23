
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type Field } from '@/data/fields';
import { format } from 'date-fns';

interface PreviewTableProps {
  fields: Array<{
    field: Field;
    displayName: string;
    entityId?: string; // Added entityId for multi-entity support
  }>;
  data: Array<Record<string, any>>;
}

export const PreviewTable = ({ fields, data }: PreviewTableProps) => {
  if (!data.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No data available for preview
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {fields.map((field) => (
              <TableHead key={`${field.entityId || ''}-${field.field.id}`}>
                {field.displayName || field.field.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              {fields.map((field) => {
                // Check if the field has a fieldKey which contains the entity prefix
                const valueKey = field.field.id;
                return (
                  <TableCell key={`${field.entityId || ''}-${field.field.id}`}>
                    {formatValue(row[valueKey], field.field.type)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Helper function to format values based on their type
const formatValue = (value: any, type: string): string => {
  if (value === undefined || value === null) return '';
  
  switch (type) {
    case 'datetime':
      try {
        const date = new Date(value);
        return format(date, 'MMM d, yyyy h:mm a');
      } catch (e) {
        return String(value);
      }
    case 'date':
      try {
        const date = new Date(value);
        return format(date, 'MMM d, yyyy');
      } catch (e) {
        return String(value);
      }
    case 'boolean':
      return value ? 'Yes' : 'No';
    default:
      return String(value);
  }
};
