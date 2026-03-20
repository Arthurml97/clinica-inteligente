# Sistema de Atendimento Inteligente para Clínicas Médicas

## Sobre o Projeto
Este projeto é uma aplicação web Full-Stack desenvolvida para informatizar e otimizar o processo de agendamento de consultas em clínicas médicas de pequeno porte. O sistema oferece uma experiência segura e intuitiva tanto para os pacientes quanto para a administração da clínica.
Projeto realizado para a segunda atividade de desenvolvimento backend 1 para a universidade veiga de almeida.
 
## Funcionalidades Principais
* **Autenticação Segura:** Sistema de Login e Cadastro com senhas criptografadas (Bcrypt) e controle de sessão via JWT (JSON Web Tokens).
* **Controle de Acesso (RBAC):** Separação clara entre perfis de `paciente` e `secretario`, protegendo rotas sensíveis no frontend e no backend.
* **Preenchimento Automático de Endereço:** Integração com a API do **ViaCEP** durante o cadastro do paciente.
* **Previsão do Tempo:** Integração com a API **OpenWeatherMap** para exibir as condições climáticas da cidade do paciente no momento do agendamento.
* **Dashboard do Paciente:** Interface para solicitar novos agendamentos e visualizar o histórico e status das consultas.
* **Painel Administrativo:** Interface exclusiva para a secretaria visualizar todos os agendamentos e alterar o status (Confirmar/Cancelar).

## Tecnologias Utilizadas

**Frontend (SPA)**
* [Vue.js 3](https://vuejs.org/) (Composition API)
* [Vue Router](https://router.vuejs.org/) (Navegação e Guardas de Rota)
* [TailwindCSS](https://tailwindcss.com/) (Estilização rápida e responsiva)
* [Axios](https://axios-http.com/) (Consumo da API REST)

**Backend (API RESTful)**
* [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
* [Bcrypt.js](https://www.npmjs.com/package/bcryptjs) & [JsonWebToken](https://jwt.io/)
* [Helmet](https://helmetjs.github.io/) & [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## Como executar o projeto localmente

### Pré-requisitos
* Node.js (v18 ou superior)
* Cluster MongoDB Atlas (ou MongoDB rodando localmente)

### Configurando o Backend
1. Acesse a pasta do backend: `cd backend`
2. Instale as dependências: `npm install`
3. Crie um arquivo `.env` na raiz do backend baseado no `.env.example` e insira suas chaves (MONGO_URI, JWT_SECRET, WEATHER_API_KEY).
4. Inicie o servidor: `npm run dev` (Rodará em http://localhost:3000)

### Configurando o Frontend
1. Abra um novo terminal e acesse a pasta do frontend: `cd frontend`
2. Instale as dependências: `npm install`
3. Inicie a aplicação Vue: `npm run dev`
4. Acesse o link gerado no terminal (geralmente http://localhost:5173).

## Como executar o projeto (Via Docker)

Este projeto está containerizado para facilitar a avaliação, garantindo que o banco de dados, a API e a interface rodem perfeitamente em qualquer ambiente.

### Pré-requisitos
* [Docker](https://www.docker.com/) e Docker Compose instalados na máquina.

### Passo a passo
1. Extraia o arquivo ZIP (ou clone o repositório).
2. Abra o terminal na raiz do projeto (onde está o arquivo `docker-compose.yml`).
3. Execute o comando abaixo para construir e iniciar todos os serviços:
   ```bash
   docker-compose up --build -d