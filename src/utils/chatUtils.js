import { format, isToday, isYesterday } from 'date-fns';
import { jsPDF } from 'jspdf';

export const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return `Yesterday ${format(date, 'HH:mm')}`;
  } else {
    return format(date, 'MMM dd, HH:mm');
  }
};

export const formatFullDateTime = (timestamp) => {
  const date = new Date(timestamp);
  return format(date, 'PPpp'); // e.g., "Jan 1, 2025 at 2:30 PM"
};

export const generateMessageId = () => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createMessage = (content, role = 'user') => {
  return {
    id: generateMessageId(),
    content,
    role,
    timestamp: new Date().toISOString(),
    reactions: [],
    feedback: null,
  };
};

// Export chat history in JSON format
export const exportChatHistoryJSON = (messages, threadId) => {
  const chatData = {
    threadId,
    exportDate: new Date().toISOString(),
    messageCount: messages.length,
    messages: messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      role: msg.role,
      timestamp: msg.timestamp,
      formattedTime: formatFullDateTime(msg.timestamp),
      reactions: msg.reactions || [],
      feedback: msg.feedback
    }))
  };

  const blob = new Blob([JSON.stringify(chatData, null, 2)], { 
    type: 'application/json' 
  });
  
  downloadFile(blob, `chat-history-${threadId}-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.json`);
};

// Export chat history in TXT format
export const exportChatHistoryTXT = (messages, threadId) => {
  const timestamp = format(new Date(), 'PPpp');
  let txtContent = `Chat History Export\n`;
  txtContent += `Thread ID: ${threadId}\n`;
  txtContent += `Export Date: ${timestamp}\n`;
  txtContent += `Total Messages: ${messages.length}\n`;
  txtContent += `${'='.repeat(50)}\n\n`;

  messages.forEach((msg, index) => {
    const time = formatFullDateTime(msg.timestamp);
    const sender = msg.role === 'user' ? 'You' : 'Assistant';
    
    txtContent += `[${time}] ${sender}:\n`;
    txtContent += `${msg.content}\n`;
    
    if (msg.reactions && msg.reactions.length > 0) {
      txtContent += `Reactions: ${msg.reactions.join(', ')}\n`;
    }
    
    if (msg.feedback) {
      txtContent += `Feedback: ${msg.feedback}\n`;
    }
    
    txtContent += `\n${'-'.repeat(30)}\n\n`;
  });

  const blob = new Blob([txtContent], { type: 'text/plain' });
  downloadFile(blob, `chat-history-${threadId}-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.txt`);
};

// Export chat history in PDF format
export const exportChatHistoryPDF = (messages, threadId) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Set font
  doc.setFont("helvetica");

  // Add header
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Chat History Export", margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Thread ID: ${threadId}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Export Date: ${format(new Date(), 'PPpp')}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Total Messages: ${messages.length}`, margin, yPosition);
  yPosition += 15;

  // Add separator line
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  messages.forEach((msg, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    // Message header
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    const time = formatFullDateTime(msg.timestamp);
    const sender = msg.role === 'user' ? 'You' : 'Assistant';
    const header = `[${time}] ${sender}:`;
    doc.text(header, margin, yPosition);
    yPosition += 7;

    // Message content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    
    // Split text to fit width
    const lines = doc.splitTextToSize(msg.content, maxWidth);
    
    // Check if content will fit on current page
    if (yPosition + lines.length * 4 > pageHeight - 20) {
      doc.addPage();
      yPosition = margin;
    }
    
    lines.forEach(line => {
      doc.text(line, margin + 5, yPosition);
      yPosition += 4;
    });

    // Add reactions and feedback if any
    if (msg.reactions && msg.reactions.length > 0) {
      yPosition += 3;
      doc.setFontSize(7);
      doc.setFont("helvetica", "italic");
      doc.text(`Reactions: ${msg.reactions.join(', ')}`, margin + 5, yPosition);
      yPosition += 4;
    }

    if (msg.feedback) {
      yPosition += 3;
      doc.setFontSize(7);
      doc.setFont("helvetica", "italic");
      doc.text(`Feedback: ${msg.feedback}`, margin + 5, yPosition);
      yPosition += 4;
    }

    yPosition += 8; // Space between messages

    // Add separator line
    if (index < messages.length - 1) {
      doc.setLineWidth(0.2);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;
    }
  });

  // Save the PDF
  const filename = `chat-history-${threadId}-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.pdf`;
  doc.save(filename);
};

// Helper function to download files
const downloadFile = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Legacy function for backward compatibility
export const exportChatHistory = (messages, threadId) => {
  exportChatHistoryJSON(messages, threadId);
};

export const scrollToBottom = (element) => {
  if (element) {
    element.scrollTop = element.scrollHeight;
  }
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};