
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Entity } from "@/data/entities";
import { Check, Plus } from 'lucide-react';

interface EntityCardProps {
  entity: Entity;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export const EntityCard = ({ entity, isSelected = false, onToggleSelect }: EntityCardProps) => {
  // Function to determine badge variant based on entity type
  const getBadgeVariant = (entityId: string) => {
    switch (entityId) {
      case 'time-entry':
        return 'default';
      case 'staff':
        return 'secondary';
      case 'individuals':
        return 'outline';
      case 'trainings':
        return 'destructive';
      case 'assessments':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Card className={`h-full transition-all ${isSelected ? 'border-primary' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{entity.name}</CardTitle>
          <Badge variant={getBadgeVariant(entity.id)}>{entity.id}</Badge>
        </div>
        <CardDescription>{entity.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-end gap-2">
        {onToggleSelect && (
          <Button 
            variant={isSelected ? "secondary" : "outline"} 
            onClick={onToggleSelect}
            className="flex items-center gap-1"
          >
            {isSelected ? (
              <>
                <Check className="h-4 w-4" /> Selected
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Select
              </>
            )}
          </Button>
        )}
        <Link to={`/export/${entity.id}`}>
          <Button>Select Fields</Button>
        </Link>
      </CardContent>
    </Card>
  );
};
