import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
  <div className="bg-white rounded-2xl shadow p-6 text-center">
    <p className="text-red-600 font-medium mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
    >
      Retry
    </button>
  </div>
);
