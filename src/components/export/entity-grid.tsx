
import React from 'react';
import { Entity } from '@/data/entities';
import { EntityCard } from '@/components/export/entity-card';

interface EntityGridProps {
  entities: Entity[];
  selectedEntities: Entity[];
  onToggleSelect: (entityId: string) => void;
}

export const EntityGrid = ({ 
  entities, 
  selectedEntities, 
  onToggleSelect 
}: EntityGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      {entities.map(entity => (
        <EntityCard 
          key={entity.id} 
          entity={entity} 
          isSelected={selectedEntities.some(e => e.id === entity.id)}
          onToggleSelect={() => onToggleSelect(entity.id)}
        />
      ))}
    </div>
  );
};
