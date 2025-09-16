import React, { useState } from 'react';
import Tarefas from './Tarefas';
import Login from './Login';
import Register from './Register';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };
  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <div className="App">
      <h1>Gerenciador de Tarefas</h1>
      {!token ? (
        <>
          {showRegister ? (
            <Register onRegister={() => setShowRegister(false)} />
          ) : (
            <Login onLogin={handleLogin} />
          )}
          <button onClick={() => setShowRegister(!showRegister)}>
            {showRegister ? 'Já tenho conta' : 'Criar conta'}
          </button>
        </>
      ) : (
        <>
          <button onClick={handleLogout} style={{ float: 'right' }}>Sair</button>
          <Tarefas token={token} />
        </>
      )}
    </div>
  );
}

export default App;
