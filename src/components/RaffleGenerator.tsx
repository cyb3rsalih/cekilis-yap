import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { FileInput } from './FileInput';
import { NumberInputs } from './NumberInputs';
import { Results } from './Results';
import { FormData, GeneratedResult } from '../types';
import { readFileContent, removeDuplicates, parseCSV, parseSpreadsheet } from '../utils/fileUtils';
import { generateRandomNumbers, selectRandomLines } from '../utils/randomUtils';

export function RaffleGenerator() {
  const [formData, setFormData] = useState<FormData>({
    min: 1,
    max: 100,
    quantity: 1,
    file: null,
    lineCount: 1,
    removeDuplicates: false,
    inputMode: 'file',
    pastedContent: []
  });

  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleNumberChange = (name: string, value: number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, file }));
    setError(null);
  };

  const handleLineCountChange = (lineCount: number) => {
    setFormData(prev => ({ ...prev, lineCount }));
    setError(null);
  };

  const handleToggleDuplicates = (value: boolean) => {
    setFormData(prev => ({ ...prev, removeDuplicates: value }));
    setError(null);
  };

  const handleInputModeChange = (mode: 'file' | 'paste') => {
    setFormData(prev => ({ ...prev, inputMode: mode }));
    setError(null);
  };

  const handlePastedContent = (content: string[]) => {
    setFormData(prev => ({ ...prev, pastedContent: content }));
    setError(null);
  };

  const validateForm = async (): Promise<boolean> => {
    if (formData.inputMode === 'file' && formData.file) {
      let lines: string[] = [];

      if (formData.file.name.endsWith('.csv') || formData.file.name.endsWith('.xls') || formData.file.name.endsWith('.xlsx')) {
        try {
          lines = await parseSpreadsheet(formData.file);
        } catch (error) {
          setError('Dosya okunamadı veya doğru formatta değil');
          return false;
        }
      } else {
        lines = await readFileContent(formData.file);
      }

      if (formData.removeDuplicates) {
        lines = removeDuplicates(lines);
      }

      if (formData.lineCount > lines.length) {
        setError(`Dosyada sadece ${lines.length} satır var${formData.removeDuplicates ? ' (tekrarlar temizlendikten sonra)' : ''}`);
        return false;
      }

      if (formData.lineCount < 1) {
        setError('En az bir kazanan seçmelisiniz');
        return false;
      }
    } else if (formData.inputMode === 'paste') {
      let lines = [...formData.pastedContent];

      if (formData.removeDuplicates) {
        lines = removeDuplicates(lines);
      }

      if (lines.length === 0) {
        setError('Lütfen bir liste yapıştırın');
        return false;
      }

      if (formData.lineCount > lines.length) {
        setError(`Yapıştırılan listede sadece ${lines.length} satır var${formData.removeDuplicates ? ' (tekrarlar temizlendikten sonra)' : ''}`);
        return false;
      }

      if (formData.lineCount < 1) {
        setError('En az bir kazanan seçmelisiniz');
        return false;
      }
    } else {
      if (formData.min >= formData.max) {
        setError('Minimum numara maksimumdan küçük olmalıdır');
        return false;
      }

      const range = formData.max - formData.min + 1;
      if (formData.quantity > range) {
        setError('Mevcut aralıktan daha fazla sayıda numara üretilemez');
        return false;
      }

      if (formData.quantity < 1) {
        setError('En az bir numara seçmelisiniz');
        return false;
      }
    }
    return true;
  };

  const generateResults = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!await validateForm()) return;

    setLoading(true);
    setError(null);
    setCopied(false);

    try {
      setTimeout(async () => {
        if (formData.inputMode === 'file' && formData.file) {
          let lines: string[] = [];

          if (formData.file.name.endsWith('.csv') || formData.file.name.endsWith('.xls') || formData.file.name.endsWith('.xlsx')) {
            lines = await parseSpreadsheet(formData.file);
          } else {
            lines = await readFileContent(formData.file);
          }

          if (formData.removeDuplicates) {
            lines = removeDuplicates(lines);
          }

          const selectedLines = selectRandomLines(lines, formData.lineCount);
          setResult({ type: 'lines', data: selectedLines });
        } else if (formData.inputMode === 'paste') {
          let lines = [...formData.pastedContent];

          if (formData.removeDuplicates) {
            lines = removeDuplicates(lines);
          }

          const selectedLines = selectRandomLines(lines, formData.lineCount);
          setResult({ type: 'lines', data: selectedLines });
        } else {
          const numbers = generateRandomNumbers(formData.min, formData.max, formData.quantity);
          setResult({ type: 'numbers', data: numbers.map(String) });
        }
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Sonuçlar oluşturulurken bir hata oluştu');
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.data.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Panoya kopyalanamadı');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Çekiliş Sistemi</h2>

              <form onSubmit={generateResults}>
                <FileInput
                  onFileChange={handleFileChange}
                  onLineCountChange={handleLineCountChange}
                  lineCount={formData.lineCount}
                  removeDuplicates={formData.removeDuplicates}
                  onToggleDuplicates={handleToggleDuplicates}
                  inputMode={formData.inputMode}
                  onInputModeChange={handleInputModeChange}
                  onPastedContent={handlePastedContent}
                />

                {formData.inputMode !== 'file' && formData.inputMode !== 'paste' && (
                  <NumberInputs
                    min={formData.min}
                    max={formData.max}
                    quantity={formData.quantity}
                    onChange={handleNumberChange}
                  />
                )}

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="animate-spin me-2" size={20} />
                      Oluşturuyor...
                    </>
                  ) : (
                    'Çekilişi Başlat'
                  )}
                </button>
              </form>

              {result && !loading && (
                <Results
                  result={result}
                  onCopy={copyToClipboard}
                  copied={copied}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}