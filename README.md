# Supachat

A modern, feature-rich chat UI component for React & Supabase with a professional design and comprehensive features.

Demo: [Click here](https://supachatui.netlify.app/)


## Features

- 💬 Real-time messaging with smooth animations
- 👥 User mentions with smart suggestions
- 😊 Emoji reactions and picker
- 💭 Message replies and quotes
- ✏️ Message editing and deletion
- 📎 Image attachments with preview
- 🎨 Professional UI with Tailwind CSS
- 📱 Responsive design
- 📅 Date separators for conversations
- 🔄 Message status indicators
- 🎯 Customizable themes

## Installation

1. Install the package and its peer dependencies:

```bash
npm install @emoji-mart/data @emoji-mart/react emoji-mart lucide-react
```

2. Add Tailwind CSS to your project if not already installed:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. Configure Tailwind CSS by updating your `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
      },
      boxShadow: {
        'message': '0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
        'hover': '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-up': 'fadeUp 0.2s ease-out',
        'fade-down': 'fadeDown 0.2s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
      },
    },
  },
  plugins: [],
};
```

## Basic Usage

1. Import and use the ChatContainer component:

```typescript
import { ChatContainer } from './components/ChatContainer/ChatContainer';
import type { ChatMessageProps } from './types/chat';

function App() {
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const currentUser = {
    id: 'user1',
    name: 'John Doe',
    avatar: 'https://example.com/avatar.jpg'
  };

  const handleSendMessage = (content: string, quotedMessage?: ChatMessageProps) => {
    const newMessage = {
      id: generateMessageId(),
      content,
      sender: {
        name: currentUser.name,
        avatar: currentUser.avatar
      },
      timestamp: new Date().toLocaleTimeString(),
      date: new Date(),
      isCurrentUser: true,
      reactions: {},
      quotedMessage
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="h-screen bg-white">
      <div className="h-full flex flex-col">
        <main className="flex-1">
          <ChatContainer 
            messages={messages}
            onSendMessage={handleSendMessage}
            onAddReaction={(messageId, emoji) => {/* Handle reaction */}}
            onRemoveReaction={(messageId, emoji) => {/* Handle reaction removal */}}
            onDeleteMessage={(messageId) => {/* Handle message deletion */}}
            onEditMessage={(messageId, newContent) => {/* Handle message edit */}}
            currentUserName={currentUser.name}
          />
        </main>
      </div>
    </div>
  );
}
```

## Supabase Integration

### Real-time Chat

1. Install Supabase client:

```bash
npm install @supabase/supabase-js
```

2. Initialize Supabase client:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);
```

3. Set up the messages table:

```sql
create table messages (
  id uuid default uuid_generate_v4() primary key,
  content text not null,
  user_id uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  quoted_message_id uuid references messages(id),
  reactions jsonb default '{}'::jsonb,
  attachments jsonb default '[]'::jsonb
);

-- Enable RLS
alter table messages enable row level security;

-- Allow read access to all authenticated users
create policy "Allow read access to authenticated users"
on messages for select
to authenticated
using (true);

-- Allow insert access to authenticated users
create policy "Allow insert access to authenticated users"
on messages for insert
to authenticated
with check (true);

-- Allow update access to message owners
create policy "Allow update access to message owners"
on messages for update
to authenticated
using (user_id = auth.uid());

-- Allow delete access to message owners
create policy "Allow delete access to message owners"
on messages for delete
to authenticated
using (user_id = auth.uid());
```

4. Subscribe to real-time updates:

```typescript
useEffect(() => {
  const channel = supabase
    .channel('messages')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages'
      },
      (payload) => {
        // Handle different events (INSERT, UPDATE, DELETE)
        switch (payload.eventType) {
          case 'INSERT':
            handleNewMessage(payload.new);
            break;
          case 'UPDATE':
            handleMessageUpdate(payload.new);
            break;
          case 'DELETE':
            handleMessageDelete(payload.old.id);
            break;
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

### Image Storage

1. Create a storage bucket in Supabase:

```sql
-- Allow public access to chat attachments
CREATE POLICY "Allow public access to chat attachments"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'chat-attachments');

-- Allow authenticated uploads
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'chat-attachments');
```

2. Handle image uploads:

```typescript
async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('chat-attachments')
    .upload(fileName, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('chat-attachments')
    .getPublicUrl(fileName);

  return publicUrl;
}
```

## Component Props

### ChatContainer Props

| Prop | Type | Description |
|------|------|-------------|
| messages | ChatMessageProps[] | Array of chat messages |
| onSendMessage | (content: string, quotedMessage?: ChatMessageProps) => void | Handler for sending messages |
| onAddReaction | (messageId: string, emoji: string) => void | Handler for adding reactions |
| onRemoveReaction | (messageId: string, emoji: string) => void | Handler for removing reactions |
| onDeleteMessage | (messageId: string) => void | Handler for deleting messages |
| onEditMessage | (messageId: string, newContent: string) => void | Handler for editing messages |
| currentUserName | string | Name of the current user |

### Message Types

```typescript
interface ChatMessageProps {
  id: string;
  content: string;
  sender: {
    name: string;
    avatar?: string;
    isAI?: boolean;
  };
  timestamp: string;
  date: Date;
  isCurrentUser: boolean;
  reactions: Record<string, Reaction>;
  quotedMessage?: QuotedMessage;
  isEdited?: boolean;
  attachments?: Attachment[];
}

interface Reaction {
  emoji: string;
  users: string[];
}

interface QuotedMessage {
  id: string;
  content: string;
  sender: {
    name: string;
    avatar?: string;
  };
}

interface Attachment {
  type: 'image';
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
}
```

## License

MIT License - feel free to use this component in your projects.
