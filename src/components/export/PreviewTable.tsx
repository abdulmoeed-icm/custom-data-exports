
import React from 'react';
import { Tables } from "@/integrations/supabase/types";
import { format } from 'date-fns';

type EntityField = Tables<'entity_fields'> & { displayLabel?: string };

interface PreviewTableProps {
  data: any[];
  fields: EntityField[];
}

export const PreviewTable = ({ data, fields }: PreviewTableProps) => {
  if (!data.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No data available for preview
      </div>
    );
  }

  const formatCellValue = (value: any): string => {
    if (value === undefined || value === null) return '';
    
    // Check if the value is a date string
    if (typeof value === 'string' && (
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*$/.test(value) || // ISO datetime
      /^\d{4}-\d{2}-\d{2}$/.test(value) // ISO date
    )) {
      try {
        const date = new Date(value);
        // Check if it has time components
        if (value.includes('T')) {
          return format(date, 'MMM d, yyyy h:mm a');
        } else {
          return format(date, 'MMM d, yyyy');
        }
      } catch (e) {
        return value.toString();
      }
    }
    
    // Handle boolean values
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    return value.toString();
  };

  return (
    <div className="border rounded-md overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            {fields.map((field) => (
              <th key={field.id} className="px-4 py-2 text-left font-medium">
                {field.displayLabel || field.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t">
              {fields.map((field) => (
                <td key={field.id} className="px-4 py-2">
                  {formatCellValue(row[field.name])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
