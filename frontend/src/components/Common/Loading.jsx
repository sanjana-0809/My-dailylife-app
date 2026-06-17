import React from 'react';

const Loading = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-2 border-dark-500" />
      <div className="absolute inset-0 rounded-full border-2 border-brand-green border-t-transparent animate-spin" />
    </div>
    <p className="mt-4 text-sm text-dark-300 font-medium">{text}</p>
  </div>
);

export default Loading;
