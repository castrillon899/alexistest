import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MessageInput from './MessageInput';

describe('MessageInput', () => {
  test('renders an input field and a send button', () => {
    render(<MessageInput onSendMessage={() => {}} />);
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });

  test('input field updates its value on change', () => {
    render(<MessageInput onSendMessage={() => {}} />);
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Hello there' } });
    expect(input.value).toBe('Hello there');
  });

  test('send button is disabled when input is empty and enabled when input has text', () => {
    render(<MessageInput onSendMessage={() => {}} />);
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: 'Send' });

    expect(sendButton).toBeDisabled();

    fireEvent.change(input, { target: { value: 'Some text' } });
    expect(sendButton).not.toBeDisabled();

    fireEvent.change(input, { target: { value: '' } });
    expect(sendButton).toBeDisabled();
  });

  test('calls onSendMessage with the input text when form is submitted and clears the input', () => {
    const mockOnSendMessage = jest.fn();
    render(<MessageInput onSendMessage={mockOnSendMessage} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const form = input.closest('form'); // Or use a data-testid on the form

    fireEvent.change(input, { target: { value: 'My new message' } });
    expect(input.value).toBe('My new message'); // Ensure value is set

    fireEvent.submit(form);
    
    expect(mockOnSendMessage).toHaveBeenCalledTimes(1);
    expect(mockOnSendMessage).toHaveBeenCalledWith('My new message'); // Note: MessageInput internally uses currentUserId='1'
    expect(input.value).toBe(''); // Input should be cleared
  });

  test('does not call onSendMessage if the input is empty or only whitespace', () => {
    const mockOnSendMessage = jest.fn();
    render(<MessageInput onSendMessage={mockOnSendMessage} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: '   ' } }); // Whitespace only
    fireEvent.submit(form);
    
    expect(mockOnSendMessage).not.toHaveBeenCalled();
    expect(input.value).toBe('   '); // Input should not be cleared if message not sent
  });
});
