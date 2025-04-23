
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';

import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface Entity {
  id: string;
  name: string;
}

const Export = () => {
  const [open, setOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const navigate = useNavigate();

  // Fetch entities from Supabase
  const { data: entities = [], isLoading } = useQuery({
    queryKey: ['entities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entities')
        .select('id, name')
        .order('name');
      
      if (error) {
        console.error('Error fetching entities:', error);
        return [];
      }
      return data as Entity[];
    }
  });

  const handleEntitySelect = (entity: Entity) => {
    setSelectedEntity(entity);
    setOpen(false);
    // Navigate to the dynamic export page for the selected entity
    navigate(`/export/${entity.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Custom Data Export</h1>
      
      <div className="max-w-md">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              role="combobox" 
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selectedEntity 
                ? selectedEntity.name 
                : "Select an entity to export..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput 
                placeholder="Search entities..." 
                className="h-9"
              />
              <CommandList>
                {isLoading ? (
                  <CommandEmpty>Loading entities...</CommandEmpty>
                ) : entities.length === 0 ? (
                  <CommandEmpty>No entities found.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {entities.map((entity) => (
                      <CommandItem
                        key={entity.id}
                        value={entity.name}
                        onSelect={() => handleEntitySelect(entity)}
                      >
                        {entity.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Export;
