export interface FormData {
  min: number;
  max: number;
  quantity: number;
  file: File | null;
  lineCount: number;
  removeDuplicates: boolean;
  inputMode: 'file' | 'paste';
  pastedContent: string[];
}

export interface GeneratedResult {
  type: 'numbers' | 'lines';
  data: string[];
}