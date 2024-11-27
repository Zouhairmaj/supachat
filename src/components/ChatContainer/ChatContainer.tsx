import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import { ChatInput } from '../ChatInput/ChatInput';
import { DateSeparator } from '../DateSeparator/DateSeparator';
import type { ChatMessageProps } from '../../types/chat';
import { formatDate, shouldShowDateSeparator } from '../../utils/messageUtils';

interface ChatContainerProps {
  messages: ChatMessageProps[];
  onSendMessage: (message: string, quotedMessage?: ChatMessageProps) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onRemoveReaction: (messageId: string, emoji: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  currentUserName: string;
}

export function ChatContainer({ 
  messages, 
  onSendMessage, 
  onAddReaction,
  onRemoveReaction,
  onDeleteMessage,
  onEditMessage,
  currentUserName
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [replyToMessage, setReplyToMessage] = useState<ChatMessageProps | undefined>();
  const [editingMessage, setEditingMessage] = useState<ChatMessageProps | undefined>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string, quotedMessage?: ChatMessageProps) => {
    onSendMessage(content, quotedMessage);
  };

  const handleStartEdit = (message: ChatMessageProps) => {
    setEditingMessage(message);
    setReplyToMessage(undefined);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto py-6 px-4">
          {messages.map((message, index) => (
            <React.Fragment key={message.id}>
              {shouldShowDateSeparator(message, messages[index - 1]) && (
                <DateSeparator date={formatDate(new Date(message.date))} />
              )}
              <ChatMessage 
                {...message} 
                onAddReaction={onAddReaction}
                onRemoveReaction={onRemoveReaction}
                onReply={setReplyToMessage}
                onDelete={onDeleteMessage}
                onStartEdit={handleStartEdit}
                currentUserName={currentUserName}
              />
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <ChatInput 
        onSendMessage={handleSendMessage}
        replyToMessage={replyToMessage}
        onCancelReply={() => setReplyToMessage(undefined)}
        editingMessage={editingMessage}
        onEditMessage={onEditMessage}
        onCancelEdit={() => setEditingMessage(undefined)}
      />
    </div>
  );
}