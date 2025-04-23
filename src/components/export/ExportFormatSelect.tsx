
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type ExportFormat = 'csv' | 'pdf' | 'xls' | 'xml';

interface ExportFormatSelectProps {
  value: ExportFormat;
  onValueChange: (value: ExportFormat) => void;
}

export const ExportFormatSelect = ({ value, onValueChange }: ExportFormatSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select format" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="csv">CSV</SelectItem>
        <SelectItem value="pdf">PDF</SelectItem>
        <SelectItem value="xls">XLS</SelectItem>
        <SelectItem value="xml">XML</SelectItem>
      </SelectContent>
    </Select>
  );
};
