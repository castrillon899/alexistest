import React from 'react';
import './MessageList.css'; // Import the CSS file

const MessageList = ({ messages, users, currentUserId }) => {
  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  return (
    <div className="message-list-container">
      {messages.map(msg => (
        <div
          key={msg.id}
          className={`message-item ${msg.userId === currentUserId ? 'current-user' : 'other-user'}`}
        >
          <div className="message-content">
            {/* Sender name is only shown for other users' messages */}
            {msg.userId !== currentUserId && (
              <div className="message-sender">{getUserName(msg.userId)}</div>
            )}
            <div className="message-text">{msg.text}</div>
            <div className="message-meta">
              <span className="message-timestamp">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {msg.userId === currentUserId && (
                <span className="message-status-ticks">✓✓</span> // Placeholder for ticks
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
