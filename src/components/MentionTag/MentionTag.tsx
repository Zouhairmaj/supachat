import React from 'react';
import { teamMembers, dataoAssistant } from '../../utils/teamMembers';

interface MentionTagProps {
  name: string;
  isCurrentUser: boolean;
}

export function MentionTag({ name, isCurrentUser }: MentionTagProps) {
  const displayName = name.replace(/^@/, '');
  
  // Find the mentioned user
  const mentionedUser = displayName.toLowerCase() === 'chatgpt' 
    ? dataoAssistant 
    : teamMembers.find(member => 
        member.name.toLowerCase().includes(displayName.toLowerCase())
      );

  if (!mentionedUser) return null;

  const isCurrentUserMentioned = mentionedUser.name === teamMembers[0].name;

  return (
    <span 
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-sm font-medium ${
        isCurrentUserMentioned 
          ? 'bg-primary-600 text-white' 
          : 'bg-white text-gray-700 border border-gray-100'
      }`}
    >
      <img 
        src={mentionedUser.avatar}
        alt=""
        className="w-4 h-4 rounded-full object-cover"
      />
      <span>{mentionedUser.name}</span>
    </span>
  );
}