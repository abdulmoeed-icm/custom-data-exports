
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { FieldList } from "@/components/export/FieldList";
import { SelectedFields } from "@/components/export/SelectedFields";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

type EntityField = Tables<'entity_fields'>;
type SelectedField = EntityField & { displayLabel?: string };

const ExportEntity = () => {
  const { entityId } = useParams<{ entityId: string }>();
  const [selectedFields, setSelectedFields] = useState<SelectedField[]>([]);

  const { data: fields = [] } = useQuery({
    queryKey: ['entityFields', entityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entity_fields')
        .select('*')
        .eq('entity_id', entityId)
        .order('name');
      
      if (error) throw error;
      return data as EntityField[];
    },
  });

  const handleFieldSelect = (field: EntityField, checked: boolean) => {
    if (checked) {
      setSelectedFields(prev => [...prev, field]);
    } else {
      setSelectedFields(prev => prev.filter(f => f.id !== field.id));
    }
  };

  const handleLabelChange = (fieldId: string, newLabel: string) => {
    setSelectedFields(prev =>
      prev.map(field =>
        field.id === fieldId
          ? { ...field, displayLabel: newLabel }
          : field
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-4rem)]">
      <div className="h-full flex flex-col">
        <ResizablePanelGroup direction="horizontal" className="flex-grow">
          <ResizablePanel defaultSize={50}>
            <div className="h-full p-6 border-r">
              <h2 className="text-lg font-semibold mb-4">All Fields</h2>
              <FieldList
                fields={fields}
                onFieldSelect={handleFieldSelect}
              />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={50}>
            <div className="h-full p-6">
              <h2 className="text-lg font-semibold mb-4">Selected Columns</h2>
              <SelectedFields
                fields={selectedFields}
                onLabelChange={handleLabelChange}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        <div className="border-t mt-4 p-4 flex justify-end">
          <Button
            disabled={selectedFields.length === 0}
            className="min-w-[200px]"
          >
            Preview & Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportEntity;
