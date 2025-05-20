import React from 'react';
import './UserList.css'; // Import the CSS file

const UserList = ({ users }) => {
  return (
    // The parent div with class "user-list-column" in ChatApp.js handles overall width, border, etc.
    // This component now uses its own CSS for internal padding and list styling.
    <>
      <h2 className="user-list-header">Users</h2>
      <ul className="user-list">
        {users.map(user => (
          <li key={user.id} className="user-list-item">
            {user.name}
          </li>
        ))}
      </ul>
    </>
  );
};

export default UserList;
