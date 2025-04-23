import React from 'react';
import './App.css';
import LivroList from './components/LivroList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Biblioteca Católica</h1>
      </header>
      <main>
        <LivroList />
      </main>
    </div>
  );
}

export default App;