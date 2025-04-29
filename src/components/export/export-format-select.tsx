
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FileText, FileSpreadsheet, FileX, FileJson } from "lucide-react";

export type ExportFormat = "csv" | "xlsx" | "pdf" | "json" | "xml";

interface ExportFormatSelectProps {
  value: ExportFormat;
  onValueChange: (value: ExportFormat) => void;
}

export const ExportFormatSelect = ({
  value,
  onValueChange,
}: ExportFormatSelectProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Choose File Type for Export</h3>
      
      <RadioGroup 
        value={value} 
        onValueChange={(val) => onValueChange(val as ExportFormat)}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
      >
        <div>
          <RadioGroupItem 
            value="csv" 
            id="csv" 
            className="peer sr-only" 
          />
          <Label 
            htmlFor="csv" 
            className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
          >
            <FileText className="mb-2 h-6 w-6" />
            <span>CSV</span>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem 
            value="xlsx" 
            id="xlsx" 
            className="peer sr-only" 
          />
          <Label 
            htmlFor="xlsx" 
            className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
          >
            <FileSpreadsheet className="mb-2 h-6 w-6" />
            <span>Excel (XLSX)</span>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem 
            value="pdf" 
            id="pdf" 
            className="peer sr-only" 
          />
          <Label 
            htmlFor="pdf" 
            className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
          >
            <FileX className="mb-2 h-6 w-6" />
            <span>PDF</span>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem 
            value="json" 
            id="json" 
            className="peer sr-only" 
          />
          <Label 
            htmlFor="json" 
            className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
          >
            <FileJson className="mb-2 h-6 w-6" />
            <span>JSON</span>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem 
            value="xml" 
            id="xml" 
            className="peer sr-only" 
          />
          <Label 
            htmlFor="xml" 
            className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
          >
            <FileText className="mb-2 h-6 w-6" />
            <span>XML</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};
