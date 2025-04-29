import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import ExcelJS from 'exceljs';
import { XMLBuilder } from 'fast-xml-parser';

export type ExportColumn = {
  id: string;
  label: string;
};

export type ExportFormat = 'csv' | 'xlsx' | 'xml' | 'pdf' | 'json';

export async function exportData(
  entityId: string,
  columns: ExportColumn[],
  format: ExportFormat
): Promise<void> {
  try {
    // 1. Fetch data based on entity type
    let data: any[] = [];
    
    try {
      // Try to fetch entity-specific data
      const response = await fetch(`/src/data/${entityId}-data.json`);
      if (response.ok) {
        data = await response.json();
      } else {
        throw new Error(`Failed to fetch data for entity: ${entityId}`);
      }
    } catch (error) {
      console.error(`Error fetching ${entityId} data:`, error);
      // Fallback to generate sample data
      data = generateSampleData(entityId, columns, 10);
    }
    
    // 2. Limit to max 10,000 rows for demo purposes
    data = data.slice(0, 10000);
    
    // 3. Format and prepare data for export
    // Map data to only include selected columns with their custom labels
    const formattedData = data.map((row: Record<string, any>) => {
      const newRow: Record<string, any> = {};
      columns.forEach((column) => {
        newRow[column.label] = row[column.id] !== undefined ? row[column.id] : '';
      });
      return newRow;
    });

    // 4. Generate file based on format and trigger download
    switch (format) {
      case 'csv':
        return exportCSV(formattedData, `${entityId}-export`);
      case 'xlsx':
        return exportExcel(formattedData, `${entityId}-export`);
      case 'xml':
        return exportXML(formattedData, `${entityId}-export`);
      case 'pdf':
        return exportPDF(formattedData, `${entityId}-export`);
      case 'json':
        return exportJSON(formattedData, `${entityId}-export`);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
}

// Helper function to generate sample data if no JSON file is found
function generateSampleData(entityId: string, columns: ExportColumn[], count: number): any[] {
  const data: Record<string, any>[] = [];
  
  for (let i = 0; i < count; i++) {
    const item: Record<string, any> = {};
    
    columns.forEach(column => {
      const columnId = column.id;
      
      if (columnId.includes('date') || columnId.includes('_date')) {
        // Generate a random date in the past year
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 365));
        item[columnId] = date.toISOString().split('T')[0];
      }
      else if (columnId.includes('time')) {
        // Generate a random timestamp
        const date = new Date();
        date.setHours(date.getHours() - Math.floor(Math.random() * 48));
        item[columnId] = date.toISOString();
      }
      else if (columnId.includes('id')) {
        // Generate an ID
        item[columnId] = `${entityId.charAt(0).toUpperCase()}${i + 1000}`;
      }
      else if (columnId === 'score' || columnId.includes('duration') || columnId.includes('amount')) {
        // Generate a number
        item[columnId] = Math.floor(Math.random() * 100);
      }
      else if (columnId.includes('status')) {
        // Generate a status
        const statuses = ['Active', 'Inactive', 'Pending', 'Completed'];
        item[columnId] = statuses[Math.floor(Math.random() * statuses.length)];
      }
      else {
        // Generate a generic string
        item[columnId] = `Sample ${columnId} ${i + 1}`;
      }
    });
    
    data.push(item);
  }
  
  return data;
}

function exportCSV(data: Record<string, any>[], filename: string): void {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
}

async function exportExcel(data: Record<string, any>[], filename: string): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Export Data');

  // Add headers
  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);
  }

  // Add data rows
  data.forEach(row => {
    worksheet.addRow(Object.values(row));
  });

  // Style headers
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${filename}.xlsx`);
}

function exportXML(data: Record<string, any>[], filename: string): void {
  const xmlObj = {
    export: {
      row: data
    }
  };

  const builder = new XMLBuilder({
    format: true,
    ignoreAttributes: false
  });
  
  const xmlContent = builder.build(xmlObj);
  const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
  saveAs(blob, `${filename}.xml`);
}

function exportJSON(data: Record<string, any>[], filename: string): void {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  saveAs(blob, `${filename}.json`);
}

function exportPDF(data: Record<string, any>[], filename: string): void {
  // For PDF, we'll use a simple approach by creating a hidden HTML table
  // and using the browser's print functionality to save as PDF
  
  // Create a temporary element to hold our data table
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("Please allow popups for PDF export functionality");
    return;
  }
  
  // Generate table HTML
  let tableHTML = `
    <html>
    <head>
      <title>${filename}</title>
      <style>
        body { font-family: sans-serif; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <h2>${filename}</h2>
      <table>
        <thead>
          <tr>
  `;
  
  // Add headers
  if (data.length > 0) {
    Object.keys(data[0]).forEach(header => {
      tableHTML += `<th>${header}</th>`;
    });
  }
  
  tableHTML += `
          </tr>
        </thead>
        <tbody>
  `;
  
  // Add rows
  data.forEach(row => {
    tableHTML += '<tr>';
    Object.values(row).forEach(cell => {
      tableHTML += `<td>${cell}</td>`;
    });
    tableHTML += '</tr>';
  });
  
  tableHTML += `
        </tbody>
      </table>
    </body>
    </html>
  `;
  
  printWindow.document.write(tableHTML);
  printWindow.document.close();
  
  setTimeout(() => {
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
  }, 500);
}
