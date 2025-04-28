
export interface Entity {
  id: string;
  name: string;
  description?: string;
}

export const entities: Entity[] = [
  { id: "time-entry", name: "Time Entry", description: "Track time spent on activities" },
  { id: "individuals", name: "Individuals", description: "Client or participant information" },
  { id: "staff", name: "Staff", description: "Staff member details" },
  { id: "trainings", name: "Staff Trainings", description: "Training records for staff" },
  { id: "assessments", name: "Individual Assessments", description: "Assessment records for clients" }
];
