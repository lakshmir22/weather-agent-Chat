import React from 'react';

export const LoadingIndicator = () => {
  return (
    <div className="flex items-center space-x-1">
      <span className="text-gray-500 dark:text-gray-600 text-sm">
        Thinking
      </span>
      <div className="flex space-x-1">
        <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};