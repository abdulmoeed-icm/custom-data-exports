
import React from 'react';
import { Header } from '@/components/layout/header';
import { EntityCard } from '@/components/export/entity-card';
import { entities } from '@/data/entities';

const Export = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Select an Entity to Export</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {entities.map(entity => (
              <EntityCard key={entity.id} entity={entity} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Export;
