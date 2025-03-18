import React from 'react';
import { Copy } from 'lucide-react';
import { GeneratedResult } from '../types';

interface ResultsProps {
  result: GeneratedResult;
  onCopy: () => void;
  copied: boolean;
}

export function Results({ result, onCopy, copied }: ResultsProps) {
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
            {result.data.map((item, index) => (
              <p key={index} className="lead mb-1">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}