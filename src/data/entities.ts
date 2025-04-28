
export interface Entity {
  id: string;
  name: string;
  description: string;
}

export const entities: Entity[] = [
  {
    id: "1",
    name: "Customers",
    description: "Customer records including contact information and metadata"
  },
  {
    id: "2",
    name: "Orders",
    description: "Order records with line items and shipping details"
  },
  {
    id: "3",
    name: "Products",
    description: "Product catalog with pricing and inventory information"
  },
  {
    id: "4",
    name: "Employees",
    description: "Employee records including personal details and roles"
  },
  {
    id: "5",
    name: "Suppliers",
    description: "Supplier information and purchase history"
  }
];
