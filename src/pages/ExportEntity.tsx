
import React from 'react';
import { useParams } from 'react-router-dom';

const ExportEntity = () => {
  const { entityId } = useParams<{ entityId: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">
        Export for Entity ID: {entityId}
      </h1>
      {/* Future implementation of entity-specific export logic */}
    </div>
  );
};

export default ExportEntity;
