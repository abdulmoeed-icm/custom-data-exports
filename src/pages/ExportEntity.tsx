
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FieldList } from '@/components/export/field-list';
import { PreviewTable } from '@/components/export/preview-table';
import { ExportFormatSelect } from '@/components/export/export-format-select';
import { TemplateSaveDialog } from '@/components/export/template-save-dialog';
import { entities, Entity } from '@/data/entities';
import { fields, Field } from '@/data/fields';
import { exportData, ExportColumn } from '@/lib/export-utils';
import { useToast } from "@/hooks/use-toast";
import { useTemplates } from '@/hooks/useTemplates';
import { TemplatesDialog } from '@/components/export/templates-dialog';

type SelectedField = {
  field: Field;
  displayName: string;
  entityId: string;
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
          row[field.id] = date.toISOString().split('T')[0];
          break;
        case 'datetime':
          const datetime = new Date();
          datetime.setHours(datetime.getHours() - Math.floor(Math.random() * 168));
          row[field.id] = datetime.toISOString();
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
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { templates, saveTemplate, deleteTemplate, getTemplatesByEntityId } = useTemplates();
  
  // Get the selected entities from location state or use only the one from URL
  const [selectedEntities, setSelectedEntities] = useState<Entity[]>(() => {
    const stateEntities = location.state?.selectedEntities;
    if (stateEntities && Array.isArray(stateEntities) && stateEntities.length > 0) {
      return stateEntities;
    }
    const singleEntity = entities.find(e => e.id === entityId);
    return singleEntity ? [singleEntity] : [];
  });

  // State for the active entity tab
  const [activeEntityId, setActiveEntityId] = useState(selectedEntities[0]?.id || entityId);
  
  // Get all entity fields across all selected entities
  const allEntityFields: Record<string, Field[]> = {};
  selectedEntities.forEach(entity => {
    allEntityFields[entity.id] = fields[entity.id] || [];
  });
  
  const [selectedFieldIds, setSelectedFieldIds] = useState<Record<string, string[]>>({});
  const [selectedFields, setSelectedFields] = useState<SelectedField[]>([]);
  const [exportFormat, setExportFormat] = useState<typeof ExportFormatSelect.arguments.value>('csv');
  const [previewData, setPreviewData] = useState<Array<Record<string, any>>>([]);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isTemplatesDialogOpen, setIsTemplatesDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Initialize selectedFieldIds for each entity
  useEffect(() => {
    const initialSelectedFields: Record<string, string[]> = {};
    selectedEntities.forEach(entity => {
      initialSelectedFields[entity.id] = [];
    });
    setSelectedFieldIds(initialSelectedFields);
  }, [selectedEntities]);
  
  // Update selected fields whenever selectedFieldIds changes
  useEffect(() => {
    const updatedSelectedFields: SelectedField[] = [];
    
    Object.entries(selectedFieldIds).forEach(([entityId, fieldIds]) => {
      const entityFields = allEntityFields[entityId] || [];
      
      fieldIds.forEach(fieldId => {
        const field = entityFields.find(f => f.id === fieldId);
        if (field) {
          const existing = selectedFields.find(sf => sf.field.id === fieldId && sf.entityId === entityId);
          
          updatedSelectedFields.push({
            field,
            displayName: existing?.displayName || field.label,
            entityId
          });
        }
      });
    });
    
    setSelectedFields(updatedSelectedFields);
  }, [selectedFieldIds, allEntityFields]);
  
  // Generate preview data for the active entity
  useEffect(() => {
    if (activeEntityId) {
      setPreviewData(generatePreviewData(activeEntityId));
    }
  }, [activeEntityId]);
  
  // Validate that we have at least one entity
  useEffect(() => {
    if (selectedEntities.length === 0) {
      navigate('/export');
      toast({
        title: "No entities selected",
        description: "Please select at least one entity to export",
        variant: "destructive",
      });
    }
  }, [selectedEntities, navigate, toast]);
  
  const handleSelectField = (entityId: string, fieldId: string, isChecked: boolean) => {
    setSelectedFieldIds(prev => {
      const updatedFieldIds = { ...prev };
      if (!updatedFieldIds[entityId]) {
        updatedFieldIds[entityId] = [];
      }
      
      if (isChecked) {
        updatedFieldIds[entityId] = [...updatedFieldIds[entityId], fieldId];
      } else {
        updatedFieldIds[entityId] = updatedFieldIds[entityId].filter(id => id !== fieldId);
      }
      
      return updatedFieldIds;
    });
  };
  
  const handleRemoveField = (entityId: string, fieldId: string) => {
    setSelectedFieldIds(prev => {
      const updatedFieldIds = { ...prev };
      if (updatedFieldIds[entityId]) {
        updatedFieldIds[entityId] = updatedFieldIds[entityId].filter(id => id !== fieldId);
      }
      return updatedFieldIds;
    });
  };
  
  const handleMoveField = (entityId: string, fieldId: string, direction: "up" | "down") => {
    setSelectedFieldIds(prev => {
      const updatedFieldIds = { ...prev };
      if (!updatedFieldIds[entityId]) return prev;
      
      const currentFields = [...updatedFieldIds[entityId]];
      const currentIndex = currentFields.indexOf(fieldId);
      if (currentIndex === -1) return prev;
      
      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= currentFields.length) return prev;
      
      const temp = currentFields[currentIndex];
      currentFields[currentIndex] = currentFields[newIndex];
      currentFields[newIndex] = temp;
      
      updatedFieldIds[entityId] = currentFields;
      return updatedFieldIds;
    });
  };
  
  const handleRenameField = (entityId: string, fieldId: string, displayName: string) => {
    setSelectedFields(prev =>
      prev.map(item =>
        item.field.id === fieldId && item.entityId === entityId
          ? { ...item, displayName }
          : item
      )
    );
  };
  
  const handleExport = async () => {
    if (selectedFields.length === 0) {
      toast({
        title: "No fields selected",
        description: "Please select at least one field to export",
        variant: "destructive",
      });
      return;
    }
    
    setIsExporting(true);
    
    try {
      // Group selected fields by entity
      const fieldsByEntity: Record<string, ExportColumn[]> = {};
      
      selectedFields.forEach(field => {
        if (!fieldsByEntity[field.entityId]) {
          fieldsByEntity[field.entityId] = [];
        }
        
        fieldsByEntity[field.entityId].push({
          id: field.field.id,
          label: field.displayName || field.field.label
        });
      });
      
      // Check if we're exporting a single entity or multiple
      if (selectedEntities.length === 1) {
        // Single entity export
        const entityId = selectedEntities[0].id;
        await exportData(entityId, fieldsByEntity[entityId], exportFormat);
      } else {
        // Multi-entity export - for now let's export each separately
        // In future this could be enhanced to create a combined export
        for (const entityId of Object.keys(fieldsByEntity)) {
          if (fieldsByEntity[entityId].length > 0) {
            await exportData(entityId, fieldsByEntity[entityId], exportFormat);
          }
        }
      }
      
      toast({
        title: "Export successful",
        description: `Data exported as ${exportFormat.toUpperCase()}`,
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
    // For now, let's only save templates for the active entity
    const columns = selectedFields
      .filter(sf => sf.entityId === activeEntityId)
      .map(sf => ({
        id: sf.field.id,
        label: sf.displayName || sf.field.label
      }));
    
    saveTemplate(name, activeEntityId, columns);
    
    toast({
      title: "Template saved",
      description: `"${name}" has been saved for future use`,
    });
  };
  
  const handleUseTemplate = (template: ReturnType<typeof useTemplates>['templates'][number]) => {
    const templateEntityId = template.entityId;
    const entityFields = allEntityFields[templateEntityId] || [];
    
    setSelectedFieldIds(prev => {
      const updatedFieldIds = { ...prev };
      updatedFieldIds[templateEntityId] = template.columns.map(column => column.id);
      return updatedFieldIds;
    });
    
    // Update display names for fields from template
    const fieldsFromTemplate: SelectedField[] = template.columns
      .map(column => {
        const field = entityFields.find(f => f.id === column.id);
        if (!field) return null;
        
        return {
          field,
          displayName: column.label || field.label,
          entityId: templateEntityId
        };
      })
      .filter((item): item is SelectedField => item !== null);
    
    // Preserve fields from other entities
    const otherFields = selectedFields.filter(field => field.entityId !== templateEntityId);
    
    setSelectedFields([...otherFields, ...fieldsFromTemplate]);
    
    // Switch to the entity tab for the template
    setActiveEntityId(templateEntityId);
    
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
  
  // Get the current entity
  const currentEntity = entities.find(e => e.id === activeEntityId);
  if (!currentEntity) return null;

  // Use keyboard to toggle checkbox and navigate fields
  const handleKeyDown = (e: React.KeyboardEvent, entityId: string, fieldId: string) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const isSelected = selectedFieldIds[entityId]?.includes(fieldId) || false;
      handleSelectField(entityId, fieldId, !isSelected);
    }
  };
  
  // Get fields for the active entity
  const activeEntityFields = allEntityFields[activeEntityId] || [];
  const activeSelectedFieldIds = selectedFieldIds[activeEntityId] || [];
  
  // Get active entity selected fields
  const activeSelectedFields = selectedFields.filter(field => field.entityId === activeEntityId);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {selectedEntities.length > 1 
                  ? "Multiple Entities Export" 
                  : `${currentEntity.name} Export`}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedEntities.length > 1
                  ? `Export data from ${selectedEntities.length} entities`
                  : currentEntity.description}
              </p>
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
                disabled={activeSelectedFields.length === 0}
                className="hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-ring"
              >
                Save as Template
              </Button>
            </div>
          </div>
          
          {/* Entity selector tabs when multiple entities */}
          {selectedEntities.length > 1 && (
            <Tabs value={activeEntityId} onValueChange={setActiveEntityId} className="mb-6">
              <TabsList className="mb-2">
                {selectedEntities.map(entity => (
                  <TabsTrigger key={entity.id} value={entity.id}>
                    {entity.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h2 className="text-lg font-medium mb-4">Available Fields</h2>
                <FieldList
                  fields={activeEntityFields}
                  selectedFields={activeSelectedFieldIds}
                  onSelectField={(fieldId, isChecked) => handleSelectField(activeEntityId, fieldId, isChecked)}
                  onKeyDown={(event, fieldId) => handleKeyDown(event, activeEntityId, fieldId)}
                />
              </div>
            </div>
            
            <div>
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h2 className="text-lg font-medium mb-4">Selected Fields</h2>
                <div className="space-y-3">
                  {activeSelectedFields.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">
                      No fields selected. Select fields from the left panel.
                    </p>
                  ) : (
                    activeSelectedFields.map((sf, index) => (
                      <div 
                        key={`${sf.entityId}-${sf.field.id}`}
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
                            onClick={() => handleMoveField(sf.entityId, sf.field.id, "up")}
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
                            onClick={() => handleMoveField(sf.entityId, sf.field.id, "down")}
                            disabled={index === activeSelectedFields.length - 1}
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
                              if (newName) handleRenameField(sf.entityId, sf.field.id, newName);
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
                            onClick={() => handleRemoveField(sf.entityId, sf.field.id)}
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
                  fields={activeSelectedFields}
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
        templates={templates.filter(t => t.entityId === activeEntityId)}
        onUseTemplate={handleUseTemplate}
        onDeleteTemplate={handleDeleteTemplate}
        entityId={activeEntityId}
      />
    </div>
  );
};

export default ExportEntity;
