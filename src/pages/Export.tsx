
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
  // Initialize with empty array and then set with entities to avoid undefined errors
  const [entityList, setEntityList] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load entities safely
  useEffect(() => {
    try {
      if (entities && Array.isArray(entities)) {
        setEntityList(entities);
      } else {
        console.error("Entities is not an array:", entities);
        // Fallback to empty array if entities is undefined or not an array
        setEntityList([]);
      }
    } catch (error) {
      console.error("Error loading entities:", error);
      setEntityList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Don't render the command component until entities are loaded
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <p>Loading entities...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-2xl space-y-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-center">Custom Data Export</h1>
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {value && entityList.length > 0
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
                {entityList && entityList.length > 0 ? (
                  entityList.map((entity) => (
                    <CommandItem
                      key={entity.id}
                      value={entity.id}
                      onSelect={(currentValue) => {
                        setValue(currentValue);
                        setOpen(false);
                        navigate(`/export/${currentValue}`);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === entity.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {entity.name}
                    </CommandItem>
                  ))
                ) : (
                  <CommandItem disabled>No entities available</CommandItem>
                )}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Export;
