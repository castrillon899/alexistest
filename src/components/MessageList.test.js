import React from 'react';
import { render, screen, within } from '@testing-library/react';
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

const getFormattedTime = (date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

describe('MessageList', () => {
  test('renders messages with correct text, sender (if not current user), timestamp, and status ticks (for current user)', () => {
    render(<MessageList messages={mockMessages} users={mockUsers} currentUserId="1" />);

    const messageItems = screen.getAllByRole('generic', { name: /message item/i }); // Assuming .message-item has aria-label or similar
    // If not, query by class and then iterate, or find by text content as below.

    // Message 1 (from current user '1')
    const msg1Item = screen.getByText('Hello Bob!').closest('.message-item');
    expect(msg1Item).toBeInTheDocument();
    expect(within(msg1Item).queryByText('Alice')).not.toBeInTheDocument(); // Sender name hidden for current user
    expect(within(msg1Item).getByText(getFormattedTime(mockMessages[0].timestamp))).toBeInTheDocument();
    expect(within(msg1Item).getByText('✓✓')).toBeInTheDocument(); // Status ticks

    // Message 2 (from other user '2')
    const msg2Item = screen.getByText('Hi Alice!').closest('.message-item');
    expect(msg2Item).toBeInTheDocument();
    expect(within(msg2Item).getByText('Bob')).toBeInTheDocument(); // Sender name visible
    expect(within(msg2Item).getByText(getFormattedTime(mockMessages[1].timestamp))).toBeInTheDocument();
    expect(within(msg2Item).queryByText('✓✓')).not.toBeInTheDocument(); // No status ticks

    // Message 3 (from current user '1')
    const msg3Item = screen.getByText('How are you?').closest('.message-item');
    expect(msg3Item).toBeInTheDocument();
    expect(within(msg3Item).queryByText('Alice')).not.toBeInTheDocument();
    expect(within(msg3Item).getByText(getFormattedTime(mockMessages[2].timestamp))).toBeInTheDocument();
    expect(within(msg3Item).getByText('✓✓')).toBeInTheDocument();
  });

  test('messages from the current user have "current-user" class and others have "other-user" class', () => {
    render(<MessageList messages={mockMessages} users={mockUsers} currentUserId="1" />);

    const message1 = screen.getByText('Hello Bob!').closest('.message-item');
    expect(message1).toHaveClass('current-user');
    expect(message1).not.toHaveClass('other-user');

    const message2 = screen.getByText('Hi Alice!').closest('.message-item');
    expect(message2).toHaveClass('other-user');
    expect(message2).not.toHaveClass('current-user');

    const message3 = screen.getByText('How are you?').closest('.message-item');
    expect(message3).toHaveClass('current-user');
    expect(message3).not.toHaveClass('other-user');
  });

  test('displays "Unknown User" if user not found for a message from another user', () => {
    const messagesWithUnknownUser = [
      { id: 'm4', userId: '3', text: 'Message from unknown', timestamp: new Date('2023-01-01T10:03:00Z') },
    ];
    render(<MessageList messages={messagesWithUnknownUser} users={mockUsers} currentUserId="1" />);
    
    const messageItem = screen.getByText('Message from unknown').closest('.message-item');
    // Using within to scope the query to the specific message item
    expect(within(messageItem).getByText('Unknown User')).toBeInTheDocument(); 
  });

  test('renders correctly with no messages', () => {
    render(<MessageList messages={[]} users={mockUsers} currentUserId="1" />);
    const messageItems = screen.queryAllByText(/.*/, { selector: '.message-item' });
    expect(messageItems).toHaveLength(0);
  });
});
