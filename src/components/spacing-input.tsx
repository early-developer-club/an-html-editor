import { useState, useEffect } from 'react';
import LinkedIcon from './linked-icon';
import UnlinkedIcon from './unlinked-icon';

interface SpacingInputProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
}

const SpacingInput = ({ label, value, onChange }: SpacingInputProps) => {
  const [mode, setMode] = useState('all'); // all, individual
  const [values, setValues] = useState({
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
  });

  useEffect(() => {
    if (value) {
      const parts = value.split(' ').filter(Boolean);
      const strippedParts = parts.map(p => p.replace('px', ''));

      if (parts.length === 1) {
        setValues({ top: strippedParts[0], right: strippedParts[0], bottom: strippedParts[0], left: strippedParts[0] });
        setMode('all');
      } else if (parts.length === 2) {
        setValues({ top: strippedParts[0], right: strippedParts[1], bottom: strippedParts[0], left: strippedParts[1] });
        setMode('individual');
      } else if (parts.length === 4) {
        setValues({ top: strippedParts[0], right: strippedParts[1], bottom: strippedParts[2], left: strippedParts[3] });
        setMode('individual');
      }
    } else {
        setValues({ top: '0', right: '0', bottom: '0', left: '0' });
        setMode('all');
    }
  }, [value]);

  const format = (v: string) => /^\d+$/.test(v) ? `${v}px` : v;

  const handleChange = (field: keyof typeof values, fieldValue: string) => {
    const newValues = { ...values, [field]: fieldValue };
    if (mode === 'all') {
        newValues.right = fieldValue;
        newValues.bottom = fieldValue;
        newValues.left = fieldValue;
    }
    setValues(newValues);

    if (newValues.top === newValues.right && newValues.top === newValues.bottom && newValues.top === newValues.left) {
        onChange(format(newValues.top));
    } else if (newValues.top === newValues.bottom && newValues.left === newValues.right) {
        onChange(`${format(newValues.top)} ${format(newValues.left)}`);
    } else {
        onChange(`${format(newValues.top)} ${format(newValues.right)} ${format(newValues.bottom)} ${format(newValues.left)}`);
    }
  };

  const handleModeChange = () => {
    if (mode === 'individual') {
      // from individual to all
      const newTop = values.top;
      const newValues = {
        top: newTop,
        right: newTop,
        bottom: newTop,
        left: newTop,
      };
      setValues(newValues);
      onChange(format(newTop));
      setMode('all');
    } else {
      // from all to individual
      const allValue = values.top;
      setValues({
        top: allValue,
        right: allValue,
        bottom: allValue,
        left: allValue,
      });
      setMode('individual');
    }
  };

  return (
    <div>
      <label className="block mt-3 mb-1 text-xs text-text-muted">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <button onClick={handleModeChange} className="p-1 text-xs rounded bg-button-bg text-text-primary">
          {mode === 'all' ? <LinkedIcon /> : <UnlinkedIcon />}
        </button>
        {mode === 'all' ? (
          <input
            type="text"
            value={values.top}
            onChange={(e) => handleChange('top', e.target.value)}
            className="w-full p-2 text-xs rounded border bg-input-bg text-text-primary border-input-border"
          />
        ) : (
          <div className="grid grid-cols-4 gap-2">
            <input
              type="text"
              value={values.top}
              onChange={(e) => handleChange('top', e.target.value)}
              className="w-full p-2 text-xs rounded border bg-input-bg text-text-primary border-input-border"
              placeholder="Top"
            />
            <input
              type="text"
              value={values.right}
              onChange={(e) => handleChange('right', e.target.value)}
              className="w-full p-2 text-xs rounded border bg-input-bg text-text-primary border-input-border"
              placeholder="Right"
            />
            <input
              type="text"
              value={values.bottom}
              onChange={(e) => handleChange('bottom', e.target.value)}
              className="w-full p-2 text-xs rounded border bg-input-bg text-text-primary border-input-border"
              placeholder="Bottom"
            />
            <input
              type="text"
              value={values.left}
              onChange={(e) => handleChange('left', e.target.value)}
              className="w-full p-2 text-xs rounded border bg-input-bg text-text-primary border-input-border"
              placeholder="Left"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SpacingInput;
