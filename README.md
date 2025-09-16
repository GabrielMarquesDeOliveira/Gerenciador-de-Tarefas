# Gerenciador de Tarefas — Guia Rápido

Este sistema permite você criar, visualizar, editar, concluir e deletar tarefas de forma simples e rápida. Tudo protegido por login, com notificações em tempo real e fácil de rodar.

## Como usar

### 1. Instale o Docker Desktop

Baixe e instale o Docker Desktop para Windows. Reinicie o computador após instalar.

### 2. Execute o sistema

Abra o terminal na pasta do projeto e rode:

```sh
docker compose up --build
```

Pronto! O sistema estará disponível em:

- Backend: [http://localhost:4000](http://localhost:4000)
- Frontend: [http://localhost:3000](http://localhost:3000)

### 3. Login e Cadastro

Ao abrir o frontend, cadastre-se com nome, email e senha. Depois faça login para acessar suas tarefas.

### 4. Gerencie suas tarefas

- Crie novas tarefas
- Edite ou exclua tarefas
- Marque como concluída
- Filtre por status (pendente/concluída)
- Receba notificações em tempo real

### 5. Testes automatizados

Para rodar os testes do backend:

```sh
cd backend
npm test
```

## Estrutura do Projeto

- **backend/**: API Node.js (Express, JWT, PostgreSQL, WebSockets)
- **frontend/**: React + CSS
- **docker-compose.yml**: Orquestração dos containers

## Dicas e Observações

- O sistema usa autenticação JWT para proteger suas tarefas.
- Notificações em tempo real são feitas via WebSockets (Socket.IO).
- Para funcionar o WebSocket no frontend, inclua no `public/index.html`:

```html
<script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
```

- Configure o arquivo `.env` no backend para o banco e chave JWT:

```
DATABASE_URL=postgres://postgres:postgres@db:5432/tarefas
JWT_SECRET=sua_chave_secreta
```

## Principais arquivos

- `backend/src/index.js`: Inicializa servidor, rotas e WebSockets
- `backend/src/routes.js`: Rotas de tarefas
- `backend/src/auth.js`: Autenticação JWT
- `frontend/src/App.js`: Tela principal e login
- `frontend/src/Tarefas.js`: CRUD de tarefas e notificações

---

Projeto para fins educacionais e demonstração.
