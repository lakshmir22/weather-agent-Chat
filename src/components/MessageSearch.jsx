import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export const MessageSearch = ({ messages, onSearchResults, isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      onSearchResults([]);
      return;
    }

    const results = messages.filter(message =>
      message.content.toLowerCase().includes(searchTerm.toLowerCase())
    ).map(message => ({
      ...message,
      highlight: highlightText(message.content, searchTerm)
    }));

    setSearchResults(results);
    onSearchResults(results);
  }, [searchTerm, messages, onSearchResults]);

  const highlightText = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark class="bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100">$1</mark>');
  };

  if (!isOpen) return null;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent"
            autoFocus
          />
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {searchTerm && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {searchResults.length > 0 
            ? `Found ${searchResults.length} message${searchResults.length !== 1 ? 's' : ''}`
            : 'No messages found'
          }
        </div>
      )}
    </div>
  );
};