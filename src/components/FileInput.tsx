import React, { useState } from 'react';

interface FileInputProps {
  onFileChange: (file: File | null) => void;
  onLineCountChange: (count: number) => void;
  onInputModeChange: (mode: 'file' | 'paste') => void;
  onPastedContent: (content: string[]) => void;
  lineCount: number;
  removeDuplicates: boolean;
  onToggleDuplicates: (value: boolean) => void;
  inputMode: 'file' | 'paste';
}

export function FileInput({
  onFileChange,
  onLineCountChange,
  lineCount,
  removeDuplicates,
  onToggleDuplicates,
  inputMode,
  onInputModeChange,
  onPastedContent
}: FileInputProps) {
  const [pasteContent, setPasteContent] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileChange(file);
  };

  const handlePasteContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setPasteContent(content);

    const lines = content.split('\n').filter(line => line.trim());
    onPastedContent(lines);
  };

  return (
    <div className="border rounded p-3 mb-4 bg-light">
      <div className="mb-3">
        <div className="btn-group w-100 mb-3" role="group">
          <input
            type="radio"
            className="btn-check"
            name="inputMode"
            id="fileMode"
            autoComplete="off"
            checked={inputMode === 'file'}
            onChange={() => onInputModeChange('file')}
          />
          <label className="btn btn-outline-primary" htmlFor="fileMode">Dosya Yükle</label>

          <input
            type="radio"
            className="btn-check"
            name="inputMode"
            id="pasteMode"
            autoComplete="off"
            checked={inputMode === 'paste'}
            onChange={() => onInputModeChange('paste')}
          />
          <label className="btn btn-outline-primary" htmlFor="pasteMode">Listeyi Yapıştır</label>
        </div>

        {inputMode === 'file' ? (
          <>
            <label htmlFor="file" className="form-label">Dosya Seçin</label>
            <input
              type="file"
              className="form-control"
              id="file"
              accept=".txt,.csv,.xls,.xlsx"
              onChange={handleFileChange}
            />
            <small className="text-muted">TXT, CSV veya Excel dosyası yükleyin</small>
          </>
        ) : (
          <>
            <label htmlFor="pasteArea" className="form-label">Listeyi Buraya Yapıştırın</label>
            <textarea
              className="form-control"
              id="pasteArea"
              rows={5}
              value={pasteContent}
              onChange={handlePasteContent}
              placeholder="Her satıra bir değer gelecek şekilde yapıştırın"
            ></textarea>
          </>
        )}
      </div>

      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="removeDuplicates"
          checked={removeDuplicates}
          onChange={(e) => onToggleDuplicates(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="removeDuplicates">
          Tekrarlanan değerleri temizle
        </label>
      </div>

      <div className="mb-0">
        <label htmlFor="lineCount" className="form-label">Kaç Kazanan Seçilecek?</label>
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