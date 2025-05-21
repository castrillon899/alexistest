import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatApp from './ChatApp';

// Mock child components to isolate ChatApp logic
// MessageList mock updated to reflect new timestamp format and structure
jest.mock('./MessageList', () => ({ messages, users, currentUserId }) => (
  <div data-testid="messagelist">
    {messages.map(msg => (
      <div key={msg.id} data-testid="message" className={msg.userId === currentUserId ? 'current-user' : 'other-user'}>
        <div className="message-content">
          {msg.userId !== currentUserId && (
            <div className="message-sender">{users.find(u => u.id === msg.userId)?.name}</div>
          )}
          <div className="message-text">{msg.text}</div>
          <div className="message-meta">
            <span className="message-timestamp">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {msg.userId === currentUserId && (
              <span className="message-status-ticks" data-testid="status-ticks">✓✓</span>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
));

// MessageInput mock updated to reflect that onSendMessage now only takes text
jest.mock('./MessageInput', () => ({ onSendMessage }) => (
  <form data-testid="messageinput" onSubmit={(e) => { e.preventDefault(); onSendMessage('Test message from mock'); }}>
    <input type="text" defaultValue="Test message from mock" />
    <button type="submit" aria-label="Send message">➢</button>
  </form>
));

// UserList mock is removed as the component is no longer used by ChatApp
// jest.mock('./UserList', ...);

describe('ChatApp', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders MessageList and MessageInput', () => {
    render(<ChatApp />);
    expect(screen.getByTestId('messagelist')).toBeInTheDocument();
    expect(screen.getByTestId('messageinput')).toBeInTheDocument();
    expect(screen.queryByTestId('userlist')).not.toBeInTheDocument(); // Ensure UserList is not rendered
  });

  test('handleSendMessage adds a new message to the messages state', () => {
    render(<ChatApp />);
    
    // Initial messages (from mock data in ChatApp.js)
    // Alice (You): "Hey everyone, welcome to the chat!"
    // Bob: "Hi Alice! Glad to be here."
    // Charlie: "Hello!"
    // These are defined in ChatApp.js `initialMessages`
    const initialMessagesCount = 3; 
    expect(screen.getAllByTestId('message')).toHaveLength(initialMessagesCount);

    // Simulate sending a message via the mocked MessageInput
    fireEvent.submit(screen.getByTestId('messageinput'));
    
    const messages = screen.getAllByTestId('message');
    expect(messages).toHaveLength(initialMessagesCount + 1);
    
    const lastMessage = messages[initialMessagesCount];
    // Check content of the last message based on the mocked MessageList structure
    expect(lastMessage.querySelector('.message-text')).toHaveTextContent('Test message from mock');
    // Current user is '1' (Alice (You)) as defined in ChatApp.js
    expect(lastMessage.querySelector('.message-sender')).toBeNull(); // Sender name not shown for current user
    expect(lastMessage.querySelector('.message-status-ticks')).toBeInTheDocument(); // Status ticks present
    expect(lastMessage).toHaveClass('current-user');
  });

  test('real-time message simulation adds a new message', () => {
    render(<ChatApp />);
    const initialMessagesCount = 3;
    expect(screen.getAllByTestId('message')).toHaveLength(initialMessagesCount);

    act(() => {
      jest.advanceTimersByTime(15000); // Interval is Math.random() * 7000 + 8000
    });
    
    const messages = screen.getAllByTestId('message');
    expect(messages.length).toBeGreaterThanOrEqual(initialMessagesCount + 1); 
    
    const lastMessage = messages[messages.length - 1];
    // Check if the last message is from another user (not current user '1')
    expect(lastMessage).toHaveClass('other-user');
    expect(lastMessage.querySelector('.message-sender')).not.toBeNull(); // Sender name should be present
    expect(lastMessage.querySelector('.message-status-ticks')).toBeNull(); // No status ticks for other users
    expect(lastMessage.querySelector('.message-text')).toHaveTextContent(/A new message from (Bob|Charlie|Diana)! \(\d+\)/);
  });
});
