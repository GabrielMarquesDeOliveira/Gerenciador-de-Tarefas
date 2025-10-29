import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";

describe("Login Component", () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    fetch.resetMocks();
  });

  it("renders login form", () => {
    render(<Login onLogin={mockOnLogin} />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Senha")).toBeInTheDocument();
    expect(screen.getByText("Entrar")).toBeInTheDocument();
  });

  it("handles successful login", async () => {
    const mockToken = "fake-token";
    fetch.mockResponseOnce(JSON.stringify({ token: mockToken }));

    render(<Login onLogin={mockOnLogin} />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Entrar"));

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith(mockToken);
    });
  });

  it("shows error message on login failure", async () => {
    fetch.mockResponseOnce(JSON.stringify({ message: "Login inválido" }), {
      status: 401,
    });

    render(<Login onLogin={mockOnLogin} />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByText("Entrar"));

    await waitFor(() => {
      expect(screen.getByText("Login inválido")).toBeInTheDocument();
    });
  });
});
