import React, { useEffect, useState, useRef } from "react";
import "./Tarefas.css";

function Tarefas({ token }) {
  const [tarefas, setTarefas] = useState([]);
  const [status, setStatus] = useState("pendente");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [editando, setEditando] = useState(null);
  const [notificacao, setNotificacao] = useState("");
  const socketRef = useRef(null);

  const fetchTarefas = () => {
    fetch(`/api/tarefas?status=${status}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setTarefas);
  };

  useEffect(() => {
    fetchTarefas();
  }, [status, token]);

  useEffect(() => {
    // Conectar ao WebSocket do backend
    socketRef.current = window.io ? window.io("http://localhost:4000") : null;
    if (socketRef.current) {
      socketRef.current.on("tarefaAtualizada", (msg) => {
        setNotificacao(msg);
        fetchTarefas();
        setTimeout(() => setNotificacao(""), 3000);
      });
    }
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const criarOuEditarTarefa = async (e) => {
    e.preventDefault();
    const url = editando ? `/api/tarefas/${editando.id}` : "/api/tarefas";
    const method = editando ? "PUT" : "POST";
    const body = JSON.stringify({
      titulo,
      descricao,
      status: editando ? editando.status : "pendente",
    });
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
    });
    setTitulo("");
    setDescricao("");
    setEditando(null);
    fetchTarefas();
  };

  const deletarTarefa = async (id) => {
    await fetch(`/api/tarefas/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTarefas();
  };

  const marcarConcluida = async (tarefa) => {
    await fetch(`/api/tarefas/${tarefa.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...tarefa, status: "concluida" }),
    });
    fetchTarefas();
  };

  return (
    <div>
      {notificacao && (
        <div
          style={{
            background: "#dff0d8",
            color: "#3c763d",
            padding: "8px",
            marginBottom: "12px",
            borderRadius: "4px",
          }}
        >
          {notificacao}
        </div>
      )}
      <div>
        <button onClick={() => setStatus("pendente")}>Pendentes</button>
        <button onClick={() => setStatus("concluida")}>Concluídas</button>
      </div>
      <form onSubmit={criarOuEditarTarefa} style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        <button type="submit">{editando ? "Salvar" : "Criar"}</button>
        {editando && (
          <button type="button" onClick={() => setEditando(null)}>
            Cancelar
          </button>
        )}
      </form>
      <ul>
        {tarefas.map((tarefa) => (
          <li key={tarefa.id}>
            <span>{tarefa.titulo}</span> - <span>{tarefa.status}</span>
            <button
              onClick={() => {
                setEditando(tarefa);
                setTitulo(tarefa.titulo);
                setDescricao(tarefa.descricao);
              }}
            >
              Editar
            </button>
            <button onClick={() => deletarTarefa(tarefa.id)}>Deletar</button>
            {tarefa.status === "pendente" && (
              <button onClick={() => marcarConcluida(tarefa)}>Concluir</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tarefas;
