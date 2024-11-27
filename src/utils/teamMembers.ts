export interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  role: string;
}

export const dataoAssistant = {
  id: 'chatgpt',
  name: 'ChatGPT',
  avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzRGNDZFNSIvPjwvc3ZnPg==',
  isAI: true,
  role: 'AI Assistant'
};

export const teamMembers: TeamMember[] = [
  {
    id: 'alex',
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80',
    role: 'Product Manager'
  },
  {
    id: 'sarah',
    name: 'Sarah Miller',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80',
    role: 'UX Designer'
  },
  {
    id: 'james',
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80',
    role: 'Developer'
  },
  {
    id: 'michael',
    name: 'Michael Thompson',
    role: 'Project Coordinator'
  }
];