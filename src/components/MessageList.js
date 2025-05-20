import React from 'react';
import './MessageList.css'; // Import the CSS file

const MessageList = ({ messages, users, currentUserId }) => { // Added currentUserId prop
  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  return (
    <div className="message-list-container"> {/* Changed from React.Fragment to div to apply class */}
      {/* The h2 for "Messages" can be styled via App.css or a general component style if needed */}
      {/* For now, assuming it's styled globally or is fine as is. */}
      {messages.map(msg => (
        <div
          key={msg.id}
          className={`message-item ${msg.userId === currentUserId ? 'current-user' : 'other-user'}`}
        >
          <div className="message-sender">{getUserName(msg.userId)}</div>
          <div>{msg.text}</div>
          <div className="message-timestamp">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
