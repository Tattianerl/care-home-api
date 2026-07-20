// documents.ts
export const patientDocumentsSeed = [
  {
    id: "doc-001",
    nome: "Laudo_Geriatrico_Admissao_Antonio.pdf",
    arquivo: "https://storage.carehome.com/documents/pat-001/laudo_admissao.pdf",
    patientId: "pat-001",
    createdAt: new Date("2026-01-15T10:00:00Z"),
    deletedAt: null,
    deletedBy: null,
    deletedByUserId: null
  },
  {
    id: "doc-002",
    nome: "Exames_Laboratoriais_Julho2026_Antonio.pdf",
    arquivo: "https://storage.carehome.com/documents/pat-001/exames_lab_jul26.pdf",
    patientId: "pat-001",
    createdAt: new Date("2026-07-16T09:00:00Z"),
    deletedAt: null,
    deletedBy: null,
    deletedByUserId: null
  },
  {
    id: "doc-003",
    nome: "Laudo_Neurologico_Alzheimer_Maria.pdf",
    arquivo: "https://storage.carehome.com/documents/pat-002/laudo_neuro_alzheimer.pdf",
    patientId: "pat-002",
    createdAt: new Date("2026-02-10T14:30:00Z"),
    deletedAt: null,
    deletedBy: null,
    deletedByUserId: null
  },
  {
    id: "doc-004",
    nome: "RG_CPF_Digitalizado_Responsavel_Ana.pdf",
    arquivo: "https://storage.carehome.com/documents/pat-002/doc_responsavel.pdf",
    patientId: "pat-002",
    createdAt: new Date("2026-02-10T14:45:00Z"),
    deletedAt: null,
    deletedBy: null,
    deletedByUserId: null
  },
  {
    id: "doc-005",
    nome: "Laudo_Tomografia_Cranio_AVC_Geraldo.pdf",
    arquivo: "https://storage.carehome.com/documents/pat-003/tomo_cranio_avc.pdf",
    patientId: "pat-003",
    createdAt: new Date("2026-05-20T11:15:00Z"),
    deletedAt: null,
    deletedBy: null,
    deletedByUserId: null
  },
  {
    id: "doc-006",
    nome: "Relatorio_Alta_Hospitalar_Geraldo.pdf",
    arquivo: "https://storage.carehome.com/documents/pat-003/alta_hospitalar.pdf",
    patientId: "pat-003",
    createdAt: new Date("2026-05-20T11:20:00Z"),
    deletedAt: null,
    deletedBy: null,
    deletedByUserId: null
  },
  {
    id: "doc-007",
    nome: "Ecocardiograma_Transtoracico_Francisca.pdf",
    arquivo: "https://storage.carehome.com/documents/pat-004/eco_cardio_2026.pdf",
    patientId: "pat-004",
    createdAt: new Date("2026-03-04T16:00:00Z"),
    deletedAt: null,
    deletedBy: null,
    deletedByUserId: null
  },
  {
    id: "doc-008",
    nome: "Receita_Medica_Desatualizada_Furosemida.pdf",
    arquivo: "https://storage.carehome.com/documents/pat-004/receita_antiga_furo.pdf",
    patientId: "pat-004",
    createdAt: new Date("2026-03-04T16:10:00Z"),
    // Exemplo de documento deletado para testar soft delete e relacionamento
    deletedAt: new Date("2026-07-12T11:15:00Z"),
    deletedBy: "Dra. Helena Souza Ramos",
    deletedByUserId: "usr-doctor-001"
  },
  {
    id: "doc-009",
    nome: "Laudo_Neurologico_Parkinson_Benedito.pdf",
    arquivo: "https://storage.carehome.com/documents/pat-005/laudo_parkinson.pdf",
    patientId: "pat-005",
    createdAt: new Date("2026-06-02T10:00:00Z"),
    deletedAt: null,
    deletedBy: null,
    deletedByUserId: null
  },
  {
    id: "doc-010",
    nome: "Exames_Sangue_T3_T4_TSH_Teresa.pdf",
    arquivo: "https://storage.carehome.com/documents/pat-006/exame_tireoide.pdf",
    patientId: "pat-006",
    createdAt: new Date("2026-07-18T14:00:00Z"),
    deletedAt: null,
    deletedBy: null,
    deletedByUserId: null
  },
  {
    id: "doc-011",
    nome: "Laudo_Espirometria_Antigo_Waldemar.pdf",
    arquivo: "https://storage.carehome.com/documents/pat-007/espiro_antiga.pdf",
    patientId: "pat-007",
    createdAt: new Date("2026-01-20T09:30:00Z"),
    // Segundo exemplo de documento deletado
    deletedAt: new Date("2026-07-18T10:45:00Z"),
    deletedBy: "Clara Antunes Vieira",
    deletedByUserId: "usr-admin-007"
  },
  {
    id: "doc-012",
    nome: "RaioX_Joelhos_Bilateral_Irani.pdf",
    arquivo: "https://storage.carehome.com/documents/pat-008/rx_joelho_artrose.pdf",
    patientId: "pat-008",
    createdAt: new Date("2026-04-12T13:40:00Z"),
    deletedAt: null,
    deletedBy: null,
    deletedByUserId: null
  }
];