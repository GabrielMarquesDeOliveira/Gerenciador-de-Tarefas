import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  beforeEach(() => {
    // Limpa o localStorage antes de cada teste
    localStorage.clear();
  });

  it("shows login form when not authenticated", () => {
    render(<App />);

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Criar conta")).toBeInTheDocument();
  });

  it("shows task manager when authenticated", () => {
    localStorage.setItem("token", "fake-token");
    render(<App />);

    expect(screen.getByText("Gerenciador de Tarefas")).toBeInTheDocument();
    expect(screen.getByText("Sair")).toBeInTheDocument();
  });

  it("can switch between login and register forms", () => {
    render(<App />);

    // Inicialmente mostra o login
    expect(screen.getByText("Login")).toBeInTheDocument();

    // Clica para mostrar o registro
    fireEvent.click(screen.getByText("Criar conta"));
    expect(screen.getByText("Cadastro")).toBeInTheDocument();

    // Volta para o login
    fireEvent.click(screen.getByText("Já tenho conta"));
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("can logout", () => {
    localStorage.setItem("token", "fake-token");
    render(<App />);

    fireEvent.click(screen.getByText("Sair"));

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(localStorage.getItem("token")).toBeNull();
  });
});
