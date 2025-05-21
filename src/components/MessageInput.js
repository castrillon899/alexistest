import React, { useState } from 'react';
import './MessageInput.css'; // Import the CSS file

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  // currentUserId is not used in this component directly for sending,
  // as onSendMessage from ChatApp.js already knows the current user.
  // const currentUserId = '1'; 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === '') return;
    onSendMessage(message); // Pass only the message text
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="message-input-form">
      <button type="button" className="icon-button" aria-label="Attach file">
        📎
      </button>
      <div className="message-input-wrapper">
        <input
          type="text"
          className="message-input-field"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message" // Standard placeholder
        />
        <button type="button" className="icon-button" aria-label="Emoji">
          😊
        </button>
      </div>
      <button 
        type="submit" 
        className="message-send-button" 
        disabled={message.trim() === ''}
        aria-label="Send message"
      >
        ➢ 
      </button>
    </form>
  );
};

export default MessageInput;
