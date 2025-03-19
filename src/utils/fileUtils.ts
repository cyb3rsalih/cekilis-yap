// Import xlsx library
import * as XLSX from 'xlsx';

export const readFileContent = async (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content.split('\n').filter(line => line.trim());
      resolve(lines);
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const removeDuplicates = (lines: string[]): string[] => {
  // For multi-column data (tab-separated), we need to check the first column for duplicates
  const seen = new Set<string>();
  const result: string[] = [];

  for (const line of lines) {
    // If it's a tab-separated line, extract the first column for duplicate check
    const firstColumn = line.includes('\t') ? line.split('\t')[0] : line;

    // Only add if we haven't seen this identifier before
    if (!seen.has(firstColumn)) {
      seen.add(firstColumn);
      result.push(line);
    }
  }

  return result;
};

export const parseCSV = async (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      resolve(lines);
    };

    reader.onerror = () => reject(new Error('Failed to read CSV file'));
    reader.readAsText(file);
  });
};

// New function to parse both CSV and Excel files using xlsx library
export const parseSpreadsheet = async (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Get the first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1 });

        // Format each row as a string with comma-separated values
        const lines: string[] = jsonData
          .filter(row => Array.isArray(row) && row.length > 0)
          .map(row => {
            // Convert all values to strings and join with commas or tabs
            return row.map((cell: any) =>
              cell !== null && cell !== undefined ? String(cell).trim() : ""
            ).join('\t');
          })
          .filter(line => line.length > 0);

        resolve(lines);
      } catch (error) {
        reject(new Error('Failed to parse spreadsheet file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};