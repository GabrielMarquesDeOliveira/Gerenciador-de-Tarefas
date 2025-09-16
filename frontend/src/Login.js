import React, { useState } from 'react';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      if (!res.ok) throw new Error('Login inválido');
      const data = await res.json();
      onLogin(data.token);
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required />
      <button type="submit">Entrar</button>
      {erro && <div style={{ color: 'red' }}>{erro}</div>}
    </form>
  );
}

export default Login;
