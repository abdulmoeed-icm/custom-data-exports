
import { useState, useEffect } from 'react';
import { generateId } from '@/lib/utils';
import { ExportColumn } from '@/lib/export-utils';

export interface Template {
  id: string;
  name: string;
  entityId: string;
  columns: ExportColumn[];
  createdAt: string;
}

const STORAGE_KEY = 'export-templates';

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    // Load templates from localStorage on component mount
    const loadTemplates = () => {
      const savedTemplates = localStorage.getItem(STORAGE_KEY);
      if (savedTemplates) {
        try {
          setTemplates(JSON.parse(savedTemplates));
        } catch (e) {
          console.error('Error parsing templates from localStorage', e);
          setTemplates([]);
        }
      }
    };

    loadTemplates();
  }, []);

  const saveTemplate = (name: string, entityId: string, columns: ExportColumn[]) => {
    const newTemplate: Template = {
      id: generateId(),
      name,
      entityId,
      columns,
      createdAt: new Date().toISOString(),
    };

    const updatedTemplates = [newTemplate, ...templates];
    setTemplates(updatedTemplates);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates));
    
    return newTemplate;
  };

  const deleteTemplate = (id: string) => {
    const updatedTemplates = templates.filter(template => template.id !== id);
    setTemplates(updatedTemplates);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates));
  };

  const getTemplatesByEntityId = (entityId: string) => {
    return templates.filter(template => template.entityId === entityId);
  };

  return {
    templates,
    saveTemplate,
    deleteTemplate,
    getTemplatesByEntityId
  };
}
