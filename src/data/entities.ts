
export interface Entity {
  id: string;
  name: string;
  description: string;
}

// Define the entities array with consistent structure
export const entities: Entity[] = [
  {
    id: "time-entry",
    name: "Time Entry",
    description: "Records of time spent on tasks and activities"
  },
  {
    id: "staff",
    name: "Staff",
    description: "Personnel and employee information"
  },
  {
    id: "individuals",
    name: "Individuals",
    description: "Client and recipient data"
  },
  {
    id: "programs",
    name: "Programs",
    description: "Service programs and initiatives"
  },
  {
    id: "billing",
    name: "Billing",
    description: "Invoice and payment records"
  }
];

// Add additional entities from entities.json file if needed
// This ensures backward compatibility
export default entities;
