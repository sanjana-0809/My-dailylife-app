// components/Common/Loading.jsx
import React from 'react';

const Loading = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-4 border-surface-200" />
      <div className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
    </div>
    <p className="mt-4 text-sm text-gray-400 font-medium">{text}</p>
  </div>
);

export default Loading;
