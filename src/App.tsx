import React, { useState } from 'react';
import { ChatContainer } from './components/ChatContainer/ChatContainer';
import type { ChatMessageProps } from './types/chat';
import { createUserMessage, createAIMessage, createTeamMessage } from './utils/messageUtils';
import { teamMembers } from './utils/teamMembers';

function App() {
  const currentUser = teamMembers[0]; // Alex Chen is the current user
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const [messages, setMessages] = useState<ChatMessageProps[]>([
    createAIMessage(
      "Hello! I'm ChatGPT, your AI assistant. How can I help you today?",
      twoDaysAgo
    ),
    createTeamMessage(
      "Hi team! I've just pushed some updates to the main branch. @Sarah Miller could you review the changes?",
      teamMembers[2], // James
      twoDaysAgo
    ),
    createTeamMessage(
      "I'll take a look at it right away @James Wilson. Have you updated the documentation as well?",
      teamMembers[1], // Sarah
      twoDaysAgo
    ),
    createTeamMessage(
      "@ChatGPT can you help me understand the recent performance metrics?",
      teamMembers[3], // Michael
      yesterday
    ),
    createAIMessage(
      "@Michael Thompson Based on the latest data, the application's response time has improved by 23% after the recent optimizations. Would you like me to generate a detailed report?",
      yesterday
    ),
    createUserMessage(
      "Great progress everyone! @Sarah Miller @James Wilson let's schedule a quick review meeting tomorrow.",
      currentUser.name,
      currentUser.avatar,
      yesterday
    ),
    createTeamMessage(
      "Sounds good @Alex Chen! I've also noticed some potential improvements in the API endpoints.",
      teamMembers[1], // Sarah
      new Date()
    ),
    createTeamMessage(
      "I'll prepare a detailed overview of the changes for tomorrow's meeting.",
      teamMembers[2], // James
      new Date()
    ),
    createTeamMessage(
      "@Alex Chen @ChatGPT I need help with the deployment process for the new features.",
      teamMembers[3], // Michael
      new Date()
    ),
    createAIMessage(
      "@Michael Thompson I'll guide you through the deployment steps. First, let's verify your configuration and ensure all dependencies are up to date.",
      new Date()
    ),
    createUserMessage(
      "Thanks @ChatGPT! @Michael Thompson I'll join the deployment discussion as well. We should document this process for future reference.",
      currentUser.name,
      currentUser.avatar,
      new Date()
    ),
    createTeamMessage(
      "I've created a draft of the deployment documentation. @Alex Chen could you review it when you have a moment?",
      teamMembers[1], // Sarah
      new Date()
    ),
  ]);

  const handleSendMessage = (content: string, quotedMessage?: ChatMessageProps) => {
    const newMessage = {
      ...createUserMessage(
        content,
        currentUser.name,
        currentUser.avatar
      ),
      quotedMessage: quotedMessage ? {
        id: quotedMessage.id,
        content: quotedMessage.content,
        sender: quotedMessage.sender
      } : undefined
    };

    setMessages([...messages, newMessage]);

    // Simulate AI response
    if (content.toLowerCase().includes('help') || content.toLowerCase().includes('?')) {
      setTimeout(() => {
        const aiResponse = createAIMessage(
          "@Alex Chen I'll help you with that. Could you provide more specific details?"
        );
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prevMessages => prevMessages.filter(message => message.id !== messageId));
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    setMessages(prevMessages =>
      prevMessages.map(message =>
        message.id === messageId
          ? { ...message, content: newContent, isEdited: true }
          : message
      )
    );
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages(prevMessages => 
      prevMessages.map(message => {
        if (message.id === messageId) {
          const updatedReactions = { ...message.reactions };
          if (updatedReactions[emoji]) {
            if (!updatedReactions[emoji].users.includes(currentUser.name)) {
              updatedReactions[emoji] = {
                ...updatedReactions[emoji],
                users: [...updatedReactions[emoji].users, currentUser.name]
              };
            }
          } else {
            updatedReactions[emoji] = {
              emoji,
              users: [currentUser.name]
            };
          }
          return { ...message, reactions: updatedReactions };
        }
        return message;
      })
    );
  };

  const handleRemoveReaction = (messageId: string, emoji: string) => {
    setMessages(prevMessages =>
      prevMessages.map(message => {
        if (message.id === messageId && message.reactions[emoji]) {
          const updatedReactions = { ...message.reactions };
          updatedReactions[emoji] = {
            ...updatedReactions[emoji],
            users: updatedReactions[emoji].users.filter(user => user !== currentUser.name)
          };
          
          if (updatedReactions[emoji].users.length === 0) {
            delete updatedReactions[emoji];
          }
          
          return { ...message, reactions: updatedReactions };
        }
        return message;
      })
    );
  };

  return (
    <div className="h-screen bg-white">
      <div className="h-full flex flex-col">
        <main className="flex-1">
          <ChatContainer 
            messages={messages}
            onSendMessage={handleSendMessage}
            onAddReaction={handleAddReaction}
            onRemoveReaction={handleRemoveReaction}
            onDeleteMessage={handleDeleteMessage}
            onEditMessage={handleEditMessage}
            currentUserName={currentUser.name}
          />
        </main>
      </div>
    </div>
  );
}

export default App;