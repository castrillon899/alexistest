import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MessageInput from './MessageInput';

describe('MessageInput', () => {
  test('renders an input field, placeholder icons, and a send button', () => {
    render(<MessageInput onSendMessage={() => {}} />);
    // Check for new placeholder "Type a message"
    expect(screen.getByPlaceholderText('Type a message')).toBeInTheDocument();
    // Check for send button by its new aria-label or text content
    expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument(); 
    // Check for placeholder icons by aria-label
    expect(screen.getByRole('button', { name: 'Attach file' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Emoji' })).toBeInTheDocument();
  });

  test('input field updates its value on change', () => {
    render(<MessageInput onSendMessage={() => {}} />);
    const input = screen.getByPlaceholderText('Type a message');
    fireEvent.change(input, { target: { value: 'Hello there' } });
    expect(input.value).toBe('Hello there');
  });

  test('send button is disabled when input is empty and enabled when input has text', () => {
    render(<MessageInput onSendMessage={() => {}} />);
    const input = screen.getByPlaceholderText('Type a message');
    // Select send button by its aria-label or specific class if needed
    const sendButton = screen.getByRole('button', { name: 'Send message' });

    expect(sendButton).toBeDisabled();

    fireEvent.change(input, { target: { value: 'Some text' } });
    expect(sendButton).not.toBeDisabled();

    fireEvent.change(input, { target: { value: '' } });
    expect(sendButton).toBeDisabled();
  });

  test('calls onSendMessage with the input text when form is submitted and clears the input', () => {
    const mockOnSendMessage = jest.fn();
    render(<MessageInput onSendMessage={mockOnSendMessage} />);
    
    const input = screen.getByPlaceholderText('Type a message');
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: 'My new message' } });
    expect(input.value).toBe('My new message');

    fireEvent.submit(form);
    
    expect(mockOnSendMessage).toHaveBeenCalledTimes(1);
    // onSendMessage now only takes the message text
    expect(mockOnSendMessage).toHaveBeenCalledWith('My new message'); 
    expect(input.value).toBe('');
  });

  test('does not call onSendMessage if the input is empty or only whitespace', () => {
    const mockOnSendMessage = jest.fn();
    render(<MessageInput onSendMessage={mockOnSendMessage} />);
    
    const input = screen.getByPlaceholderText('Type a message');
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(form);
    
    expect(mockOnSendMessage).not.toHaveBeenCalled();
    expect(input.value).toBe('   ');
  });
});
