// evolutions.ts
export const evolutionsSeed = [
  // ==========================================
  // PACIENTE 1: Antônio Silva Medeiros (pat-001)
  // ==========================================
  {
    id: "evo-001",
    patientId: "pat-001",
    userId: "usr-doctor-001", // Médica
    assinatura: "Dra. Helena S. Ramos - CRM/SP 123456",
    descricao: "Paciente avaliado em consulta de rotina. Relata boa adesão ao tratamento medicamentoso. Nega queixas álgicas agudas. Ao exame clínico: eupneico, acianótico, PA 130x80 mmHg. Glicemia de jejum estável dentro das metas terapêuticas. Mantida conduta atual.",
    createdAt: new Date("2026-07-10T10:00:00Z")
  },
  {
    id: "evo-002",
    patientId: "pat-001",
    userId: "usr-nurse-002", // Enfermeiro
    assinatura: "Enf. Roberto A. Lima - COREN/SP 789012",
    descricao: "Realizado acompanhamento de enfermagem. Paciente orientado quanto à importância da ingesta hídrica. Apresenta pele íntegra, boa perfusão periférica. Aceitou bem a medicação via oral. Sem episódios de hipoglicemia no período matutino.",
    createdAt: new Date("2026-07-15T08:30:00Z")
  },
  {
    id: "evo-003",
    patientId: "pat-001",
    userId: "usr-nutri-005", // Nutricionista
    assinatura: "Beatriz M. Fonseca - CRN-3/89012",
    descricao: "Acompanhamento nutricional. Paciente apresenta boa aceitação da dieta geral com restrição simples de açúcares. Relata satisfação com o cardápio. Peso mantido na faixa de estabilidade (72kg). Estimulado consumo de fibras na colação.",
    createdAt: new Date("2026-07-18T11:15:00Z")
  },

  // ==========================================
  // PACIENTE 2: Maria das Dores Camargo (pat-002)
  // ==========================================
  {
    id: "evo-004",
    patientId: "pat-002",
    userId: "usr-nurse-002", // Enfermeiro
    assinatura: "Enf. Roberto A. Lima - COREN/SP 789012",
    descricao: "Paciente apresentou episódio de agitação psicomotora e desorientação têmporo-espacial no final da tarde (Síndrome do Pôr do Sol). Manejada sem intercorrências medicamentosas, através de abordagem verbal calma e redução de estímulos luminosos no quarto. Sono preservado após intervenção.",
    createdAt: new Date("2026-07-11T19:00:00Z")
  },
  {
    id: "evo-005",
    patientId: "pat-002",
    userId: "usr-social-004", // Assistente Social
    assinatura: "Mariana C. Oliveira - CRESS/SP 23456",
    descricao: "Realizado atendimento social no quarto. Paciente demonstrou fixação em memórias do passado, chamando por familiares. Feito contato telefônico com a filha (responsável Ana), que foi orientada sobre a importância de intensificar as visitas semanais para auxiliar no acolhimento da idosa.",
    createdAt: new Date("2026-07-14T14:00:00Z")
  },
  {
    id: "evo-006",
    patientId: "pat-002",
    userId: "usr-doctor-001", // Médica
    assinatura: "Dra. Helena S. Ramos - CRM/SP 123456",
    descricao: "Revisão farmacológica devido aos relatos de agitação noturna. Mantida Donepezila 10mg. Introduzido ajuste de manejo ambiental antes de optar por neurolépticos. Apresenta bom padrão cardiovascular, sem queixas de tontura postural.",
    createdAt: new Date("2026-07-19T09:30:00Z")
  },

  // ==========================================
  // PACIENTE 3: Geraldo Alckmin Faria (pat-003)
  // ==========================================
  {
    id: "evo-007",
    patientId: "pat-003",
    userId: "usr-physio-003", // Fisioterapeuta
    assinatura: "Dra. Amanda C. Silva - CREFITO-3/45678-F",
    descricao: "Realizada sessão de cinesioterapia motora para ganho de ADM (amplitude de movimento) em membro superior esquerdo acometido por AVC. Paciente participativo, realizando transferências de postura com auxílio moderado. Boa tolerância aos exercícios de fortalecimento em descarga de peso.",
    createdAt: new Date("2026-07-09T14:30:00Z")
  },
  {
    id: "evo-008",
    patientId: "pat-003",
    userId: "usr-nurse-002", // Enfermeiro
    assinatura: "Enf. Roberto A. Lima - COREN/SP 789012",
    descricao: "Supervisionada a oferta dietética. Risco de broncoaspiração mitigado pela postura ereta a 90° durante a refeição e uso de espessante alimentar na água. Sem episódios de engasgo ou tosse no plantão.",
    createdAt: new Date("2026-07-13T12:30:00Z")
  },
  {
    id: "evo-009",
    patientId: "pat-003",
    userId: "usr-physio-003", // Fisioterapeuta
    assinatura: "Dra. Amanda C. Silva - CREFITO-3/45678-F",
    descricao: "Treino de posicionamento no leito e na cadeira de rodas para prevenção de lesões por pressão. Paciente evolui com melhora discreta no controle de tronco sentado. Mantido plano de reabilitação neurofuncional 3x por semana.",
    createdAt: new Date("2026-07-16T15:00:00Z")
  },

  // ==========================================
  // PACIENTE 4: Francisca Nogueira Abreu (pat-004)
  // ==========================================
  {
    id: "evo-010",
    patientId: "pat-004",
    userId: "usr-nurse-002", // Enfermeiro
    assinatura: "Enf. Roberto A. Lima - COREN/SP 789012",
    descricao: "Identificado edema em membros inferiores (bilateral, cacifo +2/+4). Paciente refere cansaço leve ao pentear o cabelo. Comunicado ao plantão médico. Administrado Furosemida conforme prescrição e mantidos membros inferiores elevados.",
    createdAt: new Date("2026-07-11T10:20:00Z")
  },
  {
    id: "evo-011",
    patientId: "pat-004",
    userId: "usr-doctor-001", // Médica
    assinatura: "Dra. Helena S. Ramos - CRM/SP 123456",
    descricao: "Avaliada devido ao quadro de descompensação leve da ICC evidenciado pelo edema. Ausculta pulmonar com estertores crepitantes discretos em bases. Ajustada dose de Furosemida temporariamente para 40mg (2x ao dia). Solicitado balanço hídrico rigoroso.",
    createdAt: new Date("2026-07-12T11:00:00Z")
  },
  {
    id: "evo-012",
    patientId: "pat-004",
    userId: "usr-nutri-005", // Nutricionista
    assinatura: "Beatriz M. Fonseca - CRN-3/89012",
    descricao: "Ajuste na consistência e sódio da dieta. Implantada restrição severa de alimentos ultraprocessados e embutidos. Dieta hipossódica restrita. Orientada equipe técnica a controlar rigidamente a oferta de líquidos para não ultrapassar 1.200ml/dia.",
    createdAt: new Date("2026-07-15T10:45:00Z")
  },

  // ==========================================
  // PACIENTE 5: Benedito José dos Santos (pat-005)
  // ==========================================
  {
    id: "evo-013",
    patientId: "pat-005",
    userId: "usr-doctor-001", // Médica
    assinatura: "Dra. Helena S. Ramos - CRM/SP 123456",
    descricao: "Paciente avaliado no período da tarde, apresentando flutuação motora visível (fenômeno off do Parkinson) com tremores severos e rigidez. Otimizado horário do Prolopa para sincronizar com os períodos de maior atividade física do idoso.",
    createdAt: new Date("2026-07-08T16:00:00Z")
  },
  {
    id: "evo-014",
    patientId: "pat-005",
    userId: "usr-physio-003", // Fisioterapeuta
    assinatura: "Dra. Amanda C. Silva - CREFITO-3/45678-F",
    descricao: "Treino de marcha com foco em pistas visuais e auditivas para mitigar episódios de congelamento (freezing). Paciente apresentou boa resposta durante o circuito plano, reduzindo o risco imediato de quedas frontais.",
    createdAt: new Date("2026-07-12T09:00:00Z")
  },
  {
    id: "evo-015",
    patientId: "pat-005",
    userId: "usr-social-004", // Assistente Social
    assinatura: "Mariana C. Oliveira - CRESS/SP 23456",
    descricao: "Incluído o idoso na atividade interativa de musicoterapia. Apesar da resistência inicial devido ao humor deprimido, interagiu timidamente com outros residentes. Segue plano de integração social contínua.",
    createdAt: new Date("2026-07-17T15:30:00Z")
  },

  // ==========================================
  // PACIENTE 6: Teresa Cristina Diniz (pat-006)
  // ==========================================
  {
    id: "evo-016",
    patientId: "pat-006",
    userId: "usr-nurse-002", // Enfermeiro
    assinatura: "Enf. Roberto A. Lima - COREN/SP 789012",
    descricao: "Instilado colírio de Timolol em ambos os olhos rigorosamente no horário prescrito. Orientados cuidadores sobre a organização física dos pertences do quarto para evitar acidentes devido à severa restrição visual da paciente.",
    createdAt: new Date("2026-07-10T08:15:00Z")
  },
  {
    id: "evo-017",
    patientId: "pat-006",
    userId: "usr-social-004", // Assistente Social
    assinatura: "Mariana C. Oliveira - CRESS/SP 23456",
    descricao: "Atendimento voltado à estimulação sensorial não visual através da leitura de crônicas e audição de rádio antiga. Paciente demonstra excelente cognição, memória preservada e expressa gratidão pelo momento de escuta ativa.",
    createdAt: new Date("2026-07-14T10:00:00Z")
  },
  {
    id: "evo-018",
    patientId: "pat-006",
    userId: "usr-doctor-001", // Médica
    assinatura: "Dra. Helena S. Ramos - CRM/SP 123456",
    descricao: "Exame laboratorial aponta TSH estabilizado (2.4 uIU/mL), indicando eficácia da dose atual de Levotiroxina 50mcg. Nega sintomas de fadiga extrema ou obstipação severa. Pressão intraocular controlada pelo uso correto do colírio.",
    createdAt: new Date("2026-07-19T11:00:00Z")
  },

  // ==========================================
  // PACIENTE 7: Waldemar Rodrigues Fontes (pat-007)
  // ==========================================
  {
    id: "evo-019",
    patientId: "pat-007",
    userId: "usr-nurse-002", // Enfermeiro
    assinatura: "Enf. Roberto A. Lima - COREN/SP 789012",
    descricao: "Paciente apresentou dispneia leve em repouso na poltrona. Verificada saturação de O2 em 86%. Instalado cateter nasal de Oxigênio a 2L/min conforme protocolo médico institucional. Após 20 minutos de intervenção, paciente refere melhora e saturação estabilizou em 92%.",
    createdAt: new Date("2026-07-12T14:45:00Z")
  },
  {
    id: "evo-020",
    patientId: "pat-007",
    userId: "usr-physio-003", // Fisioterapeuta
    assinatura: "Dra. Amanda C. Silva - CREFITO-3/45678-F",
    descricao: "Fisioterapia respiratória realizada com técnicas de reexpansão pulmonar e treino de padrão ventilatório diafragmático. Paciente cooperativo, porém apresenta baixa reserva funcional. Conduta finalizada com aspiração de vias aéreas superior desnecessária, tosse produtiva eficaz.",
    createdAt: new Date("2026-07-15T16:00:00Z")
  },
  {
    id: "evo-021",
    patientId: "pat-007",
    userId: "usr-doctor-001", // Médica
    assinatura: "Dra. Helena S. Ramos - CRM/SP 123456",
    descricao: "Paciente com quadro de DPOC estável, porém no limite de sua capacidade respiratória basal. Ajustado protocolo de resgate com broncodilatador inalatório se necessário. Sem sinais clínicos de infecção pulmonar secundária (ausência de febre ou secreção purulenta).",
    createdAt: new Date("2026-07-18T10:30:00Z")
  },

  // ==========================================
  // PACIENTE 8: Irani Lima Barbosa (pat-008)
  // ==========================================
  {
    id: "evo-022",
    patientId: "pat-008",
    userId: "usr-physio-003", // Fisioterapeuta
    assinatura: "Dra. Amanda C. Silva - CREFITO-3/45678-F",
    descricao: "Atendimento focado em analgesia e fortalecimento de quadríceps bilateral devido à queixa de gonalgia intensa (dor crônica nos joelhos). Utilizado calor úmido local e exercícios isométricos leves. Paciente relata alívio parcial após a conduta.",
    createdAt: new Date("2026-07-13T10:00:00Z")
  },
  {
    id: "evo-023",
    patientId: "pat-008",
    userId: "usr-social-004", // Assistente Social
    assinatura: "Mariana C. Oliveira - CRESS/SP 23456",
    descricao: "Idosa participou ativamente da oficina semanal de artesanato. Liderou a mesa e auxiliou outros residentes com limitações motoras. Demonstra excelente engajamento comunitário dentro da instituição, sendo um fator de proteção para sua saúde mental.",
    createdAt: new Date("2026-07-16T14:20:00Z")
  },
  {
    id: "evo-024",
    patientId: "pat-008",
    userId: "usr-nurse-002", // Enfermeiro
    assinatura: "Enf. Roberto A. Lima - COREN/SP 789012",
    descricao: "Realizada higiene íntima rotineira e troca de fralda descartável. Apresenta integridade cutânea na região sacral e trocantérica, sem sinais de dermatite associada à incontinência (DAI). Faz uso adequado do andador de forma segura.",
    createdAt: new Date("2026-07-20T09:00:00Z")
  }
];