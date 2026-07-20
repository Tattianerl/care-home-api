// auditLogs.ts
export const auditLogsSeed = [
  // --- Admissão e Configuração de Usuários (Início de Julho) ---
  {
    id: "log-001",
    acao: "CREATE",
    entidade: "User",
    entidadeId: "usr-doctor-001",
    descricao: "Cadastro do usuário Dra. Helena Souza Ramos (Médica) realizado pelo administrador.",
    userId: "usr-admin-007",
    createdAt: new Date("2026-07-01T08:30:00Z")
  },
  {
    id: "log-002",
    acao: "CREATE",
    entidade: "User",
    entidadeId: "usr-nurse-002",
    descricao: "Cadastro do usuário Enf. Roberto Alves Lima realizado pelo administrador.",
    userId: "usr-admin-007",
    createdAt: new Date("2026-07-01T08:45:00Z")
  },
  {
    id: "log-003",
    acao: "CREATE",
    entidade: "Patient",
    entidadeId: "pat-001",
    descricao: "Admissão e cadastro inicial do paciente Antônio Silva Medeiros no sistema.",
    userId: "usr-admin-007",
    createdAt: new Date("2026-07-01T09:15:00Z")
  },
  {
    id: "log-004",
    acao: "CREATE",
    entidade: "Medication",
    entidadeId: "med-001",
    descricao: "Prescrição inicial de Losartana Potássica adicionada ao prontuário.",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-01T10:00:00Z")
  },
  {
    id: "log-005",
    acao: "CREATE",
    entidade: "Medication",
    entidadeId: "med-002",
    descricao: "Prescrição inicial de Cloridrato de Metformina adicionada ao prontuário.",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-01T10:05:00Z")
  },

  // --- Rotinas de Outros Pacientes ---
  {
    id: "log-006",
    acao: "CREATE",
    entidade: "Patient",
    entidadeId: "pat-002",
    descricao: "Cadastro da paciente Maria das Dores Camargo no sistema.",
    userId: "usr-admin-007",
    createdAt: new Date("2026-07-02T10:00:00Z")
  },
  {
    id: "log-007",
    acao: "CREATE",
    entidade: "PatientDocument",
    entidadeId: "doc-003",
    descricao: "Upload de Laudo_Neurologico_Alzheimer_Maria.pdf concluído com sucesso.",
    userId: "usr-social-004",
    createdAt: new Date("2026-07-02T14:30:00Z")
  },
  {
    id: "log-008",
    acao: "CREATE",
    entidade: "Patient",
    entidadeId: "pat-003",
    descricao: "Cadastro do paciente Geraldo Alckmin Faria no sistema.",
    userId: "usr-admin-007",
    createdAt: new Date("2026-07-03T11:00:00Z")
  },
  {
    id: "log-009",
    acao: "CREATE",
    entidade: "Medication",
    entidadeId: "med-005",
    descricao: "Prescrição de AAS 100mg adicionada.",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-03T12:05:00Z")
  },
  {
    id: "log-010",
    acao: "CREATE",
    entidade: "Patient",
    entidadeId: "pat-004",
    descricao: "Cadastro da paciente Francisca Nogueira Abreu.",
    userId: "usr-admin-007",
    createdAt: new Date("2026-07-04T09:00:00Z")
  },

  // --- Atividades Clínicas e Evoluções Med/Enf/Fisio (05 a 12 de Julho) ---
  {
    id: "log-011",
    acao: "CREATE",
    entidade: "Medication",
    entidadeId: "med-009",
    descricao: "Prescrição de Prolopa cadastrada para controle de Parkinson.",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-05T06:15:00Z")
  },
  {
    id: "log-012",
    acao: "CREATE",
    entidade: "VitalSign",
    entidadeId: "vit-013",
    descricao: "Sinais vitais rotineiros coletados no leito.",
    userId: "usr-care-006",
    createdAt: new Date("2026-07-08T10:05:00Z")
  },
  {
    id: "log-013",
    acao: "CREATE",
    entidade: "Evolution",
    entidadeId: "evo-013",
    descricao: "Evolução médica inserida: Ajuste de horários Prolopa.",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-08T16:05:00Z")
  },
  {
    id: "log-014",
    acao: "CREATE",
    entidade: "VitalSign",
    entidadeId: "vit-007",
    descricao: "Sinais vitais verificados na sala de fisioterapia.",
    userId: "usr-physio-003",
    createdAt: new Date("2026-07-09T14:20:00Z")
  },
  {
    id: "log-015",
    acao: "CREATE",
    entidade: "Evolution",
    entidadeId: "evo-007",
    descricao: "Evolução de fisioterapia inserida: Cinesioterapia neurofuncional.",
    userId: "usr-physio-003",
    createdAt: new Date("2026-07-09T14:35:00Z")
  },
  {
    id: "log-016",
    acao: "READ",
    entidade: "Patient",
    entidadeId: "pat-001",
    descricao: "Prontuário completo visualizado para checagem de alergias.",
    userId: "usr-nurse-002",
    createdAt: new Date("2026-07-10T07:50:00Z")
  },
  {
    id: "log-017",
    acao: "CREATE",
    entidade: "VitalSign",
    entidadeId: "vit-001",
    descricao: "Sinais vitais pós-prandiais inseridos.",
    userId: "usr-nurse-002",
    createdAt: new Date("2026-07-10T08:05:00Z")
  },
  {
    id: "log-018",
    acao: "CREATE",
    entidade: "Evolution",
    entidadeId: "evo-001",
    descricao: "Evolução clínica geral de rotina adicionada.",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-10T10:05:00Z")
  },
  {
    id: "log-019",
    acao: "CREATE",
    entidade: "Appointment",
    entidadeId: "app-001",
    descricao: "Agendamento de consulta geriatria concluído como REALIZADO.",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-10T10:10:00Z")
  },
  {
    id: "log-020",
    acao: "CREATE",
    entidade: "NutritionalAssessment",
    entidadeId: "nut-005",
    descricao: "Avaliação antropométrica e triagem de risco de desnutrição inseridas.",
    userId: "usr-nutri-005",
    createdAt: new Date("2026-07-10T09:30:00Z")
  },

  // --- Intercorrências Clínicas e Alterações Críticas (11 a 13 de Julho) ---
  {
    id: "log-021",
    acao: "CREATE",
    entidade: "VitalSign",
    entidadeId: "vit-010",
    descricao: "Sinais vitais coletados em caráter de urgência por queixa de fadiga.",
    userId: "usr-nurse-002",
    createdAt: new Date("2026-07-11T10:05:00Z")
  },
  {
    id: "log-022",
    acao: "CREATE",
    entidade: "Evolution",
    entidadeId: "evo-010",
    descricao: "Evolução de enfermagem inserida: Edema agudo detectado em MMII.",
    userId: "usr-nurse-002",
    createdAt: new Date("2026-07-11T10:25:00Z")
  },
  {
    id: "log-023",
    acao: "CREATE",
    entidade: "Evolution",
    entidadeId: "evo-004",
    descricao: "Evolução de enfermagem inserida: Manejo comportamental de agitação noturna.",
    userId: "usr-nurse-002",
    createdAt: new Date("2026-07-11T19:10:00Z")
  },
  {
    id: "log-024",
    acao: "UPDATE",
    entidade: "Patient",
    entidadeId: "pat-004",
    descricao: "Alteração de dados médicos: Campo observações atualizado com Alerta de Restrição Hídrica.",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-12T10:50:00Z")
  },
  {
    id: "log-025",
    acao: "CREATE",
    entidade: "Medication",
    entidadeId: "med-007",
    descricao: "Ajuste emergencial e inclusão de dose extra de Furosemida 40mg.",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-12T11:05:00Z")
  },
  {
    id: "log-026",
    acao: "DELETE",
    entidade: "PatientDocument",
    entidadeId: "doc-008",
    descricao: "Exclusão lógica do documento Receita_Medica_Desatualizada_Furosemida.pdf para evitar erros da equipe.",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-12T11:15:00Z")
  },
  {
    id: "log-027",
    acao: "CREATE",
    entidade: "VitalSign",
    entidadeId: "vit-019",
    descricao: "Alerta emitido pelo sistema: Saturação crítica de 86% detectada.",
    userId: "usr-nurse-002",
    createdAt: new Date("2026-07-12T14:35:00Z")
  },
  {
    id: "log-028",
    acao: "CREATE",
    entidade: "Evolution",
    entidadeId: "evo-019",
    descricao: "Evolução de enfermagem: Início imediato de Oxigenoterapia SOS.",
    userId: "usr-nurse-002",
    createdAt: new Date("2026-07-12T14:50:00Z")
  },

  // --- Acompanhamentos Multidisciplinares (14 a 17 de Julho) ---
  {
    id: "log-029",
    acao: "CREATE",
    entidade: "Evolution",
    entidadeId: "evo-005",
    descricao: "Evolução de Serviço Social: Orientação familiar prestada à filha da residente.",
    userId: "usr-social-004",
    createdAt: new Date("2026-07-14T14:10:00Z")
  },
  {
    id: "log-030",
    acao: "CREATE",
    entidade: "NutritionalAssessment",
    entidadeId: "nut-004",
    descricao: "Avaliação Nutricional periódica: Atualização de dieta hipossódica restrita.",
    userId: "usr-nutri-005",
    createdAt: new Date("2026-07-15T10:35:00Z")
  },
  {
    id: "log-031",
    acao: "CREATE",
    entidade: "VitalSign",
    entidadeId: "vit-002",
    descricao: "Sinais vitais inseridos pela equipe técnica durante o plantão da tarde.",
    userId: "usr-care-006",
    createdAt: new Date("2026-07-15T16:35:00Z")
  },
  {
    id: "log-032",
    acao: "CREATE",
    entidade: "Evolution",
    entidadeId: "evo-009",
    descricao: "Evolução de Fisioterapia: Posicionamento terapêutico anti-escaras.",
    userId: "usr-physio-003",
    createdAt: new Date("2026-07-16T15:05:00Z")
  },
  {
    id: "log-033",
    acao: "CREATE",
    entidade: "Appointment",
    entidadeId: "app-007",
    descricao: "Status do agendamento de Oftalmologia alterado para CANCELADO devido a problemas na clínica parceira.",
    userId: "usr-social-004",
    createdAt: new Date("2026-07-17T14:05:00Z")
  },
  {
    id: "log-034",
    acao: "CREATE",
    entidade: "Appointment",
    entidadeId: "app-008",
    descricao: "Novo agendamento criado para suprir a consulta externa cancelada de oftalmologia.",
    userId: "usr-social-004",
    createdAt: new Date("2026-07-17T15:05:00Z")
  },

  // --- Lixeira, Atualizações Finais e Checagens Recentes (18 a 20 de Julho) ---
  {
    id: "log-035",
    acao: "CREATE",
    entidade: "Evolution",
    entidadeId: "evo-021",
    descricao: "Evolução médica: Paciente DPOC com quadro respiratório de base mantido.",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-18T10:35:00Z")
  },
  {
    id: "log-036",
    acao: "DELETE",
    entidade: "PatientDocument",
    entidadeId: "doc-011",
    descricao: "Documento duplicado Laudo_Espirometria_Antigo_Waldemar.pdf removido pelo administrador.",
    userId: "usr-admin-007",
    createdAt: new Date("2026-07-18T10:45:00Z")
  },
  {
    id: "log-037",
    acao: "CREATE",
    entidade: "NutritionalAssessment",
    entidadeId: "nut-001",
    descricao: "Avaliação Nutricional: Controle de pesagem mensal estável.",
    userId: "usr-nutri-005",
    createdAt: new Date("2026-07-18T11:05:00Z")
  },
  {
    id: "log-038",
    acao: "CREATE",
    entidade: "PatientDocument",
    entidadeId: "doc-010",
    descricao: "Upload de arquivos de exames de sangue da tireoide concluído.",
    userId: "usr-nurse-002",
    createdAt: new Date("2026-07-18T14:05:00Z")
  },
  {
    id: "log-039",
    acao: "CREATE",
    entidade: "Evolution",
    entidadeId: "evo-006",
    descricao: "Evolução médica: Análise laboratorial de TSH normalizado.",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-19T09:35:00Z")
  },
  {
    id: "log-040",
    acao: "UPDATE",
    entidade: "Patient",
    entidadeId: "pat-008",
    descricao: "Correção ortográfica efetuada no nome da paciente de 'Irतीच्या' para 'Irani Lima Barbosa'.",
    userId: "usr-admin-007",
    createdAt: new Date("2026-07-20T08:15:00Z")
  },
  {
    id: "log-041",
    acao: "CREATE",
    entidade: "VitalSign",
    entidadeId: "vit-024",
    descricao: "Sinais vitais aferidos na troca de plantão da manhã.",
    userId: "usr-nurse-002",
    createdAt: new Date("2026-07-20T08:35:00Z")
  },
  {
    id: "log-042",
    acao: "CREATE",
    entidade: "Evolution",
    entidadeId: "evo-024",
    descricao: "Evolução rotineira: Ausência de lesões cutâneas ou DAI.",
    userId: "usr-nurse-002",
    createdAt: new Date("2026-07-20T09:05:00Z")
  },
  {
    id: "log-043",
    acao: "CREATE",
    entidade: "Appointment",
    entidadeId: "app-010",
    descricao: "Status da sessão de fisioterapia individual alterado para REALIZADO.",
    userId: "usr-physio-003",
    createdAt: new Date("2026-07-20T11:00:00Z")
  },
  {
    id: "log-044",
    acao: "READ",
    entidade: "AuditLog",
    entidadeId: "all",
    descricao: "Relatório geral de trilha de auditoria exportado para controle administrativo.",
    userId: "usr-admin-007",
    createdAt: new Date("2026-07-20T14:30:00Z")
  },
  {
    id: "log-045",
    acao: "UPDATE",
    entidade: "User",
    entidadeId: "usr-care-006",
    descricao: "Perfil do usuário atualizado: Adicionado texto padrão de assinatura de Cuidador.",
    userId: "usr-admin-007",
    createdAt: new Date("2026-07-20T16:10:00Z")
  }
];