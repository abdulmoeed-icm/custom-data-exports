
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Entity } from "@/data/entities";

interface EntityCardProps {
  entity: Entity;
}

export const EntityCard = ({ entity }: EntityCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{entity.name}</CardTitle>
        <CardDescription>{entity.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-end">
        <Link to={`/export/${entity.id}`}>
          <Button>Select Fields</Button>
        </Link>
      </CardContent>
    </Card>
  );
};
