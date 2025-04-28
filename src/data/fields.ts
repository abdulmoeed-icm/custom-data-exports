
export interface Field {
  id: string;
  label: string;
  type: "string" | "int" | "datetime" | "date" | "boolean";
  description?: string;
}

export const fields: Record<string, Field[]> = {
  "time-entry": [
    { id: "start_time", label: "Start Time", type: "datetime", description: "When the activity started" },
    { id: "end_time", label: "End Time", type: "datetime", description: "When the activity ended" },
    { id: "duration", label: "Duration (mins)", type: "int", description: "Total minutes spent" },
    { id: "staff_name", label: "Staff Name", type: "string", description: "Name of staff member" },
    { id: "program", label: "Program", type: "string", description: "Program or service category" }
  ],
  "individuals": [
    { id: "client_id", label: "Client ID", type: "string", description: "Unique identifier" },
    { id: "first_name", label: "First Name", type: "string", description: "Client's first name" },
    { id: "last_name", label: "Last Name", type: "string", description: "Client's last name" },
    { id: "date_of_birth", label: "Date of Birth", type: "date", description: "Client's birth date" },
    { id: "enrollment_date", label: "Enrollment Date", type: "date", description: "Program enrollment date" },
    { id: "status", label: "Status", type: "string", description: "Active/inactive status" }
  ],
  "staff": [
    { id: "employee_id", label: "Employee ID", type: "string", description: "Unique identifier" },
    { id: "first_name", label: "First Name", type: "string", description: "Staff member's first name" },
    { id: "last_name", label: "Last Name", type: "string", description: "Staff member's last name" },
    { id: "position", label: "Position", type: "string", description: "Job title or position" },
    { id: "hire_date", label: "Hire Date", type: "date", description: "Employment start date" },
    { id: "certification", label: "Certification", type: "string", description: "Professional certifications" }
  ],
  "trainings": [
    { id: "training_id", label: "Training ID", type: "string", description: "Unique identifier" },
    { id: "employee_id", label: "Employee ID", type: "string", description: "Staff member reference" },
    { id: "training_name", label: "Training Name", type: "string", description: "Name of training course" },
    { id: "completion_date", label: "Completion Date", type: "date", description: "Date training was completed" },
    { id: "expiry_date", label: "Expiry Date", type: "date", description: "Date certification expires" },
    { id: "status", label: "Status", type: "string", description: "Current status" }
  ],
  "assessments": [
    { id: "assessment_id", label: "Assessment ID", type: "string", description: "Unique identifier" },
    { id: "client_id", label: "Client ID", type: "string", description: "Client reference" },
    { id: "assessment_type", label: "Assessment Type", type: "string", description: "Type of assessment" },
    { id: "assessment_date", label: "Assessment Date", type: "date", description: "Date assessment conducted" },
    { id: "assessor_name", label: "Assessor Name", type: "string", description: "Name of assessor" },
    { id: "score", label: "Score", type: "int", description: "Assessment score" }
  ]
};
