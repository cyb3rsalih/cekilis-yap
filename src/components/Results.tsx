import React from 'react';
import { Copy } from 'lucide-react';
import { GeneratedResult } from '../types';

interface ResultsProps {
  result: GeneratedResult;
  onCopy: () => void;
  copied: boolean;
}

export function Results({ result, onCopy, copied }: ResultsProps) {
  // Function to determine if a result item has multiple columns
  const hasMultipleColumns = (item: string): boolean => {
    return item.includes('\t');
  };

  // Function to render either a simple text or a table row
  const renderResultItem = (item: string, index: number) => {
    if (!hasMultipleColumns(item)) {
      return (
        <p key={index} className="lead mb-1">
          {item}
        </p>
      );
    }

    const columns = item.split('\t');
    return (
      <div key={index} className="table-responsive mb-2">
        <table className="table table-sm table-bordered">
          <tbody>
            <tr>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>{col}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="mt-4">
      <div className="card bg-light">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="card-title mb-0">
              Kazananlar
            </h5>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={onCopy}
            >
              <Copy size={16} className="me-1" />
              {copied ? 'Kopyalandı!' : 'Kopyala'}
            </button>
          </div>
          <div className="card-text">
            {result.data.map((item, index) => renderResultItem(item, index))}
          </div>
        </div>
      </div>
    </div>
  );
}