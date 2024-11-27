import React, { useState } from 'react';
import type { Attachment } from '../../types/chat';
import { ImageLightbox } from '../ImageLightbox/ImageLightbox';

interface MessageAttachmentsProps {
  attachments: Attachment[];
  isCurrentUser: boolean;
}

export function MessageAttachments({ attachments, isCurrentUser }: MessageAttachmentsProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <>
      <div className={`mt-2 ${attachments.length > 1 ? 'grid grid-cols-2 gap-2' : ''}`}>
        {attachments.map((attachment, index) => (
          <div
            key={index}
            className="relative rounded-lg overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => handleImageClick(index)}
          >
            <img
              src={attachment.url}
              alt=""
              className="w-full h-auto rounded-lg"
              style={{
                maxHeight: attachments.length > 1 ? '200px' : '300px',
                objectFit: 'cover'
              }}
            />
          </div>
        ))}
      </div>
      
      {selectedImageIndex !== null && (
        <ImageLightbox
          images={attachments}
          currentIndex={selectedImageIndex}
          onClose={() => setSelectedImageIndex(null)}
          onNext={() => setSelectedImageIndex(prev => (prev! + 1) % attachments.length)}
          onPrev={() => setSelectedImageIndex(prev => (prev! - 1 + attachments.length) % attachments.length)}
        />
      )}
    </>
  );
}