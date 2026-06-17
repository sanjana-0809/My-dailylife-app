import React from 'react';

const Input = ({ label, error, className = '', ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>}
    <input
      className={`
        w-full px-4 py-3 rounded-xl border transition-all duration-200
        bg-surface-dark text-gray-100 placeholder-dark-300
        focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green/50
        ${error ? 'border-red-500/50' : 'border-dark-500 hover:border-dark-400'}
        ${className}
      `}
      {...props}
    />
    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
  </div>
);

export default Input;
