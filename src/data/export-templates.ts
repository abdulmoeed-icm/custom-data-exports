
export interface ExportTemplate {
  id: string;
  name: string;
  entityId: string;
  fields: Array<{
    id: string;
    displayName: string;
  }>;
  createdAt: Date;
}

export const exportTemplates: ExportTemplate[] = [
  {
    id: "template1",
    name: "Basic Time Entry",
    entityId: "time-entry",
    fields: [
      { id: "start_time", displayName: "Start" },
      { id: "end_time", displayName: "End" },
      { id: "duration", displayName: "Duration" }
    ],
    createdAt: new Date("2024-03-15")
  },
  {
    id: "template2",
    name: "Staff Summary",
    entityId: "staff",
    fields: [
      { id: "employee_id", displayName: "ID" },
      { id: "first_name", displayName: "First Name" },
      { id: "last_name", displayName: "Last Name" },
      { id: "position", displayName: "Role" }
    ],
    createdAt: new Date("2024-03-10")
  },
  {
    id: "template3",
    name: "Individual Overview",
    entityId: "individuals",
    fields: [
      { id: "client_id", displayName: "Client ID" },
      { id: "first_name", displayName: "First" },
      { id: "last_name", displayName: "Last" },
      { id: "enrollment_date", displayName: "Since" }
    ],
    createdAt: new Date("2024-04-01")
  }
];
