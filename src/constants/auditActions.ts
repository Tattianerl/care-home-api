export const AuditActions = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  DEACTIVATE: "DEACTIVATE",
  ACTIVATE: "ACTIVATE",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  UPLOAD: "UPLOAD",
  DOWNLOAD: "DOWNLOAD",
} as const;

export type AuditAction =
  (typeof AuditActions)[keyof typeof AuditActions];