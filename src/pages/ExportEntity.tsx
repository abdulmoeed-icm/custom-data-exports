
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FieldList } from '@/components/export/field-list';
import { PreviewTable } from '@/components/export/preview-table';
import { ExportFormatSelect } from '@/components/export/export-format-select';
import { TemplateSaveDialog } from '@/components/export/template-save-dialog';
import { entities } from '@/data/entities';
import { fields } from '@/data/fields';
import { exportData, ExportColumn } from '@/lib/export-utils';
import { useToast } from "@/hooks/use-toast";
import { useTemplates } from '@/hooks/useTemplates';
import { TemplatesDialog } from '@/components/export/templates-dialog';

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
          const date = new Date();
          date.setDate(date.getDate() - Math.floor(Math.random() * 365));
          row[field.id] = date;
          break;
        case 'datetime':
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
  const { templates, saveTemplate, deleteTemplate, getTemplatesByEntityId } = useTemplates();
  
  const entity = entities.find(e => e.id === entityId);
  const entityFields = fields[entityId] || [];
  
  const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<SelectedField[]>([]);
  const [exportFormat, setExportFormat] = useState<typeof ExportFormatSelect.arguments.value>('csv');
  const [previewData, setPreviewData] = useState<Array<Record<string, any>>>([]);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isTemplatesDialogOpen, setIsTemplatesDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  useEffect(() => {
    const updatedSelectedFields = selectedFieldIds
      .map(id => {
        const field = entityFields.find(f => f.id === id);
        if (!field) return null;
        
        const existing = selectedFields.find(sf => sf.field.id === id);
        
        return {
          field,
          displayName: existing?.displayName || field.label
        };
      })
      .filter((item): item is SelectedField => item !== null);
    
    setSelectedFields(updatedSelectedFields);
  }, [selectedFieldIds, entityFields]);
  
  useEffect(() => {
    if (entityId) {
      setPreviewData(generatePreviewData(entityId));
    }
  }, [entityId]);
  
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
  
  const handleExport = async () => {
    if (selectedFields.length === 0) return;
    
    setIsExporting(true);
    
    try {
      const columns: ExportColumn[] = selectedFields.map(field => ({
        id: field.field.id,
        label: field.displayName || field.field.label
      }));
      
      await exportData(entityId, columns, exportFormat);
      
      toast({
        title: "Export successful",
        description: `Data exported as ${exportFormat.toUpperCase()}`,
      });
      
      console.log('Export Log:', {
        entityId,
        entityName: entity?.name,
        columns,
        format: exportFormat,
        timestamp: new Date().toISOString(),
      });
      
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export failed",
        description: "There was an error generating your export file.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleSaveTemplate = (name: string) => {
    const columns = selectedFields.map(sf => ({
      id: sf.field.id,
      label: sf.displayName || sf.field.label
    }));
    
    saveTemplate(name, entityId, columns);
    
    toast({
      title: "Template saved",
      description: `"${name}" has been saved for future use`,
    });
  };
  
  const handleUseTemplate = (template: ReturnType<typeof useTemplates>['templates'][number]) => {
    const fieldIds = template.columns.map(column => column.id);
    setSelectedFieldIds(fieldIds);
    
    const newSelectedFields: SelectedField[] = template.columns
      .map(column => {
        const field = entityFields.find(f => f.id === column.id);
        if (!field) return null;
        
        return {
          field,
          displayName: column.label || field.label
        };
      })
      .filter((item): item is SelectedField => item !== null);
    
    setSelectedFields(newSelectedFields);
    
    toast({
      title: "Template loaded",
      description: `"${template.name}" has been applied`
    });
  };
  
  const handleDeleteTemplate = (id: string) => {
    deleteTemplate(id);
    
    toast({
      title: "Template deleted",
      description: "The template has been removed"
    });
  };
  
  if (!entity) return null;

  // Use keyboard to toggle checkbox and navigate fields
  const handleKeyDown = (e: React.KeyboardEvent, fieldId: string) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const isSelected = selectedFieldIds.includes(fieldId);
      handleSelectField(fieldId, !isSelected);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{entity.name} Export</h1>
              <p className="text-gray-600 dark:text-gray-400">{entity.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setIsTemplatesDialogOpen(true)}
                className="hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-ring"
              >
                Saved Templates
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsSaveDialogOpen(true)}
                disabled={selectedFields.length === 0}
                className="hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-ring"
              >
                Save as Template
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h2 className="text-lg font-medium mb-4">Available Fields</h2>
                <FieldList
                  fields={entityFields}
                  selectedFields={selectedFieldIds}
                  onSelectField={handleSelectField}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
            
            <div>
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h2 className="text-lg font-medium mb-4">Selected Fields</h2>
                <div className="space-y-3">
                  {selectedFields.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">
                      No fields selected. Select fields from the left panel.
                    </p>
                  ) : (
                    selectedFields.map((sf, index) => (
                      <div 
                        key={sf.field.id} 
                        className="flex items-center justify-between p-3 bg-background border rounded-lg hover:bg-accent/10 transition-colors"
                      >
                        <div>
                          <div className="font-medium">{sf.displayName}</div>
                          <div className="text-sm text-muted-foreground">{sf.field.id}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleMoveField(sf.field.id, "up")}
                            disabled={index === 0}
                            className="h-8 w-8 p-0 rounded-full"
                            tabIndex={0}
                          >
                            <span className="sr-only">Move up</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleMoveField(sf.field.id, "down")}
                            disabled={index === selectedFields.length - 1}
                            className="h-8 w-8 p-0 rounded-full"
                            tabIndex={0}
                          >
                            <span className="sr-only">Move down</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              const newName = prompt("Enter display name:", sf.displayName);
                              if (newName) handleRenameField(sf.field.id, newName);
                            }}
                            className="h-8 w-8 p-0 rounded-full"
                            tabIndex={0}
                          >
                            <span className="sr-only">Rename</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveField(sf.field.id)}
                            className="h-8 w-8 p-0 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                            tabIndex={0}
                          >
                            <span className="sr-only">Remove</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <Tabs defaultValue="preview">
              <TabsList className="mb-4">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="export">Export Options</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="p-6 border rounded-lg bg-card">
                <PreviewTable
                  fields={selectedFields}
                  data={previewData}
                />
              </TabsContent>
              <TabsContent value="export" className="p-6 border rounded-lg bg-card">
                <div className="flex flex-col gap-4 prose dark:prose-invert">
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
                      disabled={selectedFields.length === 0 || isExporting}
                      className="focus:ring-2 focus:ring-ring"
                    >
                      {isExporting ? "Exporting..." : "Export Data"}
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
      
      <TemplatesDialog
        open={isTemplatesDialogOpen}
        onOpenChange={setIsTemplatesDialogOpen}
        templates={templates}
        onUseTemplate={handleUseTemplate}
        onDeleteTemplate={handleDeleteTemplate}
        entityId={entityId}
      />
    </div>
  );
};

export default ExportEntity;
