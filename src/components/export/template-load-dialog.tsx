
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type ExportTemplate } from '@/data/export-templates';
import { formatDate } from '@/lib/utils';

interface TemplateLoadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: ExportTemplate[];
  onLoad: (template: ExportTemplate) => void;
}

export const TemplateLoadDialog = ({
  open,
  onOpenChange,
  templates,
  onLoad,
}: TemplateLoadDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Load Export Template</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] rounded-md border p-4">
          {templates.length > 0 ? (
            <div className="space-y-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
                >
                  <div className="space-y-1">
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-gray-500">
                      {template.fields.length} fields • Created {formatDate(template.createdAt)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      onLoad(template);
                      onOpenChange(false);
                    }}
                  >
                    Load
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center text-gray-500">
              <div>
                <p>No saved templates available</p>
                <p className="text-sm mt-1">Create and save a template first</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
