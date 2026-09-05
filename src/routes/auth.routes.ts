import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { RegisterController } from "../controllers/RegisterController";
import { LoginController } from "../controllers/LoginController";
import { CreatePatientController } from "../controllers/CreatePatientController";
import { CreateEvolutionController } from "../controllers/CreateEvolutionController";
import { ListPatientsController } from "../controllers/ListPatientsController";
import { GetPatientController } from "../controllers/GetPatientController";

import { ListEvolutionsController } from "../controllers/ListEvolutionsController";
import { ListPatientEvolutionsController } from "../controllers/ListPatientEvolutionsController";
import { UpdatePatientController } from "../controllers/UpdatePatientController";
import { DeletePatientController } from "../controllers/DeletePatientController";
import { UpdateEvolutionController } from "../controllers/UpdateEvolutionController";
import { DeleteEvolutionController } from "../controllers/DeleteEvolutionController";
import { DashboardController } from "../controllers/DashboardController";

import { UploadController } from "../controllers/UploadController";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { UserRole } from "@prisma/client";
import { UploadPatientDocumentController } from "../controllers/UploadPatientDocumentController";
import { ListPatientDocumentsController } from "../controllers/ListPatientDocumentsController";

import { CreateVitalSignController } from "../controllers/CreateVitalSignController";
import { ListPatientVitalSignsController } from "../controllers/ListPatientVitalSignsController";
import { CreatePatientMedicationController } from "../controllers/CreatePatientMedicationController";
import { ListPatientMedicationsController } from "../controllers/ListPatientMedicationsController";
import { GeneratePatientReportController } from "../controllers/reports/GeneratePatientReportController";
import { CreateAppointmentController } from "../controllers/CreateAppointmentController";
import { ListPatientAppointmentsController } from "../controllers/ListPatientAppointmentsController";
import { UpdateAppointmentStatusController } from "../controllers/UpdateAppointmentStatusController";
import { ListTodayAppointmentsController } from "../controllers/ListTodayAppointmentsController";
import { CreateNutritionalAssessmentController } from "../controllers/CreateNutritionalAssessmentController";
import { ListPatientNutritionalAssessmentsController } from "../controllers/ListPatientNutritionalAssessmentsController";
import { UploadSignatureController } from "../controllers/UploadSignatureController";
import { GetProfileController } from "../controllers/GetProfileController";

import { ListAuditLogsController } from "../controllers/audit/ListAuditLogsController";
import { AuditSummaryController } from "../controllers/audit/AuditSummaryController";

import { PatientsByMonthController } from "../controllers/PatientsByMonthController";
import { EvolutionsByMonthController } from "../controllers/EvolutionsByMonthController";
import { AppointmentsByMonthController } from "../controllers/AppointmentsByMonthController";
import { DocumentsByMonthController } from "../controllers/DocumentsByMonthController";

import { TopUsersController } from "../controllers/TopUsersController";
import { PatientTimelineController } from "../controllers/PatientTimelineController";
import { UpcomingAppointmentsController } from "../controllers/UpcomingAppointmentsController";
import { DashboardTodayController } from "../controllers/DashboardTodayController";

import { DownloadPatientDocumentController } from "../controllers/DownloadPatientDocumentController";

import { upload } from "../config/multer";
import { DeletePatientDocumentController } from "../controllers/DeletePatientDocumentController";
import { ResetPasswordByAdminController } from "../controllers/ResetPasswordByAdminController";
import { ListUsersController } from "../controllers/ListUsersController";
import { UpdatePasswordController } from "../controllers/UpdatePasswordController";
import { ToggleUserStatusController } from "../controllers/ToggleUserStatusController";

import { ExportEvolutionController } from "../controllers/reports/ExportEvolutionController";
import { ExportMedicationController } from "../controllers/reports/ExportMedicationController";
import { ExportVitalSignsController } from "../controllers/reports/ExportVitalSignsController";
import { ExportDocumentsController } from "../controllers/reports/ExportDocumentsController";
import { ExportPatientsController } from "../controllers/reports/ExportPatientsController";
import { ExportAuditLogsController } from "../controllers/reports/ExportAuditLogsController";
import { ListAppointmentsController } from "../controllers/ListAppointmentsController";
import { GetAppointmentController } from "../controllers/GetAppointmentController";
import { GetMedicationController } from "../controllers/GetMedicationController";
import { UpdateMedicationController } from "../controllers/UpdateMedicationController";
import { UpdateAppointmentController } from "../controllers/UpdateAppointmentController";
import { ListAllDocumentsController } from "../controllers/ListAllDocumentsController";
import { ExportEvolutionsPdfController } from "../controllers/reports/ExportEvolutionsPdfController";
import { ExportVitalSignsPdfController } from "../controllers/reports/ExportVitalSignsPdfController";
import { ListAllVitalSignsController } from "../controllers/ListAllVitalSignsController";

import { GetLatestPatientNutritionalAssessmentController } from "../controllers/GetLatestPatientNutritionalAssessmentController";
import { UpdateNutritionalAssessmentController } from "../controllers/UpdateNutritionalAssessmentController";
import { DeleteNutritionalAssessmentController } from "../controllers/DeleteNutritionalAssessmentController";
import { GetTodayNutritionalAssessmentsController } from "../controllers/GetTodayNutritionalAssessmentsController";
import { UpdateVitalSignController } from "../controllers/UpdateVitalSignController";

import { GetLatestVitalSignController } from "../controllers/GetLatestVitalSignController";
import { ExportPatientsPdfController } from "../controllers/reports/ExportPatientsPdfController";
import { ExportMedicationsPdfController } from "../controllers/reports/ExportMedicationsPdfController";
import { ExportDocumentsPdfController } from "../controllers/reports/ExportDocumentsPdfController";
import { ExportAuditPdfController } from "../controllers/reports/ExportAuditPdfController";

const authRoutes = Router();

const registerController = new RegisterController();
const loginController = new LoginController();
const createPatientController = new CreatePatientController();
const createEvolutionController = new CreateEvolutionController();

const listPatientsController = new ListPatientsController();
const getPatientController = new GetPatientController();
const updatePatientController = new UpdatePatientController();
const deletePatientController = new DeletePatientController();

const listEvolutionsController = new ListEvolutionsController();
const listPatientEvolutionsController = new ListPatientEvolutionsController();
const updateEvolutionController = new UpdateEvolutionController();
const deleteEvolutionController = new DeleteEvolutionController();

const exportEvolutionController = new ExportEvolutionController();
const exportMedicationController = new ExportMedicationController();
const exportVitalSignsController = new ExportVitalSignsController();
const exportDocumentsController = new ExportDocumentsController();

const dashboardController = new DashboardController();

const uploadController = new UploadController();
const uploadPatientDocumentController = new UploadPatientDocumentController();

const listPatientDocumentsController = new ListPatientDocumentsController();

const createPatientMedicationController = new CreatePatientMedicationController();
const listPatientMedicationsController = new ListPatientMedicationsController();
const generatePatientReportController = new GeneratePatientReportController();

const createAppointmentController = new CreateAppointmentController();
const listAppointmentsController = new ListAppointmentsController();
const listPatientAppointmentsController = new ListPatientAppointmentsController();
const updateAppointmentStatusController = new UpdateAppointmentStatusController();
const listTodayAppointmentsController = new ListTodayAppointmentsController();
const getAppointmentController = new GetAppointmentController();
const getMedicationController = new GetMedicationController();
const updateMedicationController = new UpdateMedicationController();
const updateAppointmentController = new UpdateAppointmentController();

const createNutritionalAssessmentController = new CreateNutritionalAssessmentController();
const listPatientNutritionalAssessmentsController = new ListPatientNutritionalAssessmentsController();
const uploadSignatureController = new UploadSignatureController();
const getProfileController = new GetProfileController();
const listAuditLogsController = new ListAuditLogsController();

const patientsByMonthController = new PatientsByMonthController();
const evolutionsByMonthController = new EvolutionsByMonthController();
const appointmentsByMonthController = new AppointmentsByMonthController();
const documentsByMonthController = new DocumentsByMonthController();
const auditSummaryController = new AuditSummaryController();
const topUsersController = new TopUsersController();
const patientTimelineController = new PatientTimelineController();
const upcomingAppointmentsController = new UpcomingAppointmentsController();
const dashboardTodayController = new DashboardTodayController();

const listAllDocumentsController = new ListAllDocumentsController();
const downloadPatientDocumentController = new DownloadPatientDocumentController();
const deletePatientDocumentController = new DeletePatientDocumentController();

const exportPatientsController = new ExportPatientsController();
const exportAuditLogsController = new ExportAuditLogsController();
const resetPasswordByAdminController = new ResetPasswordByAdminController();
const listUsersController = new ListUsersController();
const updatePasswordController = new UpdatePasswordController();
const toggleUserStatusController = new ToggleUserStatusController();

const exportEvolutionsPdfController = new ExportEvolutionsPdfController();
const exportVitalSignsPdfController = new ExportVitalSignsPdfController();

const createVitalSignController = new CreateVitalSignController();
const listPatientVitalSignsController = new ListPatientVitalSignsController();
const updateVitalSignController = new UpdateVitalSignController();

const listAllVitalSignsController = new ListAllVitalSignsController();
const getLatestVitalSignController = new GetLatestVitalSignController();
const exportPatientsPdfController = new ExportPatientsPdfController();

const exportMedicationsPdfController = new ExportMedicationsPdfController();
const exportDocumentsPdfController = new ExportDocumentsPdfController();

const exportAuditPdfController = new ExportAuditPdfController();

/** ==========================================
 *  ROTAS DE AUTENTICAÇÃO E GESTÃO DE USUÁRIOS
 *  (Acesso exclusivo ADMIN para gestão)
 *  ========================================== */

authRoutes.post("/login", loginController.handle);

authRoutes.post("/register", authMiddleware, roleMiddleware(UserRole.ADMIN), registerController.handle);

authRoutes.patch("/users/admin-reset-password", authMiddleware, roleMiddleware(UserRole.ADMIN), resetPasswordByAdminController.handle);

authRoutes.get("/users", authMiddleware, roleMiddleware(UserRole.ADMIN), listUsersController.handle);

authRoutes.put("/users/update-password", authMiddleware, updatePasswordController.handle);

authRoutes.patch("/users/:id/toggle-status", authMiddleware, roleMiddleware(UserRole.ADMIN), toggleUserStatusController.handle);


/** ==========================================
 *  ROTAS DE PACIENTES
 *  ========================================== */

authRoutes.post("/patients",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.RECEPCAO),
  createPatientController.handle
);

authRoutes.get("/patients", 
  authMiddleware, 
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.RECEPCAO), 
  listPatientsController.handle
);

authRoutes.get("/patients/:id", 
  authMiddleware, 
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.RECEPCAO), 
  getPatientController.handle
);

authRoutes.put("/patients/:id",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.ENFERMEIRO, UserRole.RECEPCAO),
  updatePatientController.handle
);

authRoutes.delete("/patients/:id",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL),
  deletePatientController.handle
);


/** ==========================================
 *  ROTAS DE EVOLUÇÕES CLÍNICAS
 *  ========================================== */

authRoutes.post("/evolutions",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.PSICOLOGO, UserRole.NUTRICIONISTA, UserRole.FISIOTERAPEUTA, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO), 
  createEvolutionController.handle
);

authRoutes.get("/evolutions", 
  authMiddleware, 
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO), 
  listEvolutionsController.handle
);

authRoutes.get("/patients/:id/evolutions",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO),
  listPatientEvolutionsController.handle
);

authRoutes.put("/evolutions/:id",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.PSICOLOGO, UserRole.NUTRICIONISTA, UserRole.FISIOTERAPEUTA, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO), 
  updateEvolutionController.handle
);

authRoutes.delete("/evolutions/:id",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL),
  deleteEvolutionController.handle
);


/** ==========================================
 *  ROTAS DE RELATÓRIOS E AUDITORIA
 *  ========================================== */

authRoutes.get("/reports/patients",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO),
  exportPatientsController.handle
);

authRoutes.get("/reports/patients/pdf",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL),
  exportPatientsPdfController.handle
);

authRoutes.get("/reports/evolutions",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO),
  exportEvolutionController.handle
);

authRoutes.get("/reports/evolutions/pdf",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL),
  exportEvolutionsPdfController.handle
);

authRoutes.get("/reports/medications",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO),
  exportMedicationController.handle
);

authRoutes.get("/reports/medications/pdf",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL),
  exportMedicationsPdfController.handle
);

authRoutes.get("/reports/vital-signs",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM),
  exportVitalSignsController.handle
);

authRoutes.get("/reports/vitals/pdf",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL),
  exportVitalSignsPdfController.handle
);

authRoutes.get("/reports/documents",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL),
  exportDocumentsController.handle
);

authRoutes.get("/reports/documents/pdf",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL),
  exportDocumentsPdfController.handle
);

authRoutes.get("/reports/audit",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL),
  exportAuditLogsController.handle
);

authRoutes.get("/reports/audit/pdf",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL),
  exportAuditPdfController.handle
);

authRoutes.get("/export/audit-logs",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL),
  exportAuditLogsController.handle
);

authRoutes.get("/audit-logs", 
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL),
  listAuditLogsController.handle
);


/** ==========================================
 *  ROTAS DE DASHBOARD E ESTATÍSTICAS
 *  ========================================== */

authRoutes.get("/dashboard", 
  authMiddleware, 
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.RECEPCAO), 
  dashboardController.handle
);

authRoutes.get("/dashboard/patients-by-month",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.RECEPCAO),
  patientsByMonthController.handle
);

authRoutes.get("/dashboard/evolutions-by-month",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.RECEPCAO),
  evolutionsByMonthController.handle
);

authRoutes.get("/dashboard/appointments-by-month",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.RECEPCAO),
  appointmentsByMonthController.handle
);

authRoutes.get("/dashboard/documents-by-month",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.RECEPCAO),
  documentsByMonthController.handle
);

authRoutes.get("/dashboard/today",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.RECEPCAO),
  dashboardTodayController.handle
);

authRoutes.get("/dashboard/audit-summary",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL),
  auditSummaryController.handle
);

authRoutes.get("/dashboard/top-users",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL),
  topUsersController.handle
);


/** ==========================================
 *  ROTAS DE DOCUMENTOS E UPLOADS
 *  ========================================== */

authRoutes.post("/upload",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.ENFERMEIRO, UserRole.FISIOTERAPEUTA, UserRole.MEDICO, UserRole.NUTRICIONISTA, UserRole.TECNICO_ENFERMAGEM, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.RECEPCAO),
  upload.single("file"),
  uploadController.handle
);

authRoutes.post("/patients/:id/documents",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.ENFERMEIRO, UserRole.RECEPCAO),
  upload.single("file"),
  uploadPatientDocumentController.handle
);

authRoutes.get("/documents",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.ENFERMEIRO, UserRole.MEDICO, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.TECNICO_ENFERMAGEM, UserRole.RECEPCAO),
  listAllDocumentsController.handle
);

authRoutes.get("/patients/:id/documents",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.ENFERMEIRO, UserRole.MEDICO, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.TECNICO_ENFERMAGEM, UserRole.RECEPCAO),
  listPatientDocumentsController.handle
);

authRoutes.get("/documents/:id/download",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.ENFERMEIRO, UserRole.MEDICO, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.TECNICO_ENFERMAGEM, UserRole.RECEPCAO),
  downloadPatientDocumentController.handle
);

authRoutes.delete("/documents/:id",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL),
  deletePatientDocumentController.handle
);


/** ==========================================
 *  ROTAS DE SINAIS VITAIS
 *  ========================================== */

authRoutes.post("/patients/:id/vital-signs",
  authMiddleware,
  roleMiddleware(UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM),
  createVitalSignController.handle
);

authRoutes.put("/vital-signs/:id",
  authMiddleware,
  roleMiddleware(UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM), 
  updateVitalSignController.handle
);

authRoutes.get("/vital-signs",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.RECEPCAO),
  listAllVitalSignsController.handle
);

authRoutes.get("/patients/:id/vital-signs",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.RECEPCAO),
  listPatientVitalSignsController.handle
);

authRoutes.get("/patients/:id/vital-signs/latest",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.RECEPCAO),
  getLatestVitalSignController.handle
);


/** ==========================================
 *  ROTAS DE MEDICAÇÕES
 *  ========================================== */

authRoutes.post("/patients/:id/medications",
  authMiddleware,
  roleMiddleware(UserRole.MEDICO, UserRole.ENFERMEIRO), 
  createPatientMedicationController.handle
);

authRoutes.put("/medications/:id",
  authMiddleware,
  roleMiddleware(UserRole.MEDICO, UserRole.ENFERMEIRO),
  updateMedicationController.handle
);

authRoutes.get("/patients/:id/medications",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.RECEPCAO),
  listPatientMedicationsController.handle
);

authRoutes.get("/medications/:id",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.RECEPCAO),
  getMedicationController.handle
);


/** ==========================================
 *  ROTAS DE TIMELINE E RELATÓRIO PDF DO PACIENTE
 *  ========================================== */

authRoutes.get("/patients/:id/timeline",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.RECEPCAO),
  patientTimelineController.handle
);

authRoutes.get("/patients/:id/report",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.RECEPCAO),
  generatePatientReportController.handle
);


/** ==========================================
 *  ROTAS DE AGENDAMENTOS
 *  ========================================== */

authRoutes.post("/appointments",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.RECEPCAO),
  createAppointmentController.handle
);

authRoutes.put("/appointments/:id",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.RECEPCAO),
  updateAppointmentController.handle
);

authRoutes.patch("/appointments/:id/status",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.RECEPCAO),
  updateAppointmentStatusController.handle
);

authRoutes.get("/appointments",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.RECEPCAO),
  listAppointmentsController.handle
);

authRoutes.get("/patients/:id/appointments",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.RECEPCAO),
  listPatientAppointmentsController.handle
);

authRoutes.get("/appointments/upcoming",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.RECEPCAO),
  upcomingAppointmentsController.handle
);

authRoutes.get("/appointments/today",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.RECEPCAO),
  listTodayAppointmentsController.handle
);

authRoutes.get("/appointments/:id",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.RECEPCAO),
  getAppointmentController.handle
);


/** ==========================================
 *  ROTAS DE AVALIAÇÕES NUTRICIONAIS
 *  ========================================== */

authRoutes.post("/nutritional-assessments",
  authMiddleware,
  roleMiddleware(UserRole.NUTRICIONISTA, UserRole.MEDICO), 
  createNutritionalAssessmentController.handle
);

authRoutes.put("/nutritional-assessments/:id",
  authMiddleware,
  roleMiddleware(UserRole.NUTRICIONISTA, UserRole.MEDICO),
  new UpdateNutritionalAssessmentController().handle
);

authRoutes.delete("/nutritional-assessments/:id",
  authMiddleware,
  roleMiddleware(UserRole.NUTRICIONISTA, UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL),
  new DeleteNutritionalAssessmentController().handle
);

authRoutes.get("/patients/:id/nutritional-assessments",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.RECEPCAO),
  listPatientNutritionalAssessmentsController.handle
);

authRoutes.get("/patients/:id/nutritional-assessments/latest",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.RECEPCAO),
  new GetLatestPatientNutritionalAssessmentController().handle
);

authRoutes.get("/nutritional-assessments/today",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM, UserRole.FISIOTERAPEUTA, UserRole.NUTRICIONISTA, UserRole.PSICOLOGO, UserRole.TERAPEUTA_OCUPACIONAL, UserRole.FONOAUDIOLOGO, UserRole.RECEPCAO),
  new GetTodayNutritionalAssessmentsController().handle
);


/** ==========================================
 *  PERFIL E ASSINATURA PRÓPRIA
 *  ========================================== */

authRoutes.post("/users/signature",
  authMiddleware,
  upload.single("file"),
  uploadSignatureController.handle
);

authRoutes.get("/me", authMiddleware, getProfileController.handle);

export { authRoutes };