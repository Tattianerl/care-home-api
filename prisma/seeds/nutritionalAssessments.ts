// nutritionalAssessments.ts
export const nutritionalAssessmentsSeed = [
  {
    id: "nut-001",
    peso: 72.5,
    altura: 1.68,
    imc: 25.68, // Eutrofia / Sobrepeso leve para idoso
    observacoes: "Paciente estável. Mantém boa aceitação da dieta com restrição de açúcares simples. Mastigação e deglutição preservadas.",
    patientId: "pat-001",
    userId: "usr-nutri-005",
    createdAt: new Date("2026-07-18T11:00:00Z")
  },
  {
    id: "nut-002",
    peso: 54.0,
    altura: 1.55,
    imc: 22.48, // Adequado para a idade
    observacoes: "Paciente necessita de estimulação verbal durante as refeições devido à distração pelo Alzheimer. Peso estável em relação ao mês anterior.",
    patientId: "pat-002",
    userId: "usr-nutri-005",
    createdAt: new Date("2026-07-14T10:30:00Z")
  },
  {
    id: "nut-003",
    peso: 68.0,
    altura: 1.72,
    imc: 22.99, // Peso adequado
    observacoes: "Uso ativo de espessante alimentar na água e líquidos devido à disfagia neurogênica pós-AVC. Dieta pastosa com excelente aceitação.",
    patientId: "pat-003",
    userId: "usr-nutri-005",
    createdAt: new Date("2026-07-12T14:00:00Z")
  },
  {
    id: "nut-004",
    peso: 79.2,
    altura: 1.60,
    imc: 30.93, // Obesidade grau 1 / Monitorar edemas
    observacoes: "Implantada dieta hipossódica restrita devido ao quadro de ICC e edemas flutuantes. Peso superestimado pela retenção hídrica ativa.",
    patientId: "pat-004",
    userId: "usr-nutri-005",
    createdAt: new Date("2026-07-15T10:30:00Z")
  },
  {
    id: "nut-005",
    peso: 59.5,
    altura: 1.70,
    imc: 20.58, // Risco de desnutrição (baixo peso para idoso)
    observacoes: "Tremores de Parkinson dificultam a autoalimentação. Necessita de talheres adaptados e auxílio físico leve da equipe técnica. Iniciada discussão sobre suplementação proteica.",
    patientId: "pat-005",
    userId: "usr-nutri-005",
    createdAt: new Date("2026-07-10T09:15:00Z")
  },
  {
    id: "nut-006",
    peso: 61.0,
    altura: 1.58,
    imc: 24.43, // Eutrofia
    observacoes: "Apresenta baixa visão severa. Equipe orientada a organizar o prato utilizando o método do relógio e descrever os alimentos servidos.",
    patientId: "pat-006",
    userId: "usr-nutri-005",
    createdAt: new Date("2026-07-11T11:30:00Z")
  },
  {
    id: "nut-007",
    peso: 51.0,
    altura: 1.65,
    imc: 18.73, // Baixo peso acentuado
    observacoes: "Paciente com DPOC grave, apresenta elevado gasto energético basal pelo esforço respiratório. Dieta hipercalórica e hiperproteica fracionada em menores volumes.",
    patientId: "pat-007",
    userId: "usr-nutri-005",
    createdAt: new Date("2026-07-16T15:20:00Z")
  },
  {
    id: "nut-008",
    peso: 74.0,
    altura: 1.62,
    imc: 28.19, // Sobrepeso adaptativo
    observacoes: "Paciente cadeirante por artrose severa. Boa ingestão de fibras e líquidos para evitar obstipação decorrente da baixa mobilidade.",
    patientId: "pat-008",
    userId: "usr-nutri-005",
    createdAt: new Date("2026-07-17T09:45:00Z")
  }
];