import React from 'react';
import { MessageItem } from './MessageItem';
import { LoadingIndicator } from './LoadingIndicator';

export const MessageList = ({ messages, isLoading, messagesEndRef, isDarkMode, onReaction, onFeedback }) => {
  return (
    <div className={`flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 min-h-0 ${
      isDarkMode ? 'bg-gray-700' : 'bg-white'
    }`}>
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
            isDarkMode ? 'bg-gray-600' : 'bg-gray-100'
          }`}>
            <svg 
              className={`w-6 h-6 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-400'
              }`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
          </div>
          <h3 className={`text-base sm:text-lg font-medium mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Start a conversation
          </h3>
          <p className={`max-w-md text-xs sm:text-sm ${
            isDarkMode ? 'text-gray-300' : 'text-gray-500'
          }`}>
            Ask me anything you'd like to know.
          </p>
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <MessageItem 
              key={message.id || index} 
              message={message}
              isDarkMode={isDarkMode}
              onReaction={onReaction}
              onFeedback={onFeedback}
            />
          ))}
          
          {isLoading && (
            <div className="flex justify-start mb-4 px-2 sm:px-0">
              <div className="w-full max-w-[90%] sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl">
                <div className={`text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-black'}`} style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  lineHeight: '1.6',
                  letterSpacing: '0.5%'
                }}>
                  <LoadingIndicator />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};