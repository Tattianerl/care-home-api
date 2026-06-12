# 🏥 Care Home API

API REST desenvolvida para gerenciamento de pacientes em casas de repouso, clínicas geriátricas e instituições de longa permanência para idosos (ILPI).

O sistema permite o cadastro de pacientes, controle de evoluções clínicas, sinais vitais, medicações, avaliações nutricionais, documentos, agendamentos, auditoria de ações dos usuários e geração de relatórios.

---

## 🚀 Tecnologias Utilizadas

* Node.js
* Express
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Multer
* PDFKit
* CSV Writer
* Swagger
* Bcrypt

---

## 📌 Funcionalidades

### 👤 Usuários

* Cadastro de usuários
* Login com JWT
* Controle de permissões por cargo
* Upload de assinatura digital
* Perfil do usuário autenticado

### 🧓 Pacientes

* Cadastro de pacientes
* Atualização de dados
* Desativação de pacientes
* Consulta individual
* Listagem paginada
* Busca por nome

### 📝 Evoluções

* Registro de evolução clínica
* Atualização de evolução
* Exclusão de evolução
* Listagem por paciente
* Listagem geral

### ❤️ Sinais Vitais

* Registro de:

  * Pressão arterial
  * Temperatura
  * Glicemia
  * Frequência cardíaca
  * Saturação

### 💊 Medicações

* Cadastro de medicações
* Histórico por paciente

### 🥗 Avaliação Nutricional

* Registro de:

  * Peso
  * Altura
  * IMC
  * Observações

### 📅 Agendamentos

* Cadastro de consultas
* Controle de status
* Agenda do dia
* Próximos atendimentos

### 📂 Documentos

* Upload de documentos
* Listagem de documentos
* Download de arquivos

### 📊 Dashboard

* Total de pacientes
* Total de evoluções
* Total de documentos
* Total de agendamentos
* Dashboard operacional do dia
* Pacientes por mês
* Evoluções por mês
* Documentos por mês
* Agendamentos por mês
* Usuários mais ativos
* Resumo de auditoria

### 📈 Auditoria

Registro automático de:

* CREATE
* UPDATE
* DELETE
* DEACTIVATE

Com:

* usuário responsável
* entidade afetada
* data/hora
* descrição da ação

### 📄 Relatórios

* Relatório PDF do paciente
* Exportação CSV de pacientes

### 📚 Documentação

* Swagger/OpenAPI

---

## 🔐 Autenticação

A API utiliza autenticação JWT.

Exemplo:

Authorization: Bearer TOKEN

---

## 🛠️ Instalação

### Clonar repositório

```bash
git clone https://github.com/seu-usuario/care-home-api.git
```

### Entrar na pasta

```bash
cd care-home-api
```

### Instalar dependências

```bash
npm install
```

### Configurar variáveis de ambiente

Criar arquivo:

```env
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
```

### Executar migrations

```bash
npx prisma migrate deploy
```

ou

```bash
npx prisma migrate dev
```

### Gerar Prisma Client

```bash
npx prisma generate
```

### Iniciar servidor

```bash
npm run dev
```

---

## 🗄️ Banco de Dados

Modelo relacional utilizando PostgreSQL.

Principais entidades:

* User
* Patient
* Evolution
* VitalSign
* Medication
* Appointment
* NutritionalAssessment
* PatientDocument
* AuditLog

---

## 📚 Swagger

Após iniciar a aplicação:

```txt
http://localhost:3333/docs
```

Documentação completa disponível através do Swagger UI.

---

## 📁 Estrutura do Projeto

```txt
src
├── config
├── controllers
├── middlewares
├── routes
├── services
├── lib
├── prisma
└── uploads
```

---

## 📄 Exportação CSV

Endpoint:

```http
GET /auth/export/patients
```

Retorna:

```csv
Nome,Responsavel,Telefone,DataNascimento
```

---

## 📄 Relatório PDF

Endpoint:

```http
GET /auth/patients/:id/report
```

Gera relatório completo do paciente.

---

## 🔍 Auditoria

Todos os eventos críticos do sistema são registrados automaticamente para rastreabilidade e conformidade.

---

## 🎯 Objetivo do Projeto

Este projeto foi desenvolvido como solução para gestão de pacientes em instituições de longa permanência, visando centralizar informações clínicas, reduzir registros manuais e melhorar o acompanhamento dos pacientes.

---

## API Online

https://care-home-api-g6hq.onrender.com/
## Swagger

https://care-home-api-g6hq.onrender.com/docs/

## 👩‍💻 Desenvolvido por

Tatiane Lima

LinkedIn:
https://www.linkedin.com/in/tati-lima85
