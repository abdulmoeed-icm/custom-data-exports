
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronsUpDown, AlertCircle } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";

const Export = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
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
    setValue(currentValue);
    setOpen(false);
    
    // Navigate only if the selected entity exists
    const entity = entityList.find(e => e.id === currentValue);
    if (entity) {
      navigate(`/export/${currentValue}`);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Selected entity not found",
      });
    }
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
          loaded && (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {value
                    ? entityList.find((entity) => entity.id === value)?.name || "Select an entity..."
                    : "Select an entity..."}
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
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === entity.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {entity.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                )}
              </PopoverContent>
            </Popover>
          )
        ) : (
          <div className="text-center p-4 border rounded-md">
            <p>No entities available for export.</p>
          </div>
        )}
        
        {/* Display entity cards only when loaded */}
        {loaded && entityList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {entityList.map(entity => (
              <EntityCard key={entity.id} entity={entity} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Export;
