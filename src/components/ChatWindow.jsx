import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ChatHeader } from './ChatHeader';
import { WeatherAgentService } from '../services/weatherAgent';
import { createMessage, scrollToBottom, exportChatHistoryJSON, exportChatHistoryTXT, exportChatHistoryPDF } from '../utils/chatUtils';

export const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef(null);
  const messageListRef = useRef(null);
  const [threadId] = useState(() => `thread_${Date.now()}`);

  // Auto-scroll to latest message
  const scrollToLatest = useCallback(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => {
      const newTheme = !prev;
      localStorage.setItem('chat-theme', newTheme ? 'dark' : 'light');
      
      console.log('Theme toggle:', newTheme ? 'dark' : 'light');
      
      // Remove all classes first
      document.documentElement.classList.remove('dark', 'light');
      document.body.classList.remove('dark', 'light');
      
      // Force a reflow
      document.documentElement.offsetHeight;
      
      if (newTheme) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        console.log('Added dark classes');
      } else {
        document.documentElement.classList.add('light');
        document.body.classList.add('light');
        document.documentElement.setAttribute('data-theme', 'light');
        console.log('Added light classes');
      }
      
      console.log('Document classes:', document.documentElement.className);
      console.log('Body classes:', document.body.className);
      
      return newTheme;
    });
  }, []);

  // Handle message reactions
  const handleReaction = useCallback((messageId, reaction) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const hasReaction = reactions.includes(reaction);
        
        return {
          ...msg,
          reactions: hasReaction 
            ? reactions.filter(r => r !== reaction)
            : [...reactions.filter(r => r !== (reaction === 'like' ? 'dislike' : 'like')), reaction]
        };
      }
      return msg;
    }));
  }, []);

  // Handle message feedback
  const handleFeedback = useCallback((messageId, feedback) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          feedback: msg.feedback === feedback ? null : feedback
        };
      }
      return msg;
    }));
  }, []);

  // Clear chat history
  const handleClearChat = useCallback(() => {
    const confirmClear = window.confirm('Are you sure you want to clear all chat messages? This action cannot be undone.');
    if (confirmClear) {
      setMessages([]);
      setError(null);
    }
  }, []);

  // Export chat history
  const handleExportChat = useCallback((format = 'json') => {
    if (messages.length === 0) {
      alert('No messages to export');
      return;
    }
    
    switch (format) {
      case 'json':
        exportChatHistoryJSON(messages, threadId);
        break;
      case 'txt':
        exportChatHistoryTXT(messages, threadId);
        break;
      case 'pdf':
        exportChatHistoryPDF(messages, threadId);
        break;
      default:
        exportChatHistoryJSON(messages, threadId);
    }
  }, [messages, threadId]);

  // Auto-scroll effect
  useEffect(() => {
    scrollToLatest();
  }, [messages, scrollToLatest]);

  useEffect(() => {
    scrollToBottom(messagesEndRef.current);
  }, [messages]);

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('chat-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldUseDark = savedTheme === 'dark' || (savedTheme === null && systemPrefersDark);
    
    setIsDarkMode(shouldUseDark);
    if (shouldUseDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault();
        toggleTheme();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme]);

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    const userMessage = createMessage(content, 'user');
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Create a temporary assistant message for streaming
    const assistantMessage = createMessage('', 'assistant');
    setMessages(prev => [...prev, assistantMessage]);

    try {
      const allMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      await WeatherAgentService.sendMessage(
        allMessages,
        threadId,
        (response) => {
          // Handle streaming response
          if (response.content) {
            setMessages(prev => {
              const updated = [...prev];
              const lastMessage = updated[updated.length - 1];
              if (lastMessage.role === 'assistant') {
                // Check if this is a temperature/weather response
                const isWeatherResponse = response.content.includes('Current weather in') || 
                                        response.content.includes('°C') || 
                                        response.content.match(/^\d+\.?\d*°C$/);
                
                if (isWeatherResponse) {
                  // For weather data, replace the content completely to avoid duplication
                  lastMessage.content = response.content;
                } else {
                  // For regular streaming text, append only if not empty and not a duplicate
                  if (response.content.trim() && !lastMessage.content.includes(response.content)) {
                    lastMessage.content += response.content;
                  }
                }
              }
              return updated;
            });
          }
        },
        (error) => {
          setError(error.message);
          // Remove the empty assistant message on error
          setMessages(prev => prev.slice(0, -1));
        }
      );
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Send message error:', err);
      // Remove the empty assistant message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-screen transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}>
      <div className={`flex flex-col h-full transition-colors duration-200 border-r ${
        isDarkMode 
          ? 'bg-gray-700 border-gray-600' 
          : 'bg-white border-gray-100'
      }`}>
        <ChatHeader 
          onToggleTheme={toggleTheme}
          isDarkMode={isDarkMode}
          onExportChat={handleExportChat}
          onClearChat={handleClearChat}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div 
            ref={messageListRef}
            className="flex-1 overflow-hidden"
          >
            <MessageList 
              messages={messages}
              isLoading={isLoading}
              messagesEndRef={messagesEndRef}
              isDarkMode={isDarkMode}
              onReaction={handleReaction}
              onFeedback={handleFeedback}
            />
          </div>
          
          {error && (
            <div className="mx-4 mb-2 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-600 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}
          
          <MessageInput 
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
};