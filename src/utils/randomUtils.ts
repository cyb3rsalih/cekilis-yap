export const generateRandomNumbers = (min: number, max: number, quantity: number): number[] => {
  const result = new Set<number>();
  while (result.size < quantity) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    result.add(num);
  }
  return Array.from(result);
};

export const selectRandomLines = (lines: string[], quantity: number): string[] => {
  const indices = generateRandomNumbers(0, lines.length - 1, quantity);
  return indices.map(index => lines[index]);
};