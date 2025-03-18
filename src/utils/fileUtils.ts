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
  return [...new Set(lines)];
};

export const parseCSV = async (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content
        .split('\n')
        .map(line => line.split(',')[0]) // Take first column
        .filter(line => line.trim());
      resolve(lines);
    };

    reader.onerror = () => reject(new Error('Failed to read CSV file'));
    reader.readAsText(file);
  });
};