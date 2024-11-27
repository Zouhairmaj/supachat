import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, X, Image, Reply } from 'lucide-react';
import { EmojiPicker } from '../EmojiPicker/EmojiPicker';
import { MentionSuggestions } from '../MentionSuggestions/MentionSuggestions';
import { QuotedMessage } from '../QuotedMessage/QuotedMessage';
import { teamMembers, dataoAssistant } from '../../utils/teamMembers';
import { processImageFile } from '../../utils/imageUtils';
import type { ChatMessageProps, Attachment } from '../../types/chat';
import { ImagePreview } from '../ImagePreview/ImagePreview';

interface ChatInputProps {
  onSendMessage: (message: string, quotedMessage?: ChatMessageProps, attachments?: Attachment[]) => void;
  replyToMessage?: ChatMessageProps;
  onCancelReply?: () => void;
  editingMessage?: ChatMessageProps;
  onEditMessage?: (messageId: string, newContent: string) => void;
  onCancelEdit?: () => void;
}

export function ChatInput({ 
  onSendMessage, 
  replyToMessage, 
  onCancelReply,
  editingMessage,
  onEditMessage,
  onCancelEdit
}: ChatInputProps) {
  const [message, setMessage] = useState(editingMessage?.content || '');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionIndex, setMentionIndex] = useState(0);
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingMessage) {
      setMessage(editingMessage.content);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [editingMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value, selectionStart } = e.target;
    setMessage(value);

    // Handle mentions
    const lastAtSymbol = value.lastIndexOf('@', selectionStart);
    if (lastAtSymbol !== -1 && lastAtSymbol >= mentionStartIndex) {
      const searchText = value.slice(lastAtSymbol + 1, selectionStart).toLowerCase();
      setMentionSearch(searchText);
      setShowMentions(true);
      setMentionStartIndex(lastAtSymbol);
    } else {
      setShowMentions(false);
      setMentionStartIndex(-1);
    }

    // Adjust textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (showMentions) {
        insertMention(suggestions[mentionIndex]);
      } else {
        handleSubmit(e);
      }
    } else if (showMentions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMentionIndex((prev) => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMentionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      }
    }
  };

  const suggestions = [
    ...teamMembers.filter(member => 
      member.name.toLowerCase().includes(mentionSearch.toLowerCase())
    ),
    ...(dataoAssistant.name.toLowerCase().includes(mentionSearch.toLowerCase()) ? [dataoAssistant] : [])
  ];

  const insertMention = (suggestion: typeof suggestions[0]) => {
    if (mentionStartIndex === -1) return;

    const beforeMention = message.slice(0, mentionStartIndex);
    const afterMention = message.slice(mentionStartIndex + mentionSearch.length + 1);
    const newMessage = `${beforeMention}@${suggestion.name} ${afterMention}`;
    
    setMessage(newMessage);
    setShowMentions(false);
    setMentionStartIndex(-1);
    
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    try {
      const newAttachments = await Promise.all(
        imageFiles.map(file => processImageFile(file))
      );
      
      setAttachments(prev => [...prev, ...newAttachments]);
    } catch (error) {
      console.error('Failed to process image files:', error);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || attachments.length > 0) {
      if (editingMessage) {
        onEditMessage?.(editingMessage.id, message);
        onCancelEdit?.();
      } else {
        onSendMessage(message, replyToMessage, attachments);
        onCancelReply?.();
      }
      
      setMessage('');
      setAttachments([]);
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <div className="border-t bg-white px-6 py-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-4xl mx-auto relative">
        {replyToMessage && !editingMessage && (
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg animate-fade-down">
            <Reply className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              Replying to <span className="font-medium">{replyToMessage.sender.name}</span>
            </span>
            <button
              type="button"
              onClick={() => onCancelReply?.()}
              className="ml-auto p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {editingMessage && (
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg animate-fade-down">
            <span className="text-sm text-gray-600">
              Editing message
            </span>
            <button
              type="button"
              onClick={() => onCancelEdit?.()}
              className="ml-auto p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
            {attachments.map((attachment, index) => (
              <ImagePreview
                key={index}
                attachment={attachment}
                onRemove={() => removeAttachment(index)}
              />
            ))}
          </div>
        )}
        
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={editingMessage ? "Edit your message..." : "Type your message... Use @ to mention someone (Press Shift + Enter for new line)"}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none min-h-[42px] max-h-[150px]"
              style={{ height: 'auto' }}
              rows={1}
            />
            {showMentions && suggestions.length > 0 && (
              <MentionSuggestions
                suggestions={suggestions}
                onSelect={insertMention}
                activeIndex={mentionIndex}
              />
            )}
          </div>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <Image className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <Smile className="w-5 h-5" />
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span className="text-sm font-medium">
                {editingMessage ? 'Save' : 'Send'}
              </span>
            </button>
          </div>
          {showEmojiPicker && (
            <EmojiPicker
              onEmojiSelect={handleEmojiSelect}
              onClose={() => setShowEmojiPicker(false)}
            />
          )}
        </div>
      </form>
    </div>
  );
}