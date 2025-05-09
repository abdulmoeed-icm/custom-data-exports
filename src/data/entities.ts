
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
    id: "trainings",
    name: "Staff Trainings",
    description: "Employee training and certification records"
  },
  {
    id: "assessments",
    name: "Individual Assessments",
    description: "Client assessment and evaluation records"
  }
];

export default entities;
