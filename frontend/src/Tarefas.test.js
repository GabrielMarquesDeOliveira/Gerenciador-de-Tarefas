import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Tarefas from "./Tarefas";

describe("Tarefas Component", () => {
  const mockToken = "fake-token";

  beforeEach(() => {
    fetch.resetMocks();
    // Mock do Socket.IO
    window.io = jest.fn(() => ({
      on: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  it("renders task list and form", async () => {
    fetch.mockResponseOnce(JSON.stringify([]));

    render(<Tarefas token={mockToken} />);

    expect(screen.getByPlaceholderText("Título")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Descrição")).toBeInTheDocument();
    expect(screen.getByText("Criar")).toBeInTheDocument();
  });

  it("shows tasks from API", async () => {
    const mockTasks = [
      { id: 1, titulo: "Tarefa 1", status: "pendente" },
      { id: 2, titulo: "Tarefa 2", status: "concluida" },
    ];

    fetch.mockResponseOnce(JSON.stringify(mockTasks));

    render(<Tarefas token={mockToken} />);

    await waitFor(() => {
      expect(screen.getByText("Tarefa 1")).toBeInTheDocument();
      expect(screen.getByText("Tarefa 2")).toBeInTheDocument();
    });
  });

  it("can create new task", async () => {
    fetch.mockResponseOnce(JSON.stringify([])); // Lista inicial vazia
    fetch.mockResponseOnce(
      JSON.stringify({ id: 1, titulo: "Nova Tarefa", status: "pendente" })
    ); // Resposta da criação
    fetch.mockResponseOnce(
      JSON.stringify([{ id: 1, titulo: "Nova Tarefa", status: "pendente" }])
    ); // Lista atualizada

    render(<Tarefas token={mockToken} />);

    fireEvent.change(screen.getByPlaceholderText("Título"), {
      target: { value: "Nova Tarefa" },
    });
    fireEvent.change(screen.getByPlaceholderText("Descrição"), {
      target: { value: "Descrição da nova tarefa" },
    });

    fireEvent.click(screen.getByText("Criar"));

    await waitFor(() => {
      expect(screen.getByText("Nova Tarefa")).toBeInTheDocument();
    });
  });

  it("can mark task as completed", async () => {
    const mockTask = { id: 1, titulo: "Tarefa Pendente", status: "pendente" };
    fetch.mockResponseOnce(JSON.stringify([mockTask]));

    render(<Tarefas token={mockToken} />);

    await waitFor(() => {
      expect(screen.getByText("Tarefa Pendente")).toBeInTheDocument();
    });

    fetch.mockResponseOnce(
      JSON.stringify({ ...mockTask, status: "concluida" })
    );
    fetch.mockResponseOnce(
      JSON.stringify([{ ...mockTask, status: "concluida" }])
    );

    fireEvent.click(screen.getByText("Concluir"));

    await waitFor(() => {
      expect(screen.getByText("concluida")).toBeInTheDocument();
    });
  });
});
