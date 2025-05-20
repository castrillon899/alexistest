import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';
// import './ChatApp.css'; // If ChatApp.css is created for specific ChatApp styles

const mockUsers = [
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
  const [users, setUsers] = useState(mockUsers);
  const [messages, setMessages] = useState(initialMessages);
  const currentUserId = '1'; // Alice is the current user

  const handleSendMessage = (text) => { // Removed userId from params, as it's fixed to currentUserId
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
        const otherUsers = mockUsers.filter(u => u.id !== currentUserId);
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
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    // className "chat-container" is styled by App.css to use flex-grow and fill available space
    <div className="chat-container">
      <div className="user-list-column">
        <UserList users={users} />
      </div>
      <div className="message-area-column">
        {/* Removed the h2 "Messages" from here, as it was hidden in MessageList.css and not really fitting here */}
        <div className="message-list-wrapper">
          <MessageList messages={messages} users={users} currentUserId={currentUserId} />
        </div>
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatApp;
