
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
    id: "t1",
    name: "Basic Customer List",
    entityId: "1",
    fields: [
      { id: "c1", displayName: "ID" },
      { id: "c2", displayName: "First Name" },
      { id: "c3", displayName: "Last Name" },
      { id: "c4", displayName: "Email" }
    ],
    createdAt: new Date("2023-01-15")
  },
  {
    id: "t2",
    name: "Order Summary",
    entityId: "2",
    fields: [
      { id: "o1", displayName: "Order ID" },
      { id: "o2", displayName: "Customer" },
      { id: "o3", displayName: "Date" },
      { id: "o4", displayName: "Amount" },
      { id: "o5", displayName: "Status" }
    ],
    createdAt: new Date("2023-02-10")
  },
  {
    id: "t3",
    name: "Product Inventory",
    entityId: "3",
    fields: [
      { id: "p1", displayName: "Product ID" },
      { id: "p2", displayName: "Product Name" },
      { id: "p5", displayName: "Stock" },
      { id: "p4", displayName: "Price" },
      { id: "p6", displayName: "Category" }
    ],
    createdAt: new Date("2023-03-05")
  }
];
