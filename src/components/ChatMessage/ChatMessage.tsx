import React, { useState, useEffect } from 'react';
import type { ChatMessageProps } from '../../types/chat';
import { MessageReactions } from '../MessageReactions/MessageReactions';
import { MentionTag } from '../MentionTag/MentionTag';
import { QuotedMessage } from '../QuotedMessage/QuotedMessage';
import { MessageAttachments } from '../MessageAttachments/MessageAttachments';

interface ExtendedChatMessageProps extends ChatMessageProps {
  onAddReaction: (messageId: string, emoji: string) => void;
  onRemoveReaction: (messageId: string, emoji: string) => void;
  onReply?: (message: ChatMessageProps) => void;
  onDelete?: (messageId: string) => void;
  onStartEdit?: (message: ChatMessageProps) => void;
  currentUserName: string;
}

export function ChatMessage({ 
  id,
  content, 
  sender, 
  timestamp, 
  isCurrentUser,
  reactions,
  quotedMessage,
  isEdited,
  attachments,
  onAddReaction,
  onRemoveReaction,
  onReply,
  onDelete,
  onStartEdit,
  currentUserName
}: ExtendedChatMessageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const formatContent = (text: string) => {
    const words = text.split(' ');
    return words.map((word, index) => {
      if (word.startsWith('@')) {
        const name = word.slice(1);
        return (
          <React.Fragment key={index}>
            <MentionTag 
              name={name}
              isCurrentUser={isCurrentUser}
            />
            {' '}
          </React.Fragment>
        );
      }
      return <span key={index}>{word} </span>;
    });
  };

  const handleAddReaction = (emoji: string) => {
    onAddReaction(id, emoji);
  };

  const handleRemoveReaction = (emoji: string) => {
    onRemoveReaction(id, emoji);
  };

  return (
    <div 
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4 px-2 group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} max-w-[70%] items-start gap-3 relative`}>
        {!isCurrentUser && (
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            {sender.avatar ? (
              <img 
                src={sender.avatar} 
                alt={sender.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary-600 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {sender.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        )}
        
        <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
          {!isCurrentUser && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-900">
                {sender.name}
              </span>
              {sender.isAI && (
                <span className="px-1.5 py-0.5 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                  AI
                </span>
              )}
            </div>
          )}
          
          <div 
            className={`relative rounded-2xl px-4 py-2.5 ${
              isCurrentUser 
                ? 'bg-primary-600 text-white' 
                : 'bg-[#F5F7FA] text-gray-900 border border-gray-100'
            } ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}
          >
            {quotedMessage && (
              <QuotedMessage message={quotedMessage} isCurrentUser={isCurrentUser} />
            )}
            {content && (
              <div className="text-sm leading-relaxed flex flex-wrap items-center gap-1">
                {formatContent(content)}
              </div>
            )}
            {attachments && attachments.length > 0 && (
              <MessageAttachments
                attachments={attachments}
                isCurrentUser={isCurrentUser}
              />
            )}
            <MessageReactions
              reactions={reactions}
              onAddReaction={handleAddReaction}
              onRemoveReaction={handleRemoveReaction}
              onReply={() => onReply?.({ id, content, sender, timestamp, isCurrentUser, reactions, attachments })}
              onDelete={() => onDelete?.(id)}
              message={{ id, content, sender, timestamp, isCurrentUser, reactions, attachments }}
              isCurrentUser={isCurrentUser}
              currentUserName={currentUserName}
              isHovered={isHovered}
              isEditing={false}
              onStartEdit={() => onStartEdit?.({ id, content, sender, timestamp, isCurrentUser, reactions, attachments })}
              onCancelEdit={() => {}}
            />
          </div>
          
          <div className="mt-1">
            <span className="text-xs text-gray-500">
              {timestamp}
              {isEdited && (
                <span className="ml-1 text-gray-400">(edited)</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}