export interface FormData {
  min: number;
  max: number;
  quantity: number;
  file: File | null;
  lineCount: number;
}

export interface GeneratedResult {
  type: 'numbers' | 'lines';
  data: string[];
}