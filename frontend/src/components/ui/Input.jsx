import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, helperText, className = '', ...props }, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`input-base ${
          error ? 'border-accent-danger focus:border-accent-danger shadow-none' : ''
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-accent-danger">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-text-tertiary">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
