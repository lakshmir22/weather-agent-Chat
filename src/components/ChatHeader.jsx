import React, { useState, useRef, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Cloud,
  Download,
  ChevronDown,
  FileText,
  File,
  FileImage,
  Trash2
} from 'lucide-react';

export const ChatHeader = ({ 
  onToggleTheme, 
  isDarkMode,
  onExportChat,
  onClearChat
}) => {
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleExportFormat = (format) => {
    onExportChat(format);
    setShowExportDropdown(false);
  };

  return (
    <div className={`border-b px-3 py-3 sm:px-6 sm:py-4 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-600' 
        : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${
            isDarkMode ? 'bg-gray-600' : 'bg-gray-100'
          }`}>
            <Cloud className={`w-4 h-4 sm:w-5 sm:h-5 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`} />
          </div>
          <div>
            <h1 className={`text-base sm:text-lg font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Chat
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {/* Export Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className={`flex items-center space-x-1 p-1.5 sm:p-2 rounded-lg transition-all duration-200 group ${
                showExportDropdown
                  ? isDarkMode 
                    ? 'bg-gray-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 shadow-md'
                  : isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-600' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
              title="Export chat history"
            >
              <Download className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${
                showExportDropdown ? 'rotate-12' : 'group-hover:scale-110'
              }`} />
              <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${
                showExportDropdown ? 'rotate-180' : ''
              }`} />
            </button>

            {/* Dropdown Menu */}
            {showExportDropdown && (
              <div className={`absolute right-0 mt-2 w-40 rounded-xl shadow-xl border backdrop-blur-sm z-50 animate-in slide-in-from-top-2 duration-200 ${
                isDarkMode 
                  ? 'bg-gray-800/95 border-gray-600' 
                  : 'bg-white/95 border-gray-200'
              }`}>
                <div className="py-2">
                  <div className={`px-3 py-1.5 text-xs font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Export Format
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                  
                  <button
                    onClick={() => handleExportFormat('json')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm transition-all duration-200 group ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <File className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="flex-1">JSON</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      .json
                    </span>
                  </button>
                  
                  <button
                    onClick={() => handleExportFormat('txt')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm transition-all duration-200 group ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform" />
                    <span className="flex-1">Text</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      .txt
                    </span>
                  </button>
                  
                  <button
                    onClick={() => handleExportFormat('pdf')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm transition-all duration-200 group ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FileImage className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                    <span className="flex-1">PDF</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      .pdf
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Clear Chat Button */}
          <button
            onClick={onClearChat}
            className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 group ${
              isDarkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-600' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
            title="Clear chat history"
          >
            <Trash2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:scale-110`} />
          </button>
          
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-600' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
            title={isDarkMode ? 'Switch to light mode (Ctrl/Cmd + D)' : 'Switch to dark mode (Ctrl/Cmd + D)'}
          >
            {isDarkMode ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};