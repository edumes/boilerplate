# Backend Boilerplate

Um boilerplate robusto e moderno para APIs RESTful usando Node.js, TypeScript, Fastify e TypeORM.

## 🚀 Tecnologias

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Fastify](https://www.fastify.io/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Jest](https://jestjs.io/)
- [Bull](https://github.com/OptimalBits/bull)
- [Swagger](https://swagger.io/)

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL
- Redis

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Execute as migrações do banco de dados:
```bash
npm run seed:run
```

## 🚀 Executando o projeto

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 📝 Scripts Disponíveis

- `dev`: Inicia o servidor em modo desenvolvimento
- `start`: Inicia o servidor em modo produção
- `build`: Compila o projeto TypeScript
- `test`: Executa os testes
- `test:watch`: Executa os testes em modo watch
- `test:coverage`: Executa os testes com cobertura
- `stress`: Executa testes de stress com autocannon
- `migration:generate`: Gera uma nova migração
- `migration:run`: Executa as migrações pendentes
- `migration:revert`: Reverte a última migração
- `seed`: Executa os seeds do banco de dados

## 📚 Documentação da API

A documentação da API está disponível através do Swagger UI quando o servidor estiver rodando:

```
http://localhost:3333/docs
```

## 🧪 Testes

### Executando testes unitários
```bash
npm test
```

### Executando testes com cobertura
```bash
npm run test:coverage
```

## 📦 Estrutura do Projeto

```
src/
├── config/         # Configurações do projeto
├── core/           # Código core e utilitários
├── modules/        # Módulos da aplicação
├── tests/          # Testes
└── index.ts        # Ponto de entrada da aplicação
```

## 🔒 Segurança

- Autenticação via JWT
- Rate limiting configurável
- Headers de segurança com Helmet
- Criptografia de dados sensíveis
- Validação de entrada com class-validator

## 📊 Monitoramento e Logs

- Logs estruturados com Winston
- Rotação de logs diária
- Níveis de log configuráveis

## 🔄 Processamento Assíncrono

- Filas de processamento com Bull
- Jobs em background
- WebSockets para comunicação em tempo real

## 🌐 Internacionalização

- Suporte a múltiplos idiomas com i18next
- Traduções via arquivos
- Detecção automática de idioma

## 📧 Email

- Envio de emails com Nodemailer
- Templates HTML com Nunjucks
- Suporte a múltiplos provedores SMTP

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autor

Eduardo Santarosa

---

⭐️ From [Eduardo Santarosa](https://github.com/edumes) 