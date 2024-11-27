import React from 'react';

interface DateSeparatorProps {
  date: string;
}

export function DateSeparator({ date }: DateSeparatorProps) {
  return (
    <div className="flex items-center justify-center my-6">
      <div className="bg-gray-50 text-gray-500 text-sm font-medium px-4 py-1.5 rounded-full border border-gray-100">
        {date}
      </div>
    </div>
  );
}