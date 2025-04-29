
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { entities as initialEntities, Entity } from '@/data/entities';
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from '@/components/export/loading-state';
import { ErrorState } from '@/components/export/error-state';
import { SelectedEntityBadges } from '@/components/export/selected-entity-badges';
import { ExportButton } from '@/components/export/export-button';
import { EntityGrid } from '@/components/export/entity-grid';

const Export = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedEntities, setSelectedEntities] = useState<Entity[]>([]);
  const [entityList, setEntityList] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load entities safely
  useEffect(() => {
    const loadEntities = () => {
      try {
        // Check if entities exist and are in the correct format
        if (initialEntities && Array.isArray(initialEntities) && initialEntities.length > 0) {
          // Make sure each entity has the required properties
          const validEntities = initialEntities.filter(entity => 
            entity && typeof entity === 'object' && 
            'id' in entity && 'name' in entity && 'description' in entity
          );
          
          if (validEntities.length === initialEntities.length) {
            setEntityList(validEntities);
            setLoaded(true);
          } else {
            console.error("Some entities are not in the correct format:", initialEntities);
            setError("Some entity data is invalid");
          }
        } else {
          console.error("Entities data is invalid:", initialEntities);
          setError("Failed to load entities data");
        }
      } catch (e) {
        console.error("Error loading entities:", e);
        setError("An error occurred while loading entities");
      } finally {
        setIsLoading(false);
      }
    };

    // Short timeout to ensure DOM is ready
    const timer = setTimeout(loadEntities, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectEntity = (entityId: string) => {
    const entity = entityList.find(e => e.id === entityId);
    if (!entity) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Selected entity not found",
      });
      return;
    }

    // Check if entity is already selected
    if (selectedEntities.some(e => e.id === entityId)) {
      // Remove from selection if already selected
      setSelectedEntities(prev => prev.filter(e => e.id !== entityId));
    } else {
      // Add to selection if not already selected
      setSelectedEntities(prev => [...prev, entity]);
    }
  };

  const handleRemoveEntity = (entityId: string) => {
    setSelectedEntities(prev => prev.filter(e => e.id !== entityId));
  };

  const handleExportSelected = () => {
    if (selectedEntities.length === 0) {
      toast({
        variant: "destructive",
        title: "No entities selected",
        description: "Please select at least one entity to export",
      });
      return;
    }
    
    // Always navigate to the export entity page with the selected entities
    navigate(`/export/${selectedEntities[0].id}`, { 
      state: { selectedEntities: selectedEntities } 
    });
  };

  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-2xl space-y-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-center">Custom Data Export</h1>
        
        {entityList.length > 0 ? (
          <div className="space-y-4">
            {loaded && (
              <h2 className="text-2xl font-semibold text-center mb-4 text-primary">
                Select Modules below
              </h2>
            )}

            {/* Selected entities badges */}
            <SelectedEntityBadges 
              selectedEntities={selectedEntities} 
              onRemoveEntity={handleRemoveEntity} 
            />
            
            {/* Export button for selected entities */}
            <ExportButton 
              selectedEntities={selectedEntities}
              onExport={handleExportSelected}
            />
          </div>
        ) : (
          <div className="text-center p-4 border rounded-md">
            <p>No entities available for export.</p>
          </div>
        )}
        
        {/* Display entity cards only when loaded */}
        {loaded && entityList.length > 0 && (
          <EntityGrid 
            entities={entityList}
            selectedEntities={selectedEntities}
            onToggleSelect={handleSelectEntity}
          />
        )}
      </div>
    </div>
  );
};

export default Export;
