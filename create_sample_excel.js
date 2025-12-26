import * as XLSX from "xlsx";

// Sample Data
const data = [
  { ID: "EMP001", Name: "Nguyen Van A", Department: "IT" },
  { ID: "EMP002", Name: "Tran Thi B", Department: "HR" },
  { ID: "EMP003", Name: "Le Van C", Department: "Sales" },
];

// Create Workbook
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(data);

// Add sheet
XLSX.utils.book_append_sheet(wb, ws, "Employees");

// Write to file
XLSX.writeFile(wb, "sample_data.xlsx");

console.log("sample_data.xlsx has been created!");
