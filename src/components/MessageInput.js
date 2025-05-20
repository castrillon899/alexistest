import React, { useState } from 'react';
import './MessageInput.css'; // Import the CSS file

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const currentUserId = '1'; // Assuming 'Alice' is the current user

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === '') return;
    onSendMessage(message, currentUserId);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="message-input-form">
      <input
        type="text"
        className="message-input-field"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button type="submit" className="message-send-button" disabled={message.trim() === ''}>
        Send
      </button>
    </form>
  );
};

export default MessageInput;
