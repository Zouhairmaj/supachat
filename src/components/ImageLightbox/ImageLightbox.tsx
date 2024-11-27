import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Attachment } from '../../types/chat';

interface ImageLightboxProps {
  images: Attachment[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev
}: ImageLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>
      
      <button
        onClick={onPrev}
        className="absolute left-4 p-2 text-white/80 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      
      <button
        onClick={onNext}
        className="absolute right-4 p-2 text-white/80 hover:text-white transition-colors"
      >
        <ChevronRight className="w-8 h-8" />
      </button>
      
      <div className="max-w-[90vw] max-h-[90vh]">
        <img
          src={images[currentIndex].url}
          alt=""
          className="max-w-full max-h-[90vh] object-contain"
        />
      </div>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}