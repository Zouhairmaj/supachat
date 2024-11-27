import React from 'react';
import type { QuotedMessage } from '../../types/chat';

interface QuotedMessageProps {
  message: QuotedMessage;
  isCurrentUser: boolean;
}

export function QuotedMessage({ message, isCurrentUser }: QuotedMessageProps) {
  const truncatedContent = message.content.length > 100 
    ? message.content.substring(0, 100) + '...' 
    : message.content;

  return (
    <div className={`mb-2 pl-3 border-l-2 ${
      isCurrentUser ? 'border-white/30' : 'border-primary-300'
    }`}>
      <div className={`text-xs font-medium mb-0.5 ${
        isCurrentUser ? 'text-white/90' : 'text-primary-700'
      }`}>
        {message.sender.name}
      </div>
      <div className={`text-xs ${
        isCurrentUser ? 'text-white/80' : 'text-gray-600'
      }`}>
        {truncatedContent}
      </div>
    </div>
  );
}