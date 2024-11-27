import { TeamMember } from './teamMembers';

export function formatTimestamp(date?: Date): string {
  const now = date || new Date();
  return now.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

export function formatDate(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  }
}

export function generateMessageId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function createUserMessage(content: string, username: string, avatar?: string, date?: Date) {
  const messageDate = date || new Date();
  return {
    id: generateMessageId(),
    content,
    sender: {
      name: username,
      avatar
    },
    timestamp: formatTimestamp(messageDate),
    date: messageDate,
    isCurrentUser: true,
    reactions: {}
  };
}

export function createTeamMessage(content: string, teamMember: TeamMember, date?: Date) {
  const messageDate = date || new Date();
  return {
    id: generateMessageId(),
    content,
    sender: {
      name: teamMember.name,
      avatar: teamMember.avatar
    },
    timestamp: formatTimestamp(messageDate),
    date: messageDate,
    isCurrentUser: false,
    reactions: {}
  };
}

export function createAIMessage(content: string, date?: Date) {
  const messageDate = date || new Date();
  return {
    id: generateMessageId(),
    content,
    sender: {
      name: "ChatGPT",
      isAI: true
    },
    timestamp: formatTimestamp(messageDate),
    date: messageDate,
    isCurrentUser: false,
    reactions: {}
  };
}

export function shouldShowDateSeparator(currentMessage: { date: Date }, previousMessage?: { date: Date }): boolean {
  if (!previousMessage) return true;
  
  const currentDate = new Date(currentMessage.date);
  const previousDate = new Date(previousMessage.date);
  
  return currentDate.toDateString() !== previousDate.toDateString();
}