import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "./Register";

describe("Register Component", () => {
  const mockOnRegister = jest.fn();

  beforeEach(() => {
    fetch.resetMocks();
  });

  it("renders register form", () => {
    render(<Register onRegister={mockOnRegister} />);

    expect(screen.getByPlaceholderText("Nome")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Senha")).toBeInTheDocument();
    expect(screen.getByText("Cadastrar")).toBeInTheDocument();
  });

  it("handles successful registration", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ message: "Usuário cadastrado com sucesso" })
    );

    render(<Register onRegister={mockOnRegister} />);

    fireEvent.change(screen.getByPlaceholderText("Nome"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Cadastrar"));

    await waitFor(() => {
      expect(mockOnRegister).toHaveBeenCalled();
    });
  });

  it("shows error message on registration failure", async () => {
    fetch.mockResponseOnce(JSON.stringify({ message: "Erro ao cadastrar" }), {
      status: 400,
    });

    render(<Register onRegister={mockOnRegister} />);

    fireEvent.change(screen.getByPlaceholderText("Nome"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "invalid@email" },
    });
    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "pass" },
    });

    fireEvent.click(screen.getByText("Cadastrar"));

    await waitFor(() => {
      expect(screen.getByText("Erro ao cadastrar")).toBeInTheDocument();
    });
  });
});
