import React from 'react';

const variants = {
  primary: 'bg-brand-green hover:bg-brand-greenDark text-dark-900 font-semibold shadow-lg shadow-brand-green/20',
  secondary: 'bg-surface-light hover:bg-surface-lighter text-gray-200 border border-dark-400',
  danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30',
  ghost: 'hover:bg-surface-light text-gray-400 hover:text-gray-200',
  cyan: 'bg-brand-cyan hover:bg-brand-cyanDark text-dark-900 font-semibold shadow-lg shadow-brand-cyan/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({ children, variant = 'primary', size = 'md', className = '', disabled, loading, ...props }) => (
  <button
    className={`
      inline-flex items-center justify-center gap-2 font-medium rounded-xl
      transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:ring-offset-2 focus:ring-offset-dark-900
      disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]
      ${variants[variant]} ${sizes[size]} ${className}
    `}
    disabled={disabled || loading}
    {...props}
  >
    {loading && (
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    )}
    {children}
  </button>
);

export default Button;
