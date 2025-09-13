import React from 'react';
import Dashboard from './components/Dashboard';
import SearchBar from './components/SearchBar';

const App = () => {
  return (
    <div className="app">
      <header className="topbar">
        <h1>Dynamic Dashboard</h1>
        <div className="controls">
          <SearchBar />
        </div>
      </header>
      <main>
        <Dashboard />
      </main>
    </div>
  );
};

export default App;