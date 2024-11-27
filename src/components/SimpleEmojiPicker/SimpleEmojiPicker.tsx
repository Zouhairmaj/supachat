import React from 'react';

interface SimpleEmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

const commonEmojis = [
  '👍', '👎', '❤️', '😊', '😂', '🎉',
  '👏', '🙌', '✨', '🔥', '💯', '✅',
  '❌', '❓', '💡', '💪', '🤝', '🚀'
];

export function SimpleEmojiPicker({ onEmojiSelect, onClose }: SimpleEmojiPickerProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 w-[232px]">
      <div className="grid grid-cols-6 gap-1">
        {commonEmojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onEmojiSelect(emoji)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
          >
            <span className="text-lg">{emoji}</span>
          </button>
        ))}
      </div>
    </div>
  );
}