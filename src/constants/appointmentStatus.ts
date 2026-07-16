export const AppointmentStatus = {
  AGENDADO: "agendado",
  REALIZADO: "realizado",
  CANCELADO: "cancelado",
} as const;


export type AppointmentStatusType =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];