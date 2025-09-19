import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Copy, MoreHorizontal } from 'lucide-react';
import { formatMessageTime, formatFullDateTime, copyToClipboard } from '../utils/chatUtils';

export const MessageItem = ({ message, isDarkMode, onReaction, onFeedback }) => {
  const [showActions, setShowActions] = useState(false);
  const [showFullTime, setShowFullTime] = useState(false);
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    const success = await copyToClipboard(message.content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReaction = (reaction) => {
    if (onReaction) {
      onReaction(message.id, reaction);
    }
  };

  const handleFeedback = (feedback) => {
    if (onFeedback) {
      onFeedback(message.id, feedback);
    }
  };

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 group px-2 sm:px-0`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl ${isUser ? 'ml-auto' : 'mr-auto'} relative`}>
         {isUser ? (
           <div className={`rounded-2xl px-2 py-2 border ${
             isDarkMode
               ? 'bg-gray-600 text-white border-gray-500'
               : 'bg-gray-50 text-gray-700 border-gray-200'
           }`}>
            <div className="whitespace-pre-wrap break-words text-sm sm:text-base" style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 370,
              lineHeight: '1.4',
              letterSpacing: '0.5%'
            }}>
              {message.content}
            </div>
          </div>
         ) : (
           <div className={`break-words text-sm sm:text-base ${
             isDarkMode ? 'text-white' : 'text-black'
           }`} style={{
             fontFamily: 'Inter, sans-serif',
             fontWeight: 400,
             lineHeight: '1.6',
             letterSpacing: '0.5%'
           }}>
             {message.content.split('\n').map((line, index) => {
               const trimmedLine = line.trim();
               if (!trimmedLine) return <div key={index} style={{ height: '8px' }}></div>;
               
               // Make specific field names bold
               const formattedLine = trimmedLine
                 .replace(/\b(temp|temperature|humidity|condition|wind|pressure|visibility|feels like|uv index|dew point|precipitation|cloud cover|sunrise|sunset|time|date|location|city|country|coordinates|latitude|longitude|altitude|timezone|description|status|current|forecast|today|tomorrow|week|hourly|daily|min|max|avg|average|minimum|maximum)\b/gi, '<strong style="font-weight: 600;">$1</strong>');
               
               return (
                 <div key={index} style={{ 
                   margin: '6px 0',
                   padding: '4px 0'
                 }} dangerouslySetInnerHTML={{ __html: formattedLine }}>
                 </div>
               );
             })}
           </div>
         )}
        
        {/* Actions Panel */}
        {showActions && !isUser && (
          <div className={`absolute -right-2 top-0 flex items-center space-x-1 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-lg shadow-lg border p-1 ${
            isDarkMode ? 'border-gray-600' : 'border-gray-200'
          }`}>
            <button
              onClick={() => handleReaction('like')}
              className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                message.reactions?.includes('like') ? 'text-green-500' : 'text-gray-500'
              }`}
              title="Like"
            >
              <ThumbsUp className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleReaction('dislike')}
              className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                message.reactions?.includes('dislike') ? 'text-red-500' : 'text-gray-500'
              }`}
              title="Dislike"
            >
              <ThumbsDown className="w-3 h-3" />
            </button>
            <button
              onClick={handleCopy}
              className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                copied ? 'text-green-500' : 'text-gray-500'
              }`}
              title={copied ? "Copied!" : "Copy"}
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
        )}
        
        {/* Timestamp */}
        <div 
          className={`text-xs mt-1 cursor-pointer ${isUser ? 'text-right' : 'text-left'} ${
            isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setShowFullTime(!showFullTime)}
          title="Click to toggle full date/time"
        >
          {showFullTime ? formatFullDateTime(message.timestamp) : formatMessageTime(message.timestamp)}
        </div>

        {/* Feedback badges */}
        {message.feedback && (
          <div className={`text-xs mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
              message.feedback === 'helpful' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {message.feedback === 'helpful' ? '👍 Helpful' : '👎 Not helpful'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};