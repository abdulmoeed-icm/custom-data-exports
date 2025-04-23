
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { FieldList } from "@/components/export/FieldList";
import { SelectedFields } from "@/components/export/SelectedFields";
import { PreviewTable } from "@/components/export/PreviewTable";
import { ExportFormatSelect, type ExportFormat } from "@/components/export/ExportFormatSelect";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useToast } from "@/hooks/use-toast";

type EntityField = Tables<'entity_fields'>;
type SelectedField = EntityField & { displayLabel?: string };

const ExportEntity = () => {
  const { entityId } = useParams<{ entityId: string }>();
  const [selectedFields, setSelectedFields] = useState<SelectedField[]>([]);
  const [templateName, setTemplateName] = useState('');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  const { toast } = useToast();

  const { data: fields = [] } = useQuery({
    queryKey: ['entityFields', entityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entity_fields')
        .select('*')
        .eq('entity_id', entityId)
        .order('name');
      
      if (error) throw error;
      return data as EntityField[];
    },
  });

  const { data: previewData = [] } = useQuery({
    queryKey: ['previewData', entityId],
    enabled: selectedFields.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from(entityId!)
        .select(selectedFields.map(f => f.name).join(','))
        .limit(50);
      
      if (error) throw error;
      return data;
    },
  });

  const handleFieldSelect = (field: EntityField, checked: boolean) => {
    if (checked) {
      setSelectedFields(prev => [...prev, field]);
    } else {
      setSelectedFields(prev => prev.filter(f => f.id !== field.id));
    }
  };

  const handleLabelChange = (fieldId: string, newLabel: string) => {
    setSelectedFields(prev =>
      prev.map(field =>
        field.id === fieldId
          ? { ...field, displayLabel: newLabel }
          : field
      )
    );
  };

  const handleSaveTemplate = async () => {
    if (!templateName) {
      toast({
        title: "Template name required",
        description: "Please enter a name for your template",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('export_templates')
      .insert({
        name: templateName,
        entity_id: entityId,
        fields: selectedFields.map(f => ({
          id: f.id,
          name: f.name,
          label: f.displayLabel || f.label
        }))
      });

    if (error) {
      toast({
        title: "Error saving template",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Template saved",
      description: "Your export template has been saved successfully",
    });
  };

  const handleExport = async () => {
    // Log the export
    await supabase
      .from('export_logs')
      .insert({
        entity_id: entityId,
        fields: selectedFields.map(f => ({
          name: f.name,
          label: f.displayLabel || f.label
        })),
        format: exportFormat,
        row_count: previewData.length
      });

    // TODO: Implement actual export functionality
    toast({
      title: "Export started",
      description: `Exporting data in ${exportFormat.toUpperCase()} format`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-4rem)]">
      <div className="h-full flex flex-col">
        <ResizablePanelGroup direction="horizontal" className="flex-grow">
          <ResizablePanel defaultSize={30}>
            <div className="h-full p-6 border-r">
              <h2 className="text-lg font-semibold mb-4">All Fields</h2>
              <FieldList
                fields={fields}
                onFieldSelect={handleFieldSelect}
              />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={70}>
            <div className="h-full p-6 flex flex-col">
              <h2 className="text-lg font-semibold mb-4">Selected Columns</h2>
              <SelectedFields
                fields={selectedFields}
                onLabelChange={handleLabelChange}
              />

              {selectedFields.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mt-8 mb-4">Preview (First 50 Rows)</h3>
                  <div className="flex-grow overflow-auto">
                    <PreviewTable
                      data={previewData}
                      fields={selectedFields}
                    />
                  </div>
                </>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        <div className="border-t mt-4 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ExportFormatSelect
              value={exportFormat}
              onValueChange={setExportFormat}
            />
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" disabled={selectedFields.length === 0}>
                  Save as Template
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Save Export Template</SheetTitle>
                  <SheetDescription>
                    Save your current selection as a template for future use
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <Input
                    placeholder="Template name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                </div>
                <Button onClick={handleSaveTemplate}>
                  Save Template
                </Button>
              </SheetContent>
            </Sheet>
          </div>

          <Button
            disabled={selectedFields.length === 0}
            onClick={handleExport}
            className="min-w-[200px]"
          >
            Export {selectedFields.length} Columns
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportEntity;
