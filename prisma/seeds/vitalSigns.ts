// vitalSigns.ts
export const vitalSignsSeed = [
  // ==========================================
  // PACIENTE 1: Antônio Silva Medeiros (pat-001) - Hipertenso / Diabético
  // ==========================================
  {
    id: "vit-001",
    pressao: "130x80",
    temperatura: 36.4,
    glicemia: 142.0, // Pós-prandial estável
    frequenciaCardiaca: 72,
    saturacao: 96,
    observacoes: "Glicemia coletada 2 horas após o almoço. Paciente estável.",
    patientId: "pat-001",
    userId: "usr-nurse-002",
    createdAt: new Date("2026-07-10T08:00:00Z")
  },
  {
    id: "vit-002",
    pressao: "145x90",
    temperatura: 36.6,
    glicemia: 198.0, // Elevada
    frequenciaCardiaca: 78,
    saturacao: 95,
    observacoes: "Picos pressórico e glicêmico detectados. Notificado enfermeiro chefe.",
    patientId: "pat-001",
    userId: "usr-care-006",
    createdAt: new Date("2026-07-15T16:30:00Z")
  },
  {
    id: "vit-003",
    pressao: "125x75",
    temperatura: 36.2,
    glicemia: 110.0, // Em jejum, controlada
    frequenciaCardiaca: 68,
    saturacao: 97,
    observacoes: "Parâmetros normalizados após ajuste de medicação rotineira.",
    patientId: "pat-001",
    userId: "usr-nurse-002",
    createdAt: new Date("2026-07-20T07:15:00Z")
  },

  // ==========================================
  // PACIENTE 2: Maria das Dores Camargo (pat-002) - Alzheimer
  // ==========================================
  {
    id: "vit-004",
    pressao: "120x80",
    temperatura: 36.5,
    frequenciaCardiaca: 82,
    saturacao: 95,
    observacoes: "Paciente calma durante a verificação matinal.",
    patientId: "pat-002",
    userId: "usr-nurse-002",
    createdAt: new Date("2026-07-11T09:00:00Z")
  },
  {
    id: "vit-005",
    pressao: "135x85",
    temperatura: 36.8,
    frequenciaCardiaca: 95, // FC elevada por agitação
    saturacao: 94,
    observacoes: "Aumento de FC associado ao quadro de agitação psicomotora do final da tarde.",
    patientId: "pat-002",
    userId: "usr-care-006",
    createdAt: new Date("2026-07-11T18:30:00Z")
  },
  {
    id: "vit-006",
    pressao: "115x70",
    temperatura: 36.1,
    frequenciaCardiaca: 74,
    saturacao: 96,
    observacoes: "Sinais vitais dentro dos limites da normalidade.",
    patientId: "pat-002",
    userId: "usr-nurse-002",
    createdAt: new Date("2026-07-19T08:00:00Z")
  },

  // ==========================================
  // PACIENTE 3: Geraldo Alckmin Faria (pat-003) - Sequela de AVC / Disfagia
  // ==========================================
  {
    id: "vit-007",
    pressao: "140x90",
    temperatura: 36.3,
    frequenciaCardiaca: 64,
    saturacao: 96,
    observacoes: "Aferido antes da sessão de fisioterapia.",
    patientId: "pat-003",
    userId: "usr-physio-003",
    createdAt: new Date("2026-07-09T14:15:00Z")
  },
  {
    id: "vit-008",
    pressao: "130x80",
    temperatura: 37.2, // Febrícula leve sob monitoramento
    frequenciaCardiaca: 70,
    saturacao: 94,
    observacoes: "Alerta para temperatura. Sem sinais de engasgo recente.",
    patientId: "pat-003",
    userId: "usr-nurse-002",
    createdAt: new Date("2026-07-13T12:00:00Z")
  },
  {
    id: "vit-009",
    pressao: "120x80",
    temperatura: 36.4,
    frequenciaCardiaca: 66,
    saturacao: 96,
    observacoes: "Paciente estável e responsivo.",
    patientId: "pat-003",
    userId: "usr-care-006",
    createdAt: new Date("2026-07-16T10:00:00Z")
  },

  // ==========================================
  // PACIENTE 4: Francisca Nogueira Abreu (pat-004) - Insuficiência Cardíaca (ICC)
  // ==========================================
  {
    id: "vit-010",
    pressao: "110x70",
    temperatura: 36.0,
    frequenciaCardiaca: 88,
    saturacao: 93,
    observacoes: "Verificado no leito. Apresenta edema ativo em membros inferiores.",
    patientId: "pat-004",
    userId: "usr-nurse-002",
    createdAt: new Date("2026-07-11T10:00:00Z")
  },
  {
    id: "vit-011",
    pressao: "100x60", // Tendência a hipotensão pelo diurético
    temperatura: 36.4,
    frequenciaCardiaca: 84,
    saturacao: 94,
    observacoes: "Monitoramento pós-dose reforçada de Furosemida.",
    patientId: "pat-004",
    userId: "usr-nurse-002",
    createdAt: new Date("2026-07-12T15:00:00Z")
  },
  {
    id: "vit-012",
    pressao: "115x70",
    temperatura: 36.5,
    frequenciaCardiaca: 76,
    saturacao: 95,
    observacoes: "Melhora no padrão cardiovascular e redução discreta de edemas.",
    patientId: "pat-004",
    userId: "usr-care-006",
    createdAt: new Date("2026-07-15T09:00:00Z")
  },

  // ==========================================
  // PACIENTE 5: Benedito José dos Santos (pat-005) - Parkinson
  // ==========================================
  {
    id: "vit-013",
    pressao: "120x80",
    temperatura: 36.6,
    frequenciaCardiaca: 76,
    saturacao: 96,
    observacoes: "Dificuldade na aferição manual devido a tremores finos.",
    patientId: "pat-005",
    userId: "usr-care-006",
    createdAt: new Date("2026-07-08T10:00:00Z")
  },
  {
    id: "vit-014",
    pressao: "130x85",
    temperatura: 36.4,
    frequenciaCardiaca: 80,
    saturacao: 95,
    observacoes: "Medição realizada com monitor automático de braço.",
    patientId: "pat-005",
    userId: "usr-physio-003",
    createdAt: new Date("2026-07-12T08:45:00Z")
  },
  {
    id: "vit-015",
    pressao: "125x80",
    temperatura: 36.2,
    frequenciaCardiaca: 72,
    saturacao: 97,
    observacoes: "Parâmetros vitais normais em repouso.",
    patientId: "pat-005",
    userId: "usr-nurse-002",
    createdAt: new Date("2026-07-17T11:00:00Z")
  },

  // ==========================================
  // PACIENTE 6: Teresa Cristina Diniz (pat-006) - Hipotireoidismo / Glaucoma
  // ==========================================
  {
    id: "vit-016",
    pressao: "110x70",
    temperatura: 35.9, // Temperatura basal discretamente mais baixa (comum no hipotireoidismo)
    frequenciaCardiaca: 62,
    saturacao: 98,
    observacoes: "Sinais vitais estáveis. Sem intercorrências.",
    patientId: "pat-006",
    userId: "usr-nurse-002",
    createdAt: new Date("2026-07-10T08:00:00Z")
  },
  {
    id: "vit-017",
    pressao: "120x80",
    temperatura: 36.3,
    frequenciaCardiaca: 65,
    saturacao: 96,
    observacoes: "Aferição de rotina antes das atividades sociais.",
    patientId: "pat-006",
    userId: "usr-care-006",
    createdAt: new Date("2026-07-14T09:30:00Z")
  },
  {
    id: "vit-018",
    pressao: "120x75",
    temperatura: 36.1,
    frequenciaCardiaca: 68,
    saturacao: 97,
    observacoes: "Paciente confortável e assintomática.",
    patientId: "pat-006",
    userId: "usr-nurse-002",
    createdAt: new Date("2026-07-19T10:00:00Z")
  },

  // ==========================================
  // PACIENTE 7: Waldemar Rodrigues Fontes (pat-007) - DPOC
  // ==========================================
  {
    id: "vit-019",
    pressao: "135x85",
    temperatura: 36.5,
    frequenciaCardiaca: 92,
    saturacao: 86, // Dessaturação em ar ambiente
    observacoes: "Crise leve de dispneia detectada. Iniciado oxigênio sob cateter nasal (2L/min).",
    patientId: "pat-007",
    userId: "usr-nurse-002",
    createdAt: new Date("2026-07-12T14:30:00Z")
  },
  {
    id: "vit-020",
    pressao: "130x80",
    temperatura: 36.7,
    frequenciaCardiaca: 86,
    saturacao: 92, // Recuperação com O2
    observacoes: "Verificação pós-oxigenoterapia e fisioterapia respiratória. Melhora clínica.",
    patientId: "pat-007",
    userId: "usr-physio-003",
    createdAt: new Date("2026-07-15T16:20:00Z")
  },
  {
    id: "vit-021",
    pressao: "125x80",
    temperatura: 36.4,
    frequenciaCardiaca: 78,
    saturacao: 89, // Esperado para DPOC grave estável
    observacoes: "Paciente em ar ambiente no momento, confortável e sem esforço respiratório.",
    patientId: "pat-007",
    userId: "usr-care-006",
    createdAt: new Date("2026-07-18T09:00:00Z")
  },

  // ==========================================
  // PACIENTE 8: Irani Lima Barbosa (pat-008) - Artrose / Incontinência
  // ==========================================
  {
    id: "vit-022",
    pressao: "140x80", // Levemente sistólica isolada
    temperatura: 36.4,
    frequenciaCardiaca: 74,
    saturacao: 96,
    observacoes: "Paciente queixando-se de dor em membros inferiores antes do atendimento da fisio.",
    patientId: "pat-008",
    userId: "usr-physio-003",
    createdAt: new Date("2026-07-13T09:45:00Z")
  },
  {
    id: "vit-023",
    pressao: "125x75",
    temperatura: 36.6,
    frequenciaCardiaca: 70,
    saturacao: 96,
    observacoes: "Aferição padrão no meio da tarde. Bem disposta.",
    patientId: "pat-008",
    userId: "usr-care-006",
    createdAt: new Date("2026-07-16T15:00:00Z")
  },
  {
    id: "vit-024",
    pressao: "130x80",
    temperatura: 36.2,
    frequenciaCardiaca: 72,
    saturacao: 97,
    observacoes: "Paciente cooperativa, sem queixas no momento.",
    patientId: "pat-008",
    userId: "usr-nurse-002",
    createdAt: new Date("2026-07-20T08:30:00Z")
  }
];