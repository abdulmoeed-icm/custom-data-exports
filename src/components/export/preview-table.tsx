
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type Field } from '@/data/fields';

interface PreviewTableProps {
  fields: Array<{
    field: Field;
    displayName: string;
  }>;
  data: Array<Record<string, any>>;
}

export const PreviewTable = ({ fields, data }: PreviewTableProps) => {
  if (fields.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded">
        Select at least one field to preview data
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded">
        No data available for preview
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {fields.map((item) => (
              <TableHead key={item.field.id}>{item.displayName || item.field.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              {fields.map((item) => (
                <TableCell key={item.field.id}>
                  {formatCellValue(row[item.field.name], item.field.type)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

function formatCellValue(value: any, type: string): React.ReactNode {
  if (value === undefined || value === null) {
    return <span className="text-gray-400">—</span>;
  }

  switch (type) {
    case 'date':
      return new Date(value).toLocaleDateString();
    case 'boolean':
      return value ? 'Yes' : 'No';
    case 'object':
      return <span className="text-gray-600">{JSON.stringify(value)}</span>;
    default:
      return String(value);
  }
}
