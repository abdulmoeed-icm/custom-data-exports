
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronsUpDown, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { entities as initialEntities, Entity } from '@/data/entities';
import { EntityCard } from '@/components/export/entity-card';
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const Export = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
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

  const handleSelectEntity = (currentValue: string) => {
    const entity = entityList.find(e => e.id === currentValue);
    if (!entity) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Selected entity not found",
      });
      return;
    }

    // Check if entity is already selected
    if (selectedEntities.some(e => e.id === currentValue)) {
      // Remove from selection if already selected
      setSelectedEntities(prev => prev.filter(e => e.id !== currentValue));
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
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <p>Loading entities...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <p className="text-red-500 mb-4">{error}</p>
        <Button 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-2xl space-y-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-center">Custom Data Export</h1>
        
        {entityList.length > 0 ? (
          <div className="space-y-4">
            {loaded && (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selectedEntities.length > 0 
                      ? `${selectedEntities.length} entity/entities selected`
                      : "Select entities..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  {loaded && entityList.length > 0 && (
                    <Command>
                      <CommandInput placeholder="Search entities..." />
                      <CommandEmpty>No entity found.</CommandEmpty>
                      <CommandGroup>
                        {entityList.map((entity) => (
                          <CommandItem
                            key={entity.id}
                            value={entity.id}
                            onSelect={handleSelectEntity}
                          >
                            <div className="flex items-center">
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedEntities.some(e => e.id === entity.id) ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {entity.name}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  )}
                </PopoverContent>
              </Popover>
            )}

            {/* Selected entities badges */}
            {selectedEntities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedEntities.map(entity => (
                  <Badge key={entity.id} variant="secondary" className="flex items-center gap-1">
                    {entity.name}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0"
                      onClick={() => handleRemoveEntity(entity.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Export button for selected entities */}
            {selectedEntities.length > 0 && (
              <Button 
                className="w-full mt-4" 
                onClick={handleExportSelected}
              >
                {selectedEntities.length === 1 
                  ? `Export ${selectedEntities[0].name}`
                  : `Export ${selectedEntities.length} Selected Entities`
                }
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center p-4 border rounded-md">
            <p>No entities available for export.</p>
          </div>
        )}
        
        {/* Display entity cards only when loaded */}
        {loaded && entityList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {entityList.map(entity => (
              <EntityCard 
                key={entity.id} 
                entity={entity} 
                isSelected={selectedEntities.some(e => e.id === entity.id)}
                onToggleSelect={() => handleSelectEntity(entity.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Export;
