export interface Reaction {
  emoji: string;
  users: string[];
}

export interface Sender {
  name: string;
  avatar?: string;
  isAI?: boolean;
}

export interface QuotedMessage {
  id: string;
  content: string;
  sender: Sender;
}

export interface Attachment {
  type: 'image';
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
}

export interface ChatMessageProps {
  id: string;
  content: string;
  sender: Sender;
  timestamp: string;
  date: Date;
  isCurrentUser: boolean;
  reactions: Record<string, Reaction>;
  quotedMessage?: QuotedMessage;
  isEdited?: boolean;
  attachments?: Attachment[];
}