import React from 'react';
import ChatApp from './components/ChatApp';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>My Chat Application</h1>
      </header>
      <div className="app-content-wrapper">
        <ChatApp />
      </div>
      <footer className="app-footer">
        <p>© 2024 Modern Chat App</p>
      </footer>
    </div>
  );
}

export default App;
