import React, { useState } from 'react';
import { Smile, Reply, Trash2, Pencil, Check, X } from 'lucide-react';
import { SimpleEmojiPicker } from '../SimpleEmojiPicker/SimpleEmojiPicker';
import type { Reaction, ChatMessageProps } from '../../types/chat';

interface MessageReactionsProps {
  reactions: Record<string, Reaction>;
  onAddReaction: (emoji: string) => void;
  onRemoveReaction?: (emoji: string) => void;
  onReply?: (message: ChatMessageProps) => void;
  onDelete?: (messageId: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  message: ChatMessageProps;
  isCurrentUser: boolean;
  currentUserName: string;
  isHovered: boolean;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
}

export function MessageReactions({ 
  reactions, 
  onAddReaction, 
  onRemoveReaction,
  onReply,
  onDelete,
  onEdit,
  message,
  isCurrentUser,
  currentUserName,
  isHovered,
  isEditing,
  onStartEdit,
  onCancelEdit
}: MessageReactionsProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEmojiSelect = (emoji: string) => {
    onAddReaction(emoji);
    setShowEmojiPicker(false);
  };

  const handleReactionClick = (emoji: string) => {
    if (reactions[emoji]?.users.includes(currentUserName)) {
      onRemoveReaction?.(emoji);
    }
  };

  const handleReply = () => {
    onReply?.(message);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete?.(message.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <div className="relative">
      <div 
        className={`absolute ${isCurrentUser ? '-left-20' : '-right-20'} top-0 transition-all duration-200 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        } flex gap-1 bg-white rounded-full border border-gray-100 p-0.5`}
      >
        {!isEditing && (
          <>
            <button
              onClick={handleReply}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
              title="Reply to message"
            >
              <Reply className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowEmojiPicker(true)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
              title="Add reaction"
            >
              <Smile className="w-4 h-4" />
            </button>
            {isCurrentUser && (
              <>
                <button
                  onClick={onStartEdit}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                  title="Edit message"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className={`p-1.5 rounded-full transition-colors ${
                    showDeleteConfirm
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                  title={showDeleteConfirm ? 'Click again to confirm deletion' : 'Delete message'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </>
        )}
      </div>

      {Object.entries(reactions).length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {Object.entries(reactions).map(([emoji, reaction]) => (
            <button
              key={emoji}
              onClick={() => handleReactionClick(emoji)}
              className={`group inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 reaction-animation ${
                reaction.users.includes(currentUserName)
                  ? 'bg-white border border-primary-100 text-primary-600 hover:bg-primary-50'
                  : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50'
              }`}
              title={reaction.users.join(', ')}
            >
              <span>{emoji}</span>
              <span className={`${
                reaction.users.includes(currentUserName)
                  ? 'text-primary-500 group-hover:text-primary-600'
                  : 'text-gray-500 group-hover:text-gray-600'
              }`}>
                {reaction.users.length}
              </span>
            </button>
          ))}
        </div>
      )}

      {showEmojiPicker && (
        <div className={`absolute ${isCurrentUser ? 'right-0' : 'left-0'} top-0 mt-1 z-50`}>
          <div 
            className="fixed inset-0" 
            onClick={() => setShowEmojiPicker(false)}
          />
          <div className="relative">
            <SimpleEmojiPicker
              onEmojiSelect={handleEmojiSelect}
              onClose={() => setShowEmojiPicker(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}