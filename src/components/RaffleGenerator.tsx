import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { FileInput } from './FileInput';
import { NumberInputs } from './NumberInputs';
import { Results } from './Results';
import { FormData, GeneratedResult } from '../types';
import { readFileContent } from '../utils/fileUtils';
import { generateRandomNumbers, selectRandomLines } from '../utils/randomUtils';

export function RaffleGenerator() {
  const [formData, setFormData] = useState<FormData>({
    min: 1,
    max: 100,
    quantity: 1,
    file: null,
    lineCount: 1
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

  const validateForm = async (): Promise<boolean> => {
    if (formData.file) {
      const lines = await readFileContent(formData.file);
      if (formData.lineCount > lines.length) {
        setError(`File only contains ${lines.length} lines`);
        return false;
      }
      if (formData.lineCount < 1) {
        setError('Must select at least one line');
        return false;
      }
    } else {
      if (formData.min >= formData.max) {
        setError('Minimum must be less than maximum');
        return false;
      }
      const range = formData.max - formData.min + 1;
      if (formData.quantity > range) {
        setError('Cannot generate more numbers than the available range');
        return false;
      }
      if (formData.quantity < 1) {
        setError('Must generate at least one number');
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
        if (formData.file) {
          const lines = await readFileContent(formData.file);
          const selectedLines = selectRandomLines(lines, formData.lineCount);
          setResult({ type: 'lines', data: selectedLines });
        } else {
          const numbers = generateRandomNumbers(formData.min, formData.max, formData.quantity);
          setResult({ type: 'numbers', data: numbers.map(String) });
        }
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to generate results');
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
      setError('Failed to copy to clipboard');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Emarekip Çekiliş Sistemi</h2>

              <form onSubmit={generateResults}>
                <FileInput
                  onFileChange={handleFileChange}
                  onLineCountChange={handleLineCountChange}
                  lineCount={formData.lineCount}
                />

                {!formData.file && (
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