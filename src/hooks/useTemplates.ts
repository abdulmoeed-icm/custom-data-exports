
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

  // Load templates from localStorage on component mount
  useEffect(() => {
    const loadTemplates = () => {
      try {
        const savedTemplates = localStorage.getItem(STORAGE_KEY);
        if (savedTemplates) {
          const parsed = JSON.parse(savedTemplates);
          console.log('Loaded templates from storage:', parsed);
          setTemplates(parsed);
        } else {
          console.log('No templates found in storage');
        }
      } catch (e) {
        console.error('Error parsing templates from localStorage', e);
        setTemplates([]);
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
    
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates));
      console.log('Saved template:', newTemplate);
      console.log('Updated templates list:', updatedTemplates);
    } catch (e) {
      console.error('Error saving templates to localStorage', e);
    }
    
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
