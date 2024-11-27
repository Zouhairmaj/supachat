import React from 'react';
import { X } from 'lucide-react';
import type { Attachment } from '../../types/chat';

interface ImagePreviewProps {
  attachment: Attachment;
  onRemove: () => void;
}

export function ImagePreview({ attachment, onRemove }: ImagePreviewProps) {
  return (
    <div className="relative group">
      <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
        <img
          src={attachment.url}
          alt="Preview"
          className="w-full h-full object-cover"
        />
      </div>
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md border border-gray-200 text-gray-500 hover:text-gray-700 transition-colors opacity-0 group-hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}