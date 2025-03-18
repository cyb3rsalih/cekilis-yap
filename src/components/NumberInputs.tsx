

interface NumberInputsProps {
  min: number;
  max: number;
  quantity: number;
  onChange: (name: string, value: number) => void;
}

export function NumberInputs({ min, max, quantity, onChange }: NumberInputsProps) {
  return (
    <div className="border rounded p-3 mb-4 bg-light">
      <div className="mb-3">
        <label htmlFor="min" className="form-label">Minimum Numara</label>
        <input
          type="number"
          className="form-control"
          id="min"
          name="min"
          value={min}
          onChange={(e) => onChange('min', parseInt(e.target.value) || 0)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="max" className="form-label">Maksimum Numara</label>
        <input
          type="number"
          className="form-control"
          id="max"
          name="max"
          value={max}
          onChange={(e) => onChange('max', parseInt(e.target.value) || 0)}
          required
        />
      </div>

      <div className="mb-0">
        <label htmlFor="quantity" className="form-label">Kaç Numara Seçilecek?</label>
        <input
          type="number"
          className="form-control"
          id="quantity"
          name="quantity"
          value={quantity}
          onChange={(e) => onChange('quantity', parseInt(e.target.value) || 0)}
          min="1"
          required
        />
      </div>
    </div>
  );
}