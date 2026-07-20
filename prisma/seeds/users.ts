// users.ts
export const usersSeed = [
  {
    id: "usr-doctor-001",
    nome: "Dra. Helena Souza Ramos",
    cpf: "111.222.333-44",
    email: "helena.ramos@carehome.com",
    senha: "password123", // Lembre-se de rodar um bcrypt aqui se a API exigir hash
    cargo: "Médica Geriatra",
    assinatura: "Dra. Helena S. Ramos - CRM/SP 123456",
    ativo: true
  },
  {
    id: "usr-nurse-002",
    nome: "Enf. Roberto Alves Lima",
    cpf: "222.333.444-55",
    email: "roberto.lima@carehome.com",
    senha: "password123",
    cargo: "Enfermeiro Chefe",
    assinatura: "Enf. Roberto A. Lima - COREN/SP 789012",
    ativo: true
  },
  {
    id: "usr-physio-003",
    nome: "Dra. Amanda Cordeiro Silva",
    cpf: "333.444.555-66",
    email: "amanda.silva@carehome.com",
    senha: "password123",
    cargo: "Fisioterapeuta",
    assinatura: "Dra. Amanda C. Silva - CREFITO-3/45678-F",
    ativo: true
  },
  {
    id: "usr-social-004",
    nome: "Mariana Costa Oliveira",
    cpf: "444.555.666-77",
    email: "mariana.oliveira@carehome.com",
    senha: "password123",
    cargo: "Assistente Social",
    assinatura: "Mariana C. Oliveira - CRESS/SP 23456",
    ativo: true
  },
  {
    id: "usr-nutri-005",
    nome: "Beatriz Mello Fonseca",
    cpf: "555.666.777-88",
    email: "beatriz.fonseca@carehome.com",
    senha: "password123",
    cargo: "Nutricionista",
    assinatura: "Beatriz M. Fonseca - CRN-3/89012",
    ativo: true
  },
  {
    id: "usr-care-006",
    nome: "Carlos Eduardo Santos",
    cpf: "666.777.888-99",
    email: "carlos.santos@carehome.com",
    senha: "password123",
    cargo: "Cuidador de Idosos",
    assinatura: "Carlos E. Santos - Cuidador",
    ativo: true
  },
  {
    id: "usr-admin-007",
    nome: "Clara Antunes Vieira",
    cpf: "777.888.999-00",
    email: "clara.admin@carehome.com",
    senha: "admin123",
    cargo: "Administradora",
    assinatura: "Clara A. Vieira - Direção",
    ativo: true
  }
];