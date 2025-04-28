
export interface Field {
  id: string;
  entityId: string;
  name: string;
  type: "string" | "number" | "date" | "boolean" | "object";
  description: string;
}

export const fields: Record<string, Field[]> = {
  "1": [ // Customers
    { id: "c1", entityId: "1", name: "id", type: "string", description: "Customer unique identifier" },
    { id: "c2", entityId: "1", name: "first_name", type: "string", description: "Customer first name" },
    { id: "c3", entityId: "1", name: "last_name", type: "string", description: "Customer last name" },
    { id: "c4", entityId: "1", name: "email", type: "string", description: "Customer email address" },
    { id: "c5", entityId: "1", name: "phone", type: "string", description: "Customer phone number" },
    { id: "c6", entityId: "1", name: "created_at", type: "date", description: "Customer creation date" },
    { id: "c7", entityId: "1", name: "updated_at", type: "date", description: "Customer last update date" },
    { id: "c8", entityId: "1", name: "is_active", type: "boolean", description: "Customer status" },
    { id: "c9", entityId: "1", name: "address", type: "object", description: "Customer address" }
  ],
  "2": [ // Orders
    { id: "o1", entityId: "2", name: "id", type: "string", description: "Order unique identifier" },
    { id: "o2", entityId: "2", name: "customer_id", type: "string", description: "Customer who placed the order" },
    { id: "o3", entityId: "2", name: "order_date", type: "date", description: "Date when order was placed" },
    { id: "o4", entityId: "2", name: "total_amount", type: "number", description: "Total order amount" },
    { id: "o5", entityId: "2", name: "status", type: "string", description: "Order status" },
    { id: "o6", entityId: "2", name: "payment_method", type: "string", description: "Payment method used" },
    { id: "o7", entityId: "2", name: "shipping_address", type: "object", description: "Shipping address" },
    { id: "o8", entityId: "2", name: "is_paid", type: "boolean", description: "Payment status" }
  ],
  "3": [ // Products
    { id: "p1", entityId: "3", name: "id", type: "string", description: "Product unique identifier" },
    { id: "p2", entityId: "3", name: "name", type: "string", description: "Product name" },
    { id: "p3", entityId: "3", name: "description", type: "string", description: "Product description" },
    { id: "p4", entityId: "3", name: "price", type: "number", description: "Product price" },
    { id: "p5", entityId: "3", name: "stock_quantity", type: "number", description: "Available stock" },
    { id: "p6", entityId: "3", name: "category", type: "string", description: "Product category" },
    { id: "p7", entityId: "3", name: "is_featured", type: "boolean", description: "Featured product status" },
    { id: "p8", entityId: "3", name: "created_at", type: "date", description: "Product creation date" }
  ],
  "4": [ // Employees
    { id: "e1", entityId: "4", name: "id", type: "string", description: "Employee unique identifier" },
    { id: "e2", entityId: "4", name: "first_name", type: "string", description: "Employee first name" },
    { id: "e3", entityId: "4", name: "last_name", type: "string", description: "Employee last name" },
    { id: "e4", entityId: "4", name: "email", type: "string", description: "Employee email address" },
    { id: "e5", entityId: "4", name: "hire_date", type: "date", description: "Employee hire date" },
    { id: "e6", entityId: "4", name: "position", type: "string", description: "Employee position" },
    { id: "e7", entityId: "4", name: "salary", type: "number", description: "Employee salary" },
    { id: "e8", entityId: "4", name: "is_active", type: "boolean", description: "Employee status" }
  ],
  "5": [ // Suppliers
    { id: "s1", entityId: "5", name: "id", type: "string", description: "Supplier unique identifier" },
    { id: "s2", entityId: "5", name: "company_name", type: "string", description: "Supplier company name" },
    { id: "s3", entityId: "5", name: "contact_name", type: "string", description: "Supplier contact person" },
    { id: "s4", entityId: "5", name: "email", type: "string", description: "Supplier email address" },
    { id: "s5", entityId: "5", name: "phone", type: "string", description: "Supplier phone number" },
    { id: "s6", entityId: "5", name: "address", type: "object", description: "Supplier address" },
    { id: "s7", entityId: "5", name: "is_active", type: "boolean", description: "Supplier status" }
  ]
};
