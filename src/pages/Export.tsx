
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronsUpDown } from "lucide-react";
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
import { entities, Entity } from '@/data/entities';
import { EntityCard } from '@/components/export/entity-card';

const Export = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [entityList, setEntityList] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load entities safely
  useEffect(() => {
    try {
      // Use setTimeout to ensure this runs after component mounting
      setTimeout(() => {
        if (entities && Array.isArray(entities)) {
          setEntityList([...entities]);
          setIsLoading(false);
        } else {
          console.error("Entities is not an array:", entities);
          setEntityList([]);
          setError("Failed to load entities data");
          setIsLoading(false);
        }
      }, 0);
    } catch (error) {
      console.error("Error loading entities:", error);
      setEntityList([]);
      setError("An error occurred while loading entities");
      setIsLoading(false);
    }
  }, []);

  const handleSelectEntity = (currentValue: string) => {
    setValue(currentValue);
    setOpen(false);
    navigate(`/export/${currentValue}`);
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
        <p className="text-red-500">{error}</p>
        <Button 
          className="mt-4" 
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
            </PopoverContent>
          </Popover>
        ) : (
          <div className="text-center p-4 border rounded-md">
            <p>No entities available for export.</p>
          </div>
        )}
        
        {/* Display entity cards after loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {entityList.map(entity => (
            <EntityCard key={entity.id} entity={entity} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Export;
