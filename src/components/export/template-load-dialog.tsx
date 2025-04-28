
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";
import { type ExportTemplate } from '@/data/export-templates';

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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Load Export Template</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {templates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No templates available for this entity
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="flex justify-between p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                    onClick={() => {
                      onLoad(template);
                      onOpenChange(false);
                    }}
                  >
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {template.fields.length} fields
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(template.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
