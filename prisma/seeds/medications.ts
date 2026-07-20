// medications.ts
export const medicationsSeed = [
  // ==========================================
  // PACIENTE 1: Antônio Silva Medeiros (pat-001)
  // ==========================================
  {
    id: "med-001",
    nome: "Losartana Potássica",
    dosagem: "50mg",
    frequencia: "1x ao dia (Manhã)",
    viaAdministracao: "Oral",
    observacoes: "Administrar em jejum com água. Controle de Hipertensão.",
    patientId: "pat-001",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-01T08:00:00Z")
  },
  {
    id: "med-002",
    nome: "Cloridrato de Metformina",
    dosagem: "850mg",
    frequencia: "2x ao dia (Após café e após jantar)",
    viaAdministracao: "Oral",
    observacoes: "Administrar imediatamente após as refeições para evitar desconforto gástrico.",
    patientId: "pat-001",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-01T08:00:00Z")
  },

  // ==========================================
  // PACIENTE 2: Maria das Dores Camargo (pat-002)
  // ==========================================
  {
    id: "med-003",
    nome: "Cloridrato de Donepezila",
    dosagem: "10mg",
    frequencia: "1x ao dia (Noite)",
    viaAdministracao: "Oral",
    observacoes: "Medicação de controle para Doença de Alzheimer.",
    patientId: "pat-002",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-02T19:00:00Z")
  },
  {
    id: "med-004",
    nome: "Alendronato de Sódio",
    dosagem: "70mg",
    frequencia: "1x por semana (Domingo de manhã)",
    viaAdministracao: "Oral",
    observacoes: "Manter o paciente em posição ereta por pelo menos 30 minutos após a ingestão. Não mastigar.",
    patientId: "pat-002",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-02T07:00:00Z")
  },

  // ==========================================
  // PACIENTE 3: Geraldo Alckmin Faria (pat-003)
  // ==========================================
  {
    id: "med-005",
    nome: "Ácido Acetilsalicílico (AAS)",
    dosagem: "100mg",
    frequencia: "1x ao dia (Após o almoço)",
    viaAdministracao: "Oral",
    observacoes: "Antiagregante plaquetário profilático pós-AVC. Cuidado redobrado com a deglutição (disfagia).",
    patientId: "pat-003",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-03T12:00:00Z")
  },
  {
    id: "med-006",
    nome: "Sinvastatina",
    dosagem: "20mg",
    frequencia: "1x ao dia (À noite, 22h)",
    viaAdministracao: "Oral",
    observacoes: "Controle lipídico e prevenção secundária cardiovascular.",
    patientId: "pat-003",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-03T22:00:00Z")
  },

  // ==========================================
  // PACIENTE 4: Francisca Nogueira Abreu (pat-004)
  // ==========================================
  {
    id: "med-007",
    nome: "Furosemida",
    dosagem: "40mg",
    frequencia: "2x ao dia (08h e 14h)",
    viaAdministracao: "Oral",
    observacoes: "Diurético para controle de ICC. Evitar administração após as 16h para não prejudicar o sono com a diurese.",
    patientId: "pat-004",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-12T08:00:00Z") // Data ajustada com a descompensação no seed de evoluções
  },
  {
    id: "med-008",
    nome: "Maleato de Enalapril",
    dosagem: "10mg",
    frequencia: "2x ao dia (12/12h)",
    viaAdministracao: "Oral",
    observacoes: "Vasodilatador para controle pressórico e de insuficiência cardíaca.",
    patientId: "pat-004",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-04T08:00:00Z")
  },

  // ==========================================
  // PACIENTE 5: Benedito José dos Santos (pat-005)
  // ==========================================
  {
    id: "med-009",
    nome: "Prolopa (Levodopa + Cloridrato de Benserazida)",
    dosagem: "200mg/50mg",
    frequencia: "3x ao dia (06h, 12h e 18h)",
    viaAdministracao: "Oral",
    observacoes: "Administrar rigorosamente no horário para controle dos tremores de Parkinson. Dar preferência longe de refeições proteicas.",
    patientId: "pat-005",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-05T06:00:00Z")
  },
  {
    id: "med-010",
    nome: "Cloridrato de Sertralina",
    dosagem: "50mg",
    frequencia: "1x ao dia (Manhã)",
    viaAdministracao: "Oral",
    observacoes: "Antidepressivo. Avaliar comportamento e sintomas de isolamento na rotina.",
    patientId: "pat-005",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-05T08:00:00Z")
  },

  // ==========================================
  // PACIENTE 6: Teresa Cristina Diniz (pat-006)
  // ==========================================
  {
    id: "med-011",
    nome: "Levotiroxina Sódica (Puran T4)",
    dosagem: "50mcg",
    frequencia: "1x ao dia (Jejum matinal)",
    viaAdministracao: "Oral",
    observacoes: "Aguardar 30 a 40 minutos para oferecer o café da manhã. Controle do Hipotireoidismo.",
    patientId: "pat-006",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-06T06:30:00Z")
  },
  {
    id: "med-012",
    nome: "Maleato de Timolol (Colírio Ophtalmico)",
    dosagem: "0.5% - 1 gota em cada olho",
    frequencia: "2x ao dia (08h e 20h)",
    viaAdministracao: "Oftálmica",
    observacoes: "Uso contínuo para controle da pressão intraocular (Glaucoma). Higienizar as mãos antes de aplicar.",
    patientId: "pat-006",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-06T08:00:00Z")
  },

  // ==========================================
  // PACIENTE 7: Waldemar Rodrigues Fontes (pat-007)
  // ==========================================
  {
    id: "med-013",
    nome: "Fumarato de Formoterol Dihidratado + Budesonida (Alenia)",
    dosagem: "12mcg/400mcg - 1 inalação",
    frequencia: "2x ao dia (12/12h)",
    viaAdministracao: "Inalatória",
    observacoes: "Broncodilatador de manutenção para DPOC. Orientar o paciente a enxaguar a boca após o uso para evitar candidíase oral.",
    patientId: "pat-007",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-07T08:00:00Z")
  },
  {
    id: "med-014",
    nome: "Sulfato de Salbutamol (Aerolin)",
    dosagem: "100mcg - 2 jatos",
    frequencia: "Se necessário (SOS)",
    viaAdministracao: "Inalatória",
    observacoes: "Medicação de resgate para crises de broncoespasmo ou quedas súbitas de saturação associadas à dispneia.",
    patientId: "pat-007",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-07T14:00:00Z")
  },

  // ==========================================
  // PACIENTE 8: Irani Lima Barbosa (pat-008)
  // ==========================================
  {
    id: "med-015",
    nome: "Paracetamol",
    dosagem: "750mg",
    frequencia: "Até 3x ao dia se houver dor (SOS)",
    viaAdministracao: "Oral",
    observacoes: "Manejo de dor crônica decorrente da artrose severa nos joelhos. Respeitar intervalo mínimo de 6 horas.",
    patientId: "pat-008",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-08T09:00:00Z")
  },
  {
    id: "med-016",
    nome: "Carbonato de Cálcio + Colecalciferol (Vitamina D3)",
    dosagem: "500mg + 400UI",
    frequencia: "1x ao dia (Durante o almoço)",
    viaAdministracao: "Oral",
    observacoes: "Suplementação mineral para fortalecimento da saúde óssea.",
    patientId: "pat-008",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-08T12:00:00Z")
  }
];