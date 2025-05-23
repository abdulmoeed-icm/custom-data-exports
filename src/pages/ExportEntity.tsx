
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';

type SelectedField = {
  field: Field;
  displayName: string;
  entityId: string;
};

// Generate mock data based on selected fields from multiple entities
const generateCombinedPreviewData = (
  selectedFields: SelectedField[], 
  count = 10
): Array<Record<string, any>> => {
  // Create a seed date that will remain consistent
  const seedDate = new Date('2024-04-15T12:00:00Z');
  
  return Array.from({ length: count }, (_, i) => {
    const row: Record<string, any> = {};
    
    selectedFields.forEach(selectedField => {
      const { field, entityId } = selectedField;
      
      switch (field.type) {
        case 'string':
          row[field.id] = `Sample ${field.id} ${i + 1}`;
          break;
        case 'int':
          row[field.id] = (i + 1) * 100 + Math.floor(i / 2) * 50;
          break;
        case 'date':
          // Generate consistent dates relative to seed date and row index
          const date = new Date(seedDate);
          date.setDate(date.getDate() - (i * 7)); // Each row is 7 days apart
          row[field.id] = date.toISOString().split('T')[0];
          break;
        case 'datetime':
          // Generate consistent datetimes relative to seed date and row index
          const datetime = new Date(seedDate);
          datetime.setHours(datetime.getHours() - (i * 24)); // Each row is 24 hours apart
          row[field.id] = datetime.toISOString();
          break;
        case 'boolean':
          row[field.id] = i % 2 === 0; // Alternating pattern
          break;
        default:
          row[field.id] = `${entityId} value ${i + 1}`;
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
  const isMobile = useIsMobile();
  
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
  
  // Whether to show a unified view or entity-specific tabs
  const [unifiedView, setUnifiedView] = useState(true);
  
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
  
  // Generate combined preview data whenever selected fields change
  useEffect(() => {
    if (selectedFields.length > 0) {
      setPreviewData(generateCombinedPreviewData(selectedFields));
    } else {
      setPreviewData([]);
    }
  }, [selectedFields]);
  
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
  
  const handleSelectAllFields = (entityId: string, isChecked: boolean) => {
    const entityFields = allEntityFields[entityId] || [];
    
    setSelectedFieldIds(prev => {
      const updatedFieldIds = { ...prev };
      if (!updatedFieldIds[entityId]) {
        updatedFieldIds[entityId] = [];
      }
      
      if (isChecked) {
        // Select all fields for this entity
        updatedFieldIds[entityId] = entityFields.map(field => field.id);
      } else {
        // Deselect all fields for this entity
        updatedFieldIds[entityId] = [];
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
    if (unifiedView) {
      // In unified view, we need to move the field in the overall selectedFields array
      setSelectedFields(prev => {
        const newFields = [...prev];
        const currentIndex = newFields.findIndex(f => f.field.id === fieldId && f.entityId === entityId);
        
        if (currentIndex === -1) return prev;
        
        const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= newFields.length) return prev;
        
        const temp = newFields[currentIndex];
        newFields[currentIndex] = newFields[newIndex];
        newFields[newIndex] = temp;
        
        return newFields;
      });
    } else {
      // In entity-specific view, move within entity
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
    }
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
      // For unified export, create a single export with all fields
      const combinedExportColumns: ExportColumn[] = selectedFields.map(field => ({
        id: field.field.id,
        label: field.displayName || field.field.label,
        entityId: field.entityId // Pass the entityId for reference
      }));
        
      // Use the first entity as the "primary" entity for the export
      const primaryEntityId = selectedEntities[0].id;
      await exportData(primaryEntityId, combinedExportColumns, exportFormat, true);
      
      toast({
        title: "Export successful",
        description: `Combined data exported as ${exportFormat.toUpperCase()}`,
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
    // For unified view, save all selected fields
    const columns = selectedFields.map(sf => ({
      id: sf.field.id,
      label: sf.displayName || sf.field.label,
      entityId: sf.entityId
    }));
    
    // Save the template to the active entity
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
  
  // Use keyboard to toggle checkbox and navigate fields
  const handleKeyDown = (e: React.KeyboardEvent, fieldId: string) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const isSelected = selectedFieldIds[activeEntityId]?.includes(fieldId) || false;
      handleSelectField(activeEntityId, fieldId, !isSelected);
    }
  };
  
  // Get fields for the active entity
  const activeEntityFields = allEntityFields[activeEntityId] || [];
  const activeSelectedFieldIds = selectedFieldIds[activeEntityId] || [];
  
  // Get active entity selected fields
  const activeSelectedFields = selectedFields.filter(field => field.entityId === activeEntityId);
  
  // Get the current entity
  const currentEntity = entities.find(e => e.id === activeEntityId);
  if (!currentEntity) return null;
  
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
            <div className="flex flex-col sm:flex-row items-center gap-4">
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
          
          {/* Entity selector tabs with field count badges */}
          {selectedEntities.length > 1 && (
            <div className="mb-6">
              <Tabs value={activeEntityId} onValueChange={setActiveEntityId} className="mb-2">
                <TabsList className="mb-2">
                  {selectedEntities.map(entity => (
                    <TabsTrigger key={entity.id} value={entity.id} className="flex items-center gap-2">
                      {entity.name}
                      {selectedFieldIds[entity.id]?.length > 0 && (
                        <Badge 
                          variant="default" 
                          className="text-xs py-0 px-2 h-5 min-w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground"
                        >
                          {selectedFieldIds[entity.id]?.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <div className="flex items-center justify-end mb-4">
                <Button 
                  variant={unifiedView ? "default" : "outline"}
                  onClick={() => setUnifiedView(true)}
                  className="rounded-r-none"
                >
                  Combined Export
                </Button>
                <Button
                  variant={!unifiedView ? "default" : "outline"} 
                  onClick={() => setUnifiedView(false)}
                  className="rounded-l-none"
                >
                  Entity-Specific Export
                </Button>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h2 className="text-lg font-medium mb-4">Available Fields</h2>
                <FieldList
                  fields={activeEntityFields}
                  selectedFields={activeSelectedFieldIds}
                  onSelectField={(fieldId, isChecked) => handleSelectField(activeEntityId, fieldId, isChecked)}
                  onSelectAll={(isChecked) => handleSelectAllFields(activeEntityId, isChecked)}
                  onKeyDown={(event, fieldId) => handleKeyDown(event, fieldId)}
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
                        key={`${sf.entityId}-${sf.field.id}`}
                        className="flex items-center justify-between p-2 bg-background border rounded-lg hover:bg-accent/10 transition-colors"
                      >
                        <div>
                          <div className="font-medium">
                            {sf.displayName}
                            <span className="ml-2 text-xs inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                              {selectedEntities.find(e => e.id === sf.entityId)?.name}
                            </span>
                          </div>
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
          
          {/* Preview Section */}
          <div className="mt-8">
            <div className="p-6 border rounded-lg bg-card">
              <h2 className="text-lg font-medium mb-4">Preview</h2>
              <PreviewTable
                fields={selectedFields}
                data={previewData}
              />
            </div>
          </div>
          
          {/* Export Options Section - Removed the heading as requested */}
          <div className="mt-8">
            <div className="p-6 border rounded-lg bg-card">
              <div className="flex flex-col gap-4 prose dark:prose-invert">
                <ExportFormatSelect
                  value={exportFormat}
                  onValueChange={setExportFormat}
                />
                
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
            </div>
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
