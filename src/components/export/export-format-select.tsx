
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, FileSpreadsheet, FileX, FileJson } from "lucide-react";

export type ExportFormat = "csv" | "xlsx" | "pdf" | "json";

interface ExportFormatSelectProps {
  value: ExportFormat;
  onValueChange: (value: ExportFormat) => void;
}

export const ExportFormatSelect = ({
  value,
  onValueChange,
}: ExportFormatSelectProps) => {
  return (
    <Select value={value} onValueChange={(val) => onValueChange(val as ExportFormat)}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select format" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="csv">
            <div className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              <span>CSV</span>
            </div>
          </SelectItem>
          <SelectItem value="xlsx">
            <div className="flex items-center">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              <span>Excel (XLSX)</span>
            </div>
          </SelectItem>
          <SelectItem value="pdf">
            <div className="flex items-center">
              <FileX className="mr-2 h-4 w-4" />
              <span>PDF</span>
            </div>
          </SelectItem>
          <SelectItem value="json">
            <div className="flex items-center">
              <FileJson className="mr-2 h-4 w-4" />
              <span>JSON</span>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
