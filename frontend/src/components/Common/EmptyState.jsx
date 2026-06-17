import React from 'react';

const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
    {icon && <div className="text-5xl mb-4 opacity-30">{icon}</div>}
    <h3 className="text-base font-semibold text-gray-400 mb-1">{title}</h3>
    {description && <p className="text-sm text-dark-300 max-w-xs mb-5">{description}</p>}
    {action && action}
  </div>
);

export default EmptyState;
