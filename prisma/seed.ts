import {
  PrismaClient,
  AppointmentStatus,
} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();


async function main() {

  console.log("🌱 Iniciando seed...");

  const senhaHash = await bcrypt.hash(
  "123456",
  10
);


  // =========================
  // Criar usuário ADMIN
  // =========================

  const admin = await prisma.user.create({
    data: {
      nome: "Administrador Sistema",
      cpf: "11111111111",
      email: "admin@carehome.com",
      senha: senhaHash,
      cargo: "ADMIN",
      ativo: true,
    },
  });


  console.log(
    "✅ Usuário criado:",
    admin.email
  );


  // =========================
  // Criar paciente
  // =========================

  const patient = await prisma.patient.create({
    data: {
      nome: "Maria da Silva",
      dataNascimento:
        new Date("1945-05-09"),

      responsavel:
        "João da Silva",

      telefone:
        "21999999999",

      historicoMedico:
        "Hipertensão controlada",

      alergias:
        "Nenhuma",

      diagnosticos:
        "Hipertensão",

      observacoes:
        "Paciente em acompanhamento",

      ativo: true,
    },
  });


  console.log(
    "✅ Paciente criado:",
    patient.nome
  );


  // =========================
  // Criar agendamentos
  // =========================

  await prisma.appointment.createMany({

    data: [

      {
        titulo:
          "Consulta geriátrica",

        dataHora:
          new Date(
            "2026-07-20T09:00:00"
          ),

        observacoes:
          "Avaliação médica",

        status:
          AppointmentStatus.AGENDADO,

        patientId:
          patient.id,

        userId:
          admin.id,
      },


      {
        titulo:
          "Sessão fisioterapia",

        dataHora:
          new Date(
            "2026-07-21T14:00:00"
          ),

        observacoes:
          "Exercícios motores",

        status:
          AppointmentStatus.REALIZADO,

        patientId:
          patient.id,

        userId:
          admin.id,
      },


      {
        titulo:
          "Avaliação nutricional",

        dataHora:
          new Date(
            "2026-07-22T10:30:00"
          ),

        observacoes:
          "Revisão alimentar",

        status:
          AppointmentStatus.CANCELADO,

        patientId:
          patient.id,

        userId:
          admin.id,
      },

    ],
  });


  console.log(
    "✅ Agendamentos criados"
  );


  console.log(
    "🌱 Seed finalizado!"
  );

}


main()

.catch((error)=>{

  console.error(error);

})

.finally(async()=>{

  await prisma.$disconnect();

});