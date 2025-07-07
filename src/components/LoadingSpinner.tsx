import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-t-4 border-t-amber-600 border-slate-200 rounded-full animate-spin"></div>
  </div>
);