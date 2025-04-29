
import React from 'react';
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Entity } from '@/data/entities';

interface SelectedEntityBadgesProps {
  selectedEntities: Entity[];
  onRemoveEntity: (entityId: string) => void;
}

export const SelectedEntityBadges = ({ 
  selectedEntities, 
  onRemoveEntity 
}: SelectedEntityBadgesProps) => {
  if (selectedEntities.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {selectedEntities.map(entity => (
        <Badge key={entity.id} variant="secondary" className="flex items-center gap-1">
          {entity.name}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-4 w-4 p-0"
            onClick={() => onRemoveEntity(entity.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
    </div>
  );
};
