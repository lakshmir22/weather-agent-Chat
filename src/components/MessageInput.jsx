import React, { useState, useRef } from 'react';

export const MessageInput = ({ onSendMessage, disabled, isDarkMode }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className={`p-3 sm:p-6 ${
      isDarkMode 
        ? 'bg-gray-800' 
        : 'bg-white'
    }`}>
      <form onSubmit={handleSubmit} className="relative mx-auto w-full max-w-[721px]">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyPress}
            placeholder={disabled ? "Sending..." : "Type a message..."}
            disabled={disabled}
            className={`resize-none rounded-2xl px-3 py-3 sm:px-5 sm:py-4 pr-12 sm:pr-16 text-sm sm:text-base focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-xl w-full ${
              isDarkMode
                ? 'bg-gray-700 text-white placeholder-gray-400 border border-gray-600 '
                : 'bg-white text-gray-900 placeholder-gray-500 border-2 border-gray-200'
            }`}
            style={{ 
              minHeight: '100px',
              maxHeight: '150px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              lineHeight: '1.6',
              letterSpacing: '0.5%',
              overflow: 'hidden'
            }}
          />
          
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className={`absolute right-2 sm:right-3 bottom-3 w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
              !message.trim() || disabled
                ? isDarkMode
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-black hover:bg-gray-700 text-white'
            }`}
            title="Send message (Enter)"
          >
            <svg 
              className="w-4 h-4 sm:w-5 sm:h-5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};