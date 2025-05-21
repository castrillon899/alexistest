import React from 'react';
import ChatApp from './components/ChatApp';
import './App.css';

function App() {
  const contactName = "Jane Doe"; // Mock contact name

  return (
    <div className="App">
      <header className="app-header">
        <div className="contact-info">
          {/* Avatar placeholder could go here, e.g., <img src="avatar.png" alt="" className="avatar" /> */}
          <span className="contact-name">{contactName}</span>
          {/* Optional status: <span className="contact-status">online</span> */}
        </div>
        <div className="header-icons">
          <button className="header-icon-button" aria-label="Video call">📹</button>
          <button className="header-icon-button" aria-label="Voice call">📞</button>
          <button className="header-icon-button" aria-label="Menu">⋮</button>
        </div>
      </header>
      <div className="app-content-wrapper">
        {/* ChatApp component no longer needs to manage header content directly */}
        {/* If ChatApp needed to influence the header, a more complex state/prop system would be used */}
        <ChatApp />
      </div>
      <footer className="app-footer">
        <p>© 2024 Modern Chat App</p>
      </footer>
    </div>
  );
}

export default App;
