import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Keyboard, CheckCircle } from 'lucide-react';

interface ManualInputProps {
  onSubmit: (barcode: string) => void;
  onCancel?: () => void;
}

export default function ManualInput({ onSubmit, onCancel }: ManualInputProps) {
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState('');

  const validateBarcode = (value: string): boolean => {
    if (!value.trim()) {
      setError('Please enter a barcode');
      return false;
    }

    if (!/^\d+$/.test(value)) {
      setError('Barcode should only contain numbers');
      return false;
    }

    if (value.length < 8 || value.length > 13) {
      setError('Barcode should be 8-13 digits long');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateBarcode(barcode)) {
      onSubmit(barcode);
    }
  };

  const handleInputChange = (value: string) => {
    setBarcode(value);
    if (error) setError('');
  };

  return (
    <Card className="mx-auto w-full max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 sm:h-16 sm:w-16">
            <Keyboard className="h-7 w-7 text-blue-600 sm:h-8 sm:w-8" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Enter Barcode Manually
          </h2>
          <p className="text-sm text-gray-600">
            Type the barcode number.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="barcode" className="text-sm">
            Barcode Number
          </Label>
          <Input
            id="barcode"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g., 5701234567890"
            value={barcode}
            onChange={(e) => handleInputChange(e.target.value)}
            className={`text-center ${error ? 'border-red-500' : ''}`}
            autoFocus
          />
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <p className="text-xs text-gray-500">
            Barcodes are usually 8-13 digits long.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            type="submit"
            disabled={!barcode.trim()}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 sm:w-auto"
          >
            <CheckCircle className="h-4 w-4" />
            Submit Barcode
          </Button>

          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Annuller
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
