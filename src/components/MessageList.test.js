import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MessageList from './MessageList';

const mockUsers = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
];

const mockMessages = [
  { id: 'm1', userId: '1', text: 'Hello Bob!', timestamp: new Date('2023-01-01T10:00:00Z') },
  { id: 'm2', userId: '2', text: 'Hi Alice!', timestamp: new Date('2023-01-01T10:01:00Z') },
  { id: 'm3', userId: '1', text: 'How are you?', timestamp: new Date('2023-01-01T10:02:00Z') },
];

describe('MessageList', () => {
  test('renders a list of messages with sender name and timestamp', () => {
    render(<MessageList messages={mockMessages} users={mockUsers} currentUserId="1" />);

    const messageElements = screen.getAllByRole('listitem'); // Assuming messages are list items or have a similar role
    // If not list items, use a more generic query like data-testid if added to message items.
    // Based on current MessageList.js, each message is a div. Let's query by text content.

    expect(screen.getByText('Hello Bob!')).toBeInTheDocument();
    expect(screen.getByText((content, element) => element.className === 'message-sender' && content === 'Alice')).toBeInTheDocument();
    expect(screen.getByText(new Date('2023-01-01T10:00:00Z').toLocaleTimeString())).toBeInTheDocument();

    expect(screen.getByText('Hi Alice!')).toBeInTheDocument();
    expect(screen.getByText((content, element) => element.className === 'message-sender' && content === 'Bob')).toBeInTheDocument();
    expect(screen.getByText(new Date('2023-01-01T10:01:00Z').toLocaleTimeString())).toBeInTheDocument();
    
    expect(screen.getByText('How are you?')).toBeInTheDocument();
  });

  test('messages from the current user have "current-user" class and others have "other-user" class', () => {
    render(<MessageList messages={mockMessages} users={mockUsers} currentUserId="1" />);

    // Message 1 from Alice (current user '1')
    const message1 = screen.getByText('Hello Bob!').closest('.message-item');
    expect(message1).toHaveClass('current-user');
    expect(message1).not.toHaveClass('other-user');

    // Message 2 from Bob (user '2')
    const message2 = screen.getByText('Hi Alice!').closest('.message-item');
    expect(message2).toHaveClass('other-user');
    expect(message2).not.toHaveClass('current-user');

    // Message 3 from Alice (current user '1')
    const message3 = screen.getByText('How are you?').closest('.message-item');
    expect(message3).toHaveClass('current-user');
    expect(message3).not.toHaveClass('other-user');
  });

  test('displays "Unknown User" if user not found', () => {
    const messagesWithUnknownUser = [
      { id: 'm4', userId: '3', text: 'Message from unknown', timestamp: new Date('2023-01-01T10:03:00Z') },
    ];
    render(<MessageList messages={messagesWithUnknownUser} users={mockUsers} currentUserId="1" />);
    
    expect(screen.getByText('Message from unknown')).toBeInTheDocument();
    // Check for the sender name specifically within the message item structure
    const messageItem = screen.getByText('Message from unknown').closest('.message-item');
    expect(messageItem.querySelector('.message-sender')).toHaveTextContent('Unknown User');
  });

  test('renders correctly with no messages', () => {
    render(<MessageList messages={[]} users={mockUsers} currentUserId="1" />);
    // The component renders a container div and potentially a header if it were still there.
    // No messages means no .message-item elements.
    const messageItems = screen.queryAllByText(/./, { selector: '.message-item' }); // Query for any text within a message-item
    expect(messageItems).toHaveLength(0);
  });
});
