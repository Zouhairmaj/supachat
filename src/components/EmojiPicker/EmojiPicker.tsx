import React from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: any) => void;
  onClose: () => void;
}

export function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  return (
    <div className="absolute bottom-full mb-2">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <div className="relative z-50 shadow-lg rounded-lg">
        <Picker 
          data={data} 
          onEmojiSelect={onEmojiSelect}
          theme="light"
          previewPosition="none"
          skinTonePosition="none"
        />
      </div>
    </div>
  );
}