import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatApp from './ChatApp';

// Mock child components to isolate ChatApp logic
jest.mock('./MessageList', () => ({ messages, users, currentUserId }) => (
  <div data-testid="messagelist">
    {messages.map(msg => (
      <div key={msg.id} data-testid="message">
        {msg.text} - {users.find(u => u.id === msg.userId)?.name} ({new Date(msg.timestamp).toLocaleTimeString()})
        {msg.userId === currentUserId && <span> (You)</span>}
      </div>
    ))}
  </div>
));

jest.mock('./MessageInput', () => ({ onSendMessage }) => (
  <form data-testid="messageinput" onSubmit={(e) => { e.preventDefault(); onSendMessage('Test message'); }}>
    <input type="text" defaultValue="Test message" />
    <button type="submit">Send</button>
  </form>
));

jest.mock('./UserList', () => ({ users }) => (
  <div data-testid="userlist">
    {users.map(user => <div key={user.id}>{user.name}</div>)}
  </div>
));

describe('ChatApp', () => {
  beforeEach(() => {
    jest.useFakeTimers(); // Use fake timers for setTimeout/setInterval
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers(); // Restore real timers
  });

  test('renders MessageList, MessageInput, and UserList', () => {
    render(<ChatApp />);
    expect(screen.getByTestId('messagelist')).toBeInTheDocument();
    expect(screen.getByTestId('messageinput')).toBeInTheDocument();
    expect(screen.getByTestId('userlist')).toBeInTheDocument();
  });

  test('handleSendMessage adds a new message to the messages state', () => {
    render(<ChatApp />);
    
    // Initial messages (from mock data in ChatApp.js)
    // Alice: "Hey everyone, welcome to the chat!"
    // Bob: "Hi Alice! Glad to be here."
    // Charlie: "Hello!"
    expect(screen.getAllByTestId('message')).toHaveLength(3);

    // Simulate sending a message via the mocked MessageInput
    // The mocked MessageInput's submit handler calls onSendMessage('Test message')
    fireEvent.submit(screen.getByTestId('messageinput'));
    
    const messages = screen.getAllByTestId('message');
    expect(messages).toHaveLength(4);
    expect(messages[3]).toHaveTextContent('Test message - Alice (You)'); // '1' is current user
    expect(messages[3]).toHaveTextContent('(You)');
  });

  test('real-time message simulation adds a new message', () => {
    render(<ChatApp />);
    expect(screen.getAllByTestId('message')).toHaveLength(3); // Initial messages

    // Advance timers by a significant amount to trigger the interval
    // The interval is Math.random() * 7000 + 8000
    act(() => {
      jest.advanceTimersByTime(15000); 
    });
    
    // A new message should have been added by the simulation
    const messages = screen.getAllByTestId('message');
    expect(messages.length).toBeGreaterThanOrEqual(4); 
    // We can't know exactly who sent it or the text due to randomness,
    // but we can check it's not from the current user '1' (Alice)
    // and that it has the generic structure.
    const lastMessage = messages[messages.length - 1];
    expect(lastMessage).not.toHaveTextContent('Alice (You)');
    expect(lastMessage).toHaveTextContent(/A new message from (Bob|Charlie|Diana)! \(\d+\)/);
  });
});
