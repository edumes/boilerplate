# Guia de Setup do Ambiente

Este guia fornece instruções detalhadas para configurar o ambiente de desenvolvimento do projeto.

## 📋 Requisitos do Sistema

### Software Necessário
- Node.js (versão 18 ou superior)
- PostgreSQL (versão 16 ou superior)
- Redis (versão 6 ou superior)
- Git

### Extensões Recomendadas para VS Code
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- GitLens
- Docker (opcional)

## 🔧 Configuração do Ambiente

### 1. Instalação do PostgreSQL

#### Windows
1. Baixe o instalador em [postgresql.org](https://www.postgresql.org/download/windows/)
2. Execute o instalador
3. Anote a senha do usuário 'postgres'
4. Verifique a instalação:
```bash
psql --version
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### macOS
```bash
brew install postgresql@16
brew services start postgresql@16
```

### 2. Instalação do Redis

#### Windows
1. Baixe o Redis para Windows em [github.com/microsoftarchive/redis](https://github.com/microsoftarchive/redis/releases)
2. Execute o instalador
3. Verifique a instalação:
```bash
redis-cli --version
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

#### macOS
```bash
brew install redis
brew services start redis
```

## 🚀 Configuração do Projeto

### 1. Clone do Repositório
```bash
git clone [URL_DO_REPOSITÓRIO]
cd backend
```

### 2. Instalação de Dependências
```bash
npm install
```

### 3. Configuração do Banco de Dados

#### Criar Banco de Dados
```bash
# Conecte ao PostgreSQL
psql -U postgres

# No prompt do PostgreSQL, crie o banco de dados
CREATE DATABASE database;

# Saia do prompt do PostgreSQL
\q
```

### 4. Execução dos Seeds
```bash
npm run seed
```

## 🧪 Verificação da Instalação

### 1. Inicie o Servidor de Desenvolvimento
```bash
npm run dev
```

### 2. Verifique os Endpoints
- Acesse a documentação Swagger: `http://localhost:3333/docs`
- Verifique se o servidor está respondendo: `http://localhost:3333/health`

### 3. Execute os Testes
```bash
npm test
```

## 🔍 Solução de Problemas Comuns

### Problema: Erro de Conexão com PostgreSQL
- Verifique se o serviço do PostgreSQL está rodando
- Confirme se as credenciais no `.env` estão corretas
- Verifique se o banco de dados existe

### Problema: Erro de Conexão com Redis
- Verifique se o serviço do Redis está rodando
- Confirme se a porta 6379 está disponível
- Verifique se as credenciais no `.env` estão corretas

### Problema: Erro de Compilação TypeScript
- Verifique se todas as dependências foram instaladas
- Execute `npm run build` para ver erros detalhados
- Verifique se o `tsconfig.json` está configurado corretamente

## 📚 Recursos Adicionais

- [Documentação do TypeScript](https://www.typescriptlang.org/docs/)
- [Documentação do Fastify](https://www.fastify.io/docs/latest/)
- [Documentação do TypeORM](https://typeorm.io/)
- [Documentação do Jest](https://jestjs.io/docs/getting-started)

## 🤝 Suporte

Se você encontrar problemas durante o setup:
1. Verifique a seção de Solução de Problemas Comuns
2. Consulte a documentação das tecnologias utilizadas
3. Abra uma issue no repositório do projeto
4. Entre em contato com a equipe de desenvolvimento