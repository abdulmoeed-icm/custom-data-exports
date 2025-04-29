
import React from 'react';
import { Button } from "@/components/ui/button";
import { Entity } from '@/data/entities';

interface ExportButtonProps {
  selectedEntities: Entity[];
  onExport: () => void;
}

export const ExportButton = ({ selectedEntities, onExport }: ExportButtonProps) => {
  if (selectedEntities.length === 0) return null;
  
  return (
    <Button 
      className="w-full mt-4" 
      onClick={onExport}
    >
      {selectedEntities.length === 1 
        ? `Export ${selectedEntities[0].name}`
        : `Export ${selectedEntities.length} Selected Entities`
      }
    </Button>
  );
};
