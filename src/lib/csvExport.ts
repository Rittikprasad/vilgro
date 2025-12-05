/**
 * CSV Export utility functions
 * Provides functionality to convert data to CSV format and download as file
 */

/**
 * Escapes CSV field values to handle commas, quotes, and newlines
 */
const escapeCsvField = (value: string | number | boolean | null | undefined): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  
  // If the value contains comma, quote, or newline, wrap it in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
};

/**
 * Converts an array of objects to CSV string
 * @param data Array of objects to convert
 * @param headers Optional custom headers. If not provided, uses object keys from first item
 * @returns CSV string
 */
export const convertToCSV = <T extends Record<string, any>>(
  data: T[],
  headers?: { key: keyof T; label: string }[]
): string => {
  if (data.length === 0) {
    return '';
  }

  // If custom headers provided, use them; otherwise extract from first item
  const csvHeaders = headers || Object.keys(data[0]).map(key => ({ key, label: String(key) }));
  
  // Create header row
  const headerRow = csvHeaders.map(header => escapeCsvField(header.label)).join(',');
  
  // Create data rows
  const dataRows = data.map(row => {
    return csvHeaders.map(header => {
      const value = row[header.key];
      return escapeCsvField(value);
    }).join(',');
  });
  
  // Combine header and data rows
  return [headerRow, ...dataRows].join('\n');
};

/**
 * Downloads a CSV string as a file
 * @param csvContent CSV string content
 * @param filename Name of the file to download (without extension)
 */
export const downloadCSV = (csvContent: string, filename: string): void => {
  // Add BOM for UTF-8 to ensure proper display of special characters in Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
};

/**
 * Converts data to CSV and downloads it
 * @param data Array of objects to export
 * @param filename Name of the file to download (without extension)
 * @param headers Optional custom headers
 */
export const exportToCSV = <T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: { key: keyof T; label: string }[]
): void => {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }
  
  const csvContent = convertToCSV(data, headers);
  downloadCSV(csvContent, filename);
};

