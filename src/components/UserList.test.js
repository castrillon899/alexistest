import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserList from './UserList';

const mockUsers = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
];

describe('UserList', () => {
  test('renders a header and a list of user names', () => {
    render(<UserList users={mockUsers} />);
    
    // Check for the header
    expect(screen.getByRole('heading', { name: 'Users' })).toBeInTheDocument();

    // Check for each user name
    mockUsers.forEach(user => {
      expect(screen.getByText(user.name)).toBeInTheDocument();
    });
  });

  test('renders the correct number of user list items', () => {
    render(<UserList users={mockUsers} />);
    
    // UserList renders <li> items with class "user-list-item"
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(mockUsers.length);
  });

  test('renders correctly with an empty list of users', () => {
    render(<UserList users={[]} />);
    
    expect(screen.getByRole('heading', { name: 'Users' })).toBeInTheDocument();
    
    // Should not find any list items if users array is empty
    const listItems = screen.queryAllByRole('listitem');
    expect(listItems).toHaveLength(0);
  });

  test('each list item has the class "user-list-item"', () => {
    render(<UserList users={mockUsers} />);
    
    mockUsers.forEach(user => {
      const userElement = screen.getByText(user.name);
      expect(userElement).toHaveClass('user-list-item'); // In UserList.js, the <li> has the class
    });
  });
});
