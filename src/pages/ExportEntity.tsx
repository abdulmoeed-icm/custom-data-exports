
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FieldList } from '@/components/export/field-list';
import { SelectedFields } from '@/components/export/selected-fields';
import { PreviewTable } from '@/components/export/preview-table';
import { ExportFormatSelect, type ExportFormat } from '@/components/export/export-format-select';
import { TemplateSaveDialog } from '@/components/export/template-save-dialog';
import { TemplateLoadDialog } from '@/components/export/template-load-dialog';
import { entities } from '@/data/entities';
import { fields } from '@/data/fields';
import { exportTemplates } from '@/data/export-templates';
import { generateId } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

type SelectedField = {
  field: (typeof fields)[string][0];
  displayName: string;
};

// Mock data for preview
const generatePreviewData = (entityId: string, count = 10) => {
  const entityFields = fields[entityId] || [];
  return Array.from({ length: count }, (_, i) => {
    const row: Record<string, any> = {};
    entityFields.forEach(field => {
      switch (field.type) {
        case 'string':
          row[field.id] = `Sample ${field.id} ${i + 1}`;
          break;
        case 'int':
          row[field.id] = Math.floor(Math.random() * 1000);
          break;
        case 'date':
          // Random date in the last year
          const date = new Date();
          date.setDate(date.getDate() - Math.floor(Math.random() * 365));
          row[field.id] = date;
          break;
        case 'datetime':
          // Random datetime in the last week
          const datetime = new Date();
          datetime.setHours(datetime.getHours() - Math.floor(Math.random() * 168));
          row[field.id] = datetime;
          break;
        case 'boolean':
          row[field.id] = Math.random() > 0.5;
          break;
        default:
          row[field.id] = `Value ${i + 1}`;
      }
    });
    return row;
  });
};

const ExportEntity = () => {
  const { entityId = '' } = useParams<{ entityId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const entity = entities.find(e => e.id === entityId);
  const entityFields = fields[entityId] || [];
  
  const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<SelectedField[]>([]);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  const [previewData, setPreviewData] = useState<Array<Record<string, any>>>([]);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [availableTemplates, setAvailableTemplates] = useState(exportTemplates);
  
  // Update selected fields whenever selection changes
  useEffect(() => {
    const updatedSelectedFields = selectedFieldIds
      .map(id => {
        const field = entityFields.find(f => f.id === id);
        if (!field) return null;
        
        // Check if we already have this field in our array to preserve display name
        const existing = selectedFields.find(sf => sf.field.id === id);
        
        return {
          field,
          displayName: existing?.displayName || field.label
        };
      })
      .filter((item): item is SelectedField => item !== null);
    
    setSelectedFields(updatedSelectedFields);
  }, [selectedFieldIds, entityFields]);
  
  // Generate preview data
  useEffect(() => {
    if (entityId) {
      setPreviewData(generatePreviewData(entityId));
    }
  }, [entityId]);
  
  // If entity doesn't exist, redirect to export page
  useEffect(() => {
    if (!entity) {
      navigate('/export');
    }
  }, [entity, navigate]);
  
  const handleSelectField = (fieldId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedFieldIds(prev => [...prev, fieldId]);
    } else {
      setSelectedFieldIds(prev => prev.filter(id => id !== fieldId));
    }
  };
  
  const handleRemoveField = (fieldId: string) => {
    setSelectedFieldIds(prev => prev.filter(id => id !== fieldId));
  };
  
  const handleMoveField = (fieldId: string, direction: "up" | "down") => {
    const currentIndex = selectedFieldIds.indexOf(fieldId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= selectedFieldIds.length) return;
    
    const newSelectedFieldIds = [...selectedFieldIds];
    
    // Swap the items
    const temp = newSelectedFieldIds[currentIndex];
    newSelectedFieldIds[currentIndex] = newSelectedFieldIds[newIndex];
    newSelectedFieldIds[newIndex] = temp;
    
    setSelectedFieldIds(newSelectedFieldIds);
  };
  
  const handleRenameField = (fieldId: string, displayName: string) => {
    setSelectedFields(prev =>
      prev.map(item =>
        item.field.id === fieldId
          ? { ...item, displayName }
          : item
      )
    );
  };
  
  const handleExport = () => {
    if (selectedFields.length === 0) return;
    
    // In a real application, this would trigger the actual export process
    // For this demo, we'll just show a toast notification
    toast({
      title: "Export successful",
      description: `${selectedFields.length} fields exported as ${exportFormat.toUpperCase()}`,
    });
    
    // Log the export (in a real app, this would be saved to a database)
    console.log('Export Log:', {
      entityId,
      entityName: entity?.name,
      fields: selectedFields.map(sf => ({ id: sf.field.id, name: sf.displayName || sf.field.label })),
      format: exportFormat,
      timestamp: new Date().toISOString(),
    });
  };
  
  const handleSaveTemplate = (name: string) => {
    const newTemplate = {
      id: generateId(),
      name,
      entityId,
      fields: selectedFields.map(sf => ({ id: sf.field.id, displayName: sf.displayName })),
      createdAt: new Date(),
    };
    
    setAvailableTemplates(prev => [newTemplate, ...prev]);
    
    toast({
      title: "Template saved",
      description: `"${name}" has been saved and is available for future use`,
    });
  };
  
  const handleLoadTemplate = (template: typeof exportTemplates[0]) => {
    if (template.entityId !== entityId) {
      toast({
        title: "Template not compatible",
        description: "This template is for a different entity type",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFieldIds(template.fields.map(f => f.id));
    
    // Also set display names from template
    const existingFields = fields[entityId] || [];
    const newSelectedFields = template.fields
      .map(templateField => {
        const field = existingFields.find(f => f.id === templateField.id);
        if (!field) return null;
        
        return {
          field,
          displayName: templateField.displayName
        };
      })
      .filter((item): item is SelectedField => item !== null);
    
    setSelectedFields(newSelectedFields);
    
    toast({
      title: "Template loaded",
      description: `"${template.name}" has been applied with ${template.fields.length} fields`,
    });
  };
  
  if (!entity) return null;
  
  const filteredTemplates = availableTemplates.filter(t => t.entityId === entityId);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{entity.name} Export</h1>
              <p className="text-gray-600">{entity.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => setIsLoadDialogOpen(true)}>
                Load Template
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsSaveDialogOpen(true)}
                disabled={selectedFields.length === 0}
              >
                Save Template
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FieldList
                fields={entityFields}
                selectedFields={selectedFieldIds}
                onSelectField={handleSelectField}
              />
            </div>
            
            <div>
              <SelectedFields
                selectedFields={selectedFields}
                onRemoveField={handleRemoveField}
                onMoveField={handleMoveField}
                onRenameField={handleRenameField}
              />
            </div>
          </div>
          
          <div className="mt-8">
            <Tabs defaultValue="preview">
              <TabsList className="mb-4">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="export">Export Options</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="p-4 border rounded-md">
                <PreviewTable
                  fields={selectedFields}
                  data={previewData}
                />
              </TabsContent>
              <TabsContent value="export" className="p-4 border rounded-md">
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Export Format</h3>
                    <ExportFormatSelect
                      value={exportFormat}
                      onValueChange={setExportFormat}
                    />
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button 
                      onClick={handleExport}
                      disabled={selectedFields.length === 0}
                    >
                      Export Data
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <TemplateSaveDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        onSave={handleSaveTemplate}
      />
      
      <TemplateLoadDialog
        open={isLoadDialogOpen}
        onOpenChange={setIsLoadDialogOpen}
        templates={filteredTemplates}
        onLoad={handleLoadTemplate}
      />
    </div>
  );
};

export default ExportEntity;
