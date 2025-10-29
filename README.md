# Gerenciador de Tarefas - Guia Rápido

Este sistema permite você criar, visualizar, editar, concluir e deletar tarefas de forma simples e rápida. Tudo protegido por login, com notificações em tempo real e fácil de rodar.

## Instalação

### 1. Instale as Dependências

Antes de executar o projeto, você precisa instalar as dependências tanto do backend quanto do frontend:

Para o backend:

```sh
cd backend
npm install
```

Para o frontend:

```sh
cd frontend
npm install
```

### 2. Instale o Docker Desktop

Baixe e instale o Docker Desktop para Windows. Reinicie o computador após a instalação.

### 3. Execute o Sistema

Abra o terminal na pasta do projeto e execute:

```sh
docker compose up --build
```

Pronto! O sistema estará disponível em:

- Backend: [http://localhost:4000](http://localhost:4000)
- Frontend: [http://localhost:3000](http://localhost:3000)

### 4. Login e Cadastro

Ao abrir o frontend, cadastre-se com nome, email e senha. Depois faça login para acessar suas tarefas.

### 5. Gerencie suas Tarefas

- Crie novas tarefas
- Edite ou exclua tarefas
- Marque como concluída
- Filtre por status (pendente/concluída)
- Receba notificações em tempo real

### 6. Testes Automatizados

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

- O sistema usa autenticação JWT para proteger suas tarefas
- Notificações em tempo real são feitas via WebSockets (Socket.IO)
- Para funcionar o WebSocket no frontend, inclua no `public/index.html`:

```html
<script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
```

- Configure o arquivo `.env` no backend para o banco e chave JWT:

```
DATABASE_URL=postgres://postgres:postgres@db:5432/tarefas
JWT_SECRET=sua_chave_secreta
```

## Arquivos Principais

- `backend/src/index.js`: Inicializa servidor, rotas e WebSockets
- `backend/src/routes.js`: Rotas de tarefas
- `backend/src/auth.js`: Autenticação JWT
- `frontend/src/App.js`: Tela principal e login
- `frontend/src/Tarefas.js`: CRUD de tarefas e notificações

---

Projeto para fins educacionais e demonstração.
