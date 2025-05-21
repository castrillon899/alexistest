import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
// UserList import is removed as it's no longer used
// import UserList from './UserList'; 
// import './ChatApp.css'; // If ChatApp.css is created for specific ChatApp styles

const mockUsersData = [ // Renamed to avoid conflict if 'users' state is needed for other purposes
  { id: '1', name: 'Alice (You)' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
  { id: '4', name: 'Diana' },
];

const initialMessages = [
  { id: 'm1', userId: '1', text: 'Hey everyone, welcome to the chat!', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
  { id: 'm2', userId: '2', text: 'Hi Alice! Glad to be here.', timestamp: new Date(Date.now() - 1000 * 60 * 4) },
  { id: 'm3', userId: '3', text: 'Hello!', timestamp: new Date(Date.now() - 1000 * 60 * 3) },
];

const ChatApp = () => {
  // Users state is kept for now as MessageList needs it to resolve names.
  // If UserList was the only consumer, this could be simplified.
  const [users, setUsers] = useState(mockUsersData); 
  const [messages, setMessages] = useState(initialMessages);
  const currentUserId = '1'; // Alice is the current user

  const handleSendMessage = (text) => {
    const newMessage = {
      id: `m${Date.now()}`,
      userId: currentUserId,
      text,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  // Simulate real-time messages from other users
  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessages((prevMessages) => {
        const otherUsers = users.filter(u => u.id !== currentUserId);
        if (otherUsers.length === 0) return prevMessages; // No one else to send messages
        const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
        const newMessage = {
          id: `m${Date.now()}`,
          userId: randomUser.id,
          text: `A new message from ${randomUser.name}! (${Date.now() % 1000})`,
          timestamp: new Date(),
        };
        return [...prevMessages, newMessage];
      });
    }, Math.random() * 7000 + 8000); // every 8-15 seconds

    return () => clearInterval(intervalId);
  }, [users, currentUserId]); // Added users and currentUserId to dependency array

  return (
    <div className="chat-container">
      {/* UserList column div is removed */}
      <div className="message-area-column">
        <div className="message-list-wrapper">
          <MessageList messages={messages} users={users} currentUserId={currentUserId} />
        </div>
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatApp;
