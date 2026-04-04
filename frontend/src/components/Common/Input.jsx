// components/Common/Input.jsx
import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        className={`
          w-full px-3 py-2.5 rounded-lg border transition-colors duration-200
          text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent
          ${error ? 'border-accent-red' : 'border-surface-200 hover:border-surface-300'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-accent-red mt-1">{error}</p>}
    </div>
  );
};

export default Input;
