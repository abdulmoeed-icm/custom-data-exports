
import React from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Template } from '@/hooks/useTemplates';
import { Check, Trash2 } from 'lucide-react';

interface TemplatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: Template[];
  onUseTemplate: (template: Template) => void;
  onDeleteTemplate: (id: string) => void;
  entityId: string;
}

export const TemplatesDialog = ({
  open,
  onOpenChange,
  templates,
  onUseTemplate,
  onDeleteTemplate,
  entityId,
}: TemplatesDialogProps) => {
  const filteredTemplates = templates.filter(t => t.entityId === entityId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Saved Templates</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No templates available for this entity
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-lg">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {template.columns.length} fields • Created {format(new Date(template.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1 hover:bg-primary hover:text-primary-foreground"
                          onClick={() => {
                            onUseTemplate(template);
                            onOpenChange(false);
                          }}
                        >
                          <Check className="h-4 w-4" />
                          Use
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => onDeleteTemplate(template.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
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
