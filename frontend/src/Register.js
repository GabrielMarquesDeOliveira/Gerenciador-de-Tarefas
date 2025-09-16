import React, { useState } from 'react';

function Register({ onRegister }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });
      if (!res.ok) throw new Error('Erro ao cadastrar');
      onRegister();
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
      <h2>Cadastro</h2>
      <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required />
      <button type="submit">Cadastrar</button>
      {erro && <div style={{ color: 'red' }}>{erro}</div>}
    </form>
  );
}

export default Register;
