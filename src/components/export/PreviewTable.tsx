
import React from 'react';
import { Tables } from "@/integrations/supabase/types";

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
                  {row[field.name]?.toString() || ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
