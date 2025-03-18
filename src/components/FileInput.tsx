import React from 'react';

interface FileInputProps {
  onFileChange: (file: File | null) => void;
  onLineCountChange: (count: number) => void;
  lineCount: number;
}

export function FileInput({ onFileChange, onLineCountChange, lineCount }: FileInputProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileChange(file);
  };

  return (
    <div className="border rounded p-3 mb-4 bg-light">
      <div className="mb-3">
        <label htmlFor="file" className="form-label">Listeyi Yükle (İsteğe Bağlı)</label>
        <input
          type="file"
          className="form-control"
          id="file"
          accept=".txt"
          onChange={handleFileChange}
        />
        <small className="text-muted">Bir .txt dosyası yükleyin</small>
      </div>

      <div className="mb-0">
        <label htmlFor="lineCount" className="form-label">Kaç Numara Seçilecek?</label>
        <input
          type="number"
          className="form-control"
          id="lineCount"
          value={lineCount}
          onChange={(e) => onLineCountChange(parseInt(e.target.value) || 0)}
          min="1"
        />
      </div>
    </div>
  );
}