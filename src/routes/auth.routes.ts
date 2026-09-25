import { Router } from "express";
import { UserRole } from "@prisma/client";

import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { upload } from "../config/multer";

// ======================================================
// AUTH
// ======================================================

import { RegisterController } from "../controllers/RegisterController";
import { LoginController } from "../controllers/LoginController";
import { GetProfileController } from "../controllers/GetProfileController";
import { UpdatePasswordController } from "../controllers/UpdatePasswordController";

// ======================================================
// USERS
// ======================================================

import { ResetPasswordByAdminController } from "../controllers/ResetPasswordByAdminController";
import { ListUsersController } from "../controllers/ListUsersController";
import { ToggleUserStatusController } from "../controllers/ToggleUserStatusController";

// ======================================================
// PATIENTS
// ======================================================

import { CreatePatientController } from "../controllers/CreatePatientController";
import { ListPatientsController } from "../controllers/ListPatientsController";
import { GetPatientController } from "../controllers/GetPatientController";
import { UpdatePatientController } from "../controllers/UpdatePatientController";
import { DeletePatientController } from "../controllers/DeletePatientController";
import { UpdatePatientStatusController } from "../controllers/UpdatePatientStatusController";

// ======================================================
// EVOLUTIONS
// ======================================================

import { CreateEvolutionController } from "../controllers/CreateEvolutionController";
import { ListEvolutionsController } from "../controllers/ListEvolutionsController";
import { ListPatientEvolutionsController } from "../controllers/ListPatientEvolutionsController";
import { UpdateEvolutionController } from "../controllers/UpdateEvolutionController";

// ======================================================
// DASHBOARD
// ======================================================

import { DashboardController } from "../controllers/DashboardController";
import { PatientsByMonthController } from "../controllers/PatientsByMonthController";
import { EvolutionsByMonthController } from "../controllers/EvolutionsByMonthController";
import { AppointmentsByMonthController } from "../controllers/AppointmentsByMonthController";
import { DocumentsByMonthController } from "../controllers/DocumentsByMonthController";
import { AuditSummaryController } from "../controllers/audit/AuditSummaryController";
import { TopUsersController } from "../controllers/TopUsersController";
import { DashboardTodayController } from "../controllers/DashboardTodayController";

// ======================================================
// DOCUMENTS
// ======================================================

import { UploadController } from "../controllers/UploadController";
import { UploadPatientDocumentController } from "../controllers/UploadPatientDocumentController";
import { ListPatientDocumentsController } from "../controllers/ListPatientDocumentsController";
import { ListAllDocumentsController } from "../controllers/ListAllDocumentsController";
import { DownloadPatientDocumentController } from "../controllers/DownloadPatientDocumentController";
import { DeletePatientDocumentController } from "../controllers/DeletePatientDocumentController";

// ======================================================
// VITAL SIGNS
// ======================================================

import { CreateVitalSignController } from "../controllers/CreateVitalSignController";
import { UpdateVitalSignController } from "../controllers/UpdateVitalSignController";
import { ListPatientVitalSignsController } from "../controllers/ListPatientVitalSignsController";
import { ListAllVitalSignsController } from "../controllers/ListAllVitalSignsController";
import { GetLatestVitalSignController } from "../controllers/GetLatestVitalSignController";

// ======================================================
// MEDICATIONS
// ======================================================

import { CreatePatientMedicationController } from "../controllers/CreatePatientMedicationController";
import { ListPatientMedicationsController } from "../controllers/ListPatientMedicationsController";
import { GetMedicationController } from "../controllers/GetMedicationController";
import { UpdateMedicationController } from "../controllers/UpdateMedicationController";

// ======================================================
// APPOINTMENTS
// ======================================================

import { CreateAppointmentController } from "../controllers/CreateAppointmentController";
import { ListAppointmentsController } from "../controllers/ListAppointmentsController";
import { ListPatientAppointmentsController } from "../controllers/ListPatientAppointmentsController";
import { UpdateAppointmentStatusController } from "../controllers/UpdateAppointmentStatusController";
import { ListTodayAppointmentsController } from "../controllers/ListTodayAppointmentsController";
import { GetAppointmentController } from "../controllers/GetAppointmentController";
import { UpdateAppointmentController } from "../controllers/UpdateAppointmentController";
import { UpcomingAppointmentsController } from "../controllers/UpcomingAppointmentsController";

// ======================================================
// NUTRITION
// ======================================================

import { CreateNutritionalAssessmentController } from "../controllers/CreateNutritionalAssessmentController";
import { UpdateNutritionalAssessmentController } from "../controllers/UpdateNutritionalAssessmentController";
import { ListPatientNutritionalAssessmentsController } from "../controllers/ListPatientNutritionalAssessmentsController";
import { GetLatestPatientNutritionalAssessmentController } from "../controllers/GetLatestPatientNutritionalAssessmentController";
import { GetTodayNutritionalAssessmentsController } from "../controllers/GetTodayNutritionalAssessmentsController";
import { DeleteNutritionalAssessmentController } from "../controllers/DeleteNutritionalAssessmentController";

// ======================================================
// TIMELINE / PATIENT REPORT
// ======================================================

import { PatientTimelineController } from "../controllers/PatientTimelineController";
import { GeneratePatientReportController } from "../controllers/reports/GeneratePatientReportController";

// ======================================================
// AUDIT
// ======================================================

import { ListAuditLogsController } from "../controllers/audit/ListAuditLogsController";
import { ExportAuditLogsController } from "../controllers/reports/ExportAuditLogsController";

// ======================================================
// REPORTS
// ======================================================

import { ExportPatientsController } from "../controllers/reports/ExportPatientsController";
import { ExportEvolutionController } from "../controllers/reports/ExportEvolutionController";
import { ExportMedicationController } from "../controllers/reports/ExportMedicationController";
import { ExportVitalSignsController } from "../controllers/reports/ExportVitalSignsController";
import { ExportDocumentsController } from "../controllers/reports/ExportDocumentsController";
import { ExportPatientsPdfController } from "../controllers/reports/ExportPatientsPdfController";
import { ExportEvolutionsPdfController } from "../controllers/reports/ExportEvolutionsPdfController";
import { ExportMedicationsPdfController } from "../controllers/reports/ExportMedicationsPdfController";
import { ExportVitalSignsPdfController } from "../controllers/reports/ExportVitalSignsPdfController";
import { ExportDocumentsPdfController } from "../controllers/reports/ExportDocumentsPdfController";
import { ExportAuditPdfController } from "../controllers/reports/ExportAuditPdfController";

// ======================================================
// SIGNATURE
// ======================================================

import { UploadSignatureController } from "../controllers/UploadSignatureController";

const authRoutes = Router();

// ======================================================
// CONTROLLERS
// ======================================================

const registerController = new RegisterController();
const loginController = new LoginController();
const getProfileController = new GetProfileController();
const updatePasswordController = new UpdatePasswordController();

const resetPasswordByAdminController = new ResetPasswordByAdminController();
const listUsersController = new ListUsersController();
const toggleUserStatusController = new ToggleUserStatusController();

const createPatientController = new CreatePatientController();
const listPatientsController = new ListPatientsController();
const getPatientController = new GetPatientController();
const updatePatientController = new UpdatePatientController();
const deletePatientController = new DeletePatientController();

const createEvolutionController = new CreateEvolutionController();
const listEvolutionsController = new ListEvolutionsController();
const listPatientEvolutionsController = new ListPatientEvolutionsController();
const updateEvolutionController = new UpdateEvolutionController();

const dashboardController = new DashboardController();
const patientsByMonthController = new PatientsByMonthController();
const evolutionsByMonthController = new EvolutionsByMonthController();
const appointmentsByMonthController = new AppointmentsByMonthController();
const documentsByMonthController = new DocumentsByMonthController();
const auditSummaryController = new AuditSummaryController();
const topUsersController = new TopUsersController();
const dashboardTodayController = new DashboardTodayController();

const uploadController = new UploadController();
const uploadPatientDocumentController = new UploadPatientDocumentController();
const listPatientDocumentsController = new ListPatientDocumentsController();
const listAllDocumentsController = new ListAllDocumentsController();
const downloadPatientDocumentController =
  new DownloadPatientDocumentController();
const deletePatientDocumentController = new DeletePatientDocumentController();

const createVitalSignController = new CreateVitalSignController();
const updateVitalSignController = new UpdateVitalSignController();
const listPatientVitalSignsController = new ListPatientVitalSignsController();
const listAllVitalSignsController = new ListAllVitalSignsController();
const getLatestVitalSignController = new GetLatestVitalSignController();

const createPatientMedicationController =
  new CreatePatientMedicationController();
const listPatientMedicationsController = new ListPatientMedicationsController();
const getMedicationController = new GetMedicationController();
const updateMedicationController = new UpdateMedicationController();

const createAppointmentController = new CreateAppointmentController();
const listAppointmentsController = new ListAppointmentsController();
const listPatientAppointmentsController =
  new ListPatientAppointmentsController();
const updateAppointmentStatusController =
  new UpdateAppointmentStatusController();
const listTodayAppointmentsController = new ListTodayAppointmentsController();
const getAppointmentController = new GetAppointmentController();
const updateAppointmentController = new UpdateAppointmentController();
const upcomingAppointmentsController = new UpcomingAppointmentsController();

const createNutritionalAssessmentController =
  new CreateNutritionalAssessmentController();

const updateNutritionalAssessmentController =
  new UpdateNutritionalAssessmentController();

const listPatientNutritionalAssessmentsController =
  new ListPatientNutritionalAssessmentsController();

const getLatestPatientNutritionalAssessmentController =
  new GetLatestPatientNutritionalAssessmentController();

const getTodayNutritionalAssessmentsController =
  new GetTodayNutritionalAssessmentsController();
const deleteNutritionalAssessmentController =
  new DeleteNutritionalAssessmentController();

const patientTimelineController = new PatientTimelineController();
const generatePatientReportController = new GeneratePatientReportController();

const listAuditLogsController = new ListAuditLogsController();
const exportAuditLogsController = new ExportAuditLogsController();

const exportPatientsController = new ExportPatientsController();
const exportEvolutionController = new ExportEvolutionController();
const exportMedicationController = new ExportMedicationController();
const exportVitalSignsController = new ExportVitalSignsController();
const exportDocumentsController = new ExportDocumentsController();

const exportPatientsPdfController = new ExportPatientsPdfController();
const exportEvolutionsPdfController = new ExportEvolutionsPdfController();
const exportMedicationsPdfController = new ExportMedicationsPdfController();
const exportVitalSignsPdfController = new ExportVitalSignsPdfController();
const exportDocumentsPdfController = new ExportDocumentsPdfController();
const exportAuditPdfController = new ExportAuditPdfController();

const uploadSignatureController = new UploadSignatureController();

// ======================================================
// ROLE GROUPS
// ======================================================

// Profissionais que podem consultar dados de pacientes.
// RECEPCAO pode consultar o cadastro administrativo, agenda e documentos,
// mas não possui acesso às rotas clínicas abaixo.
const patientReadRoles = [
  UserRole.COORDENADOR,
  UserRole.ENFERMEIRO,
  UserRole.TECNICO_ENFERMAGEM,
  UserRole.MEDICO,
  UserRole.FISIOTERAPEUTA,
  UserRole.NUTRICIONISTA,
  UserRole.PSICOLOGO,
  UserRole.ASSISTENTE_SOCIAL,
  UserRole.TERAPEUTA_OCUPACIONAL,
  UserRole.FONOAUDIOLOGO,
  UserRole.RECEPCAO,
];

// Profissionais que podem criar evolução.
const evolutionWriteRoles = [
  UserRole.COORDENADOR,
  UserRole.MEDICO,
  UserRole.ENFERMEIRO,
  UserRole.FISIOTERAPEUTA,
  UserRole.NUTRICIONISTA,
  UserRole.PSICOLOGO,
  UserRole.ASSISTENTE_SOCIAL,
  UserRole.TERAPEUTA_OCUPACIONAL,
  UserRole.FONOAUDIOLOGO,
];

// Leitura clínica de evoluções.
// Técnico pode consultar, mas não criar/editar.
const evolutionReadRoles = [
  ...evolutionWriteRoles,
  UserRole.TECNICO_ENFERMAGEM,
];

// Leitura de sinais vitais.
const vitalSignsReadRoles = [
  UserRole.COORDENADOR,
  UserRole.MEDICO,
  UserRole.ENFERMEIRO,
  UserRole.TECNICO_ENFERMAGEM,
  UserRole.FISIOTERAPEUTA,
  UserRole.NUTRICIONISTA,
  UserRole.PSICOLOGO,
  UserRole.ASSISTENTE_SOCIAL,
  UserRole.TERAPEUTA_OCUPACIONAL,
  UserRole.FONOAUDIOLOGO,
];

// Leitura de medicamentos.
const medicationReadRoles = [
  UserRole.COORDENADOR,
  UserRole.MEDICO,
  UserRole.ENFERMEIRO,
  UserRole.TECNICO_ENFERMAGEM,
  UserRole.FISIOTERAPEUTA,
  UserRole.NUTRICIONISTA,
  UserRole.PSICOLOGO,
  UserRole.ASSISTENTE_SOCIAL,
  UserRole.TERAPEUTA_OCUPACIONAL,
  UserRole.FONOAUDIOLOGO,
];

// Leitura de nutrição.
const nutritionReadRoles = [
  UserRole.COORDENADOR,
  UserRole.MEDICO,
  UserRole.ENFERMEIRO,
  UserRole.TECNICO_ENFERMAGEM,
  UserRole.FISIOTERAPEUTA,
  UserRole.NUTRICIONISTA,
  UserRole.PSICOLOGO,
  UserRole.ASSISTENTE_SOCIAL,
  UserRole.TERAPEUTA_OCUPACIONAL,
  UserRole.FONOAUDIOLOGO,
];

// Leitura de documentos.
const documentReadRoles = [...patientReadRoles];

// Operação de agenda.
const appointmentWriteRoles = [
  UserRole.COORDENADOR,
  UserRole.ASSISTENTE_SOCIAL,
  UserRole.RECEPCAO,
];

// Consulta de agenda.
const appointmentReadRoles = [...patientReadRoles];

// Leitura clínica geral.
const clinicalReadRoles = [
  UserRole.COORDENADOR,
  UserRole.MEDICO,
  UserRole.ENFERMEIRO,
  UserRole.TECNICO_ENFERMAGEM,
  UserRole.FISIOTERAPEUTA,
  UserRole.NUTRICIONISTA,
  UserRole.PSICOLOGO,
  UserRole.ASSISTENTE_SOCIAL,
  UserRole.TERAPEUTA_OCUPACIONAL,
  UserRole.FONOAUDIOLOGO,
];

const updatePatientStatusController = new UpdatePatientStatusController();

// ======================================================
// AUTH / USUÁRIOS
// ======================================================

authRoutes.post("/login", loginController.handle);

authRoutes.post(
  "/register",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  registerController.handle,
);

authRoutes.patch(
  "/users/admin-reset-password",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  resetPasswordByAdminController.handle,
);

authRoutes.get(
  "/users",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  listUsersController.handle,
);

authRoutes.patch(
  "/users/:id/toggle-status",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  toggleUserStatusController.handle,
);

authRoutes.put(
  "/users/update-password",
  authMiddleware,
  updatePasswordController.handle,
);

authRoutes.get("/me", authMiddleware, getProfileController.handle);

authRoutes.post(
  "/users/signature",
  authMiddleware,
  upload.single("file"),
  uploadSignatureController.handle,
);

// ======================================================
// PACIENTES
// ======================================================

authRoutes.post(
  "/patients",
  authMiddleware,
  roleMiddleware(
    UserRole.COORDENADOR,
    UserRole.ASSISTENTE_SOCIAL,
    UserRole.RECEPCAO,
  ),
  createPatientController.handle,
);

authRoutes.get(
  "/patients",
  authMiddleware,
  roleMiddleware(...patientReadRoles),
  listPatientsController.handle,
);

authRoutes.get(
  "/patients/:id",
  authMiddleware,
  roleMiddleware(...patientReadRoles),
  getPatientController.handle,
);

authRoutes.put(
  "/patients/:id",
  authMiddleware,
  roleMiddleware(
    UserRole.MEDICO,
    UserRole.ASSISTENTE_SOCIAL,
    UserRole.ENFERMEIRO,
    UserRole.RECEPCAO,
  ),
  updatePatientController.handle,
);

// Exclusão é apenas desativação institucional.
// Somente COORDENADOR.
authRoutes.delete(
  "/patients/:id",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR),
  deletePatientController.handle,
);

authRoutes.patch(
  "/patients/:id/status",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR),
  updatePatientStatusController.handle,
);

// ======================================================
// EVOLUÇÕES
// ======================================================

authRoutes.post(
  "/evolutions",
  authMiddleware,
  roleMiddleware(...evolutionWriteRoles),
  createEvolutionController.handle,
);

authRoutes.get(
  "/evolutions",
  authMiddleware,
  roleMiddleware(...evolutionReadRoles),
  listEvolutionsController.handle,
);

authRoutes.get(
  "/patients/:id/evolutions",
  authMiddleware,
  roleMiddleware(...evolutionReadRoles),
  listPatientEvolutionsController.handle,
);

authRoutes.put(
  "/evolutions/:id",
  authMiddleware,
  roleMiddleware(...evolutionWriteRoles),
  updateEvolutionController.handle,
);

// DELETE de evolução NÃO exposto.
// O modelo não possui deletedAt e o controller bloqueia exclusão física.

// ======================================================
// RELATÓRIOS
// ======================================================

// ------------------------------------------------------
// Pacientes
// ------------------------------------------------------

authRoutes.get(
  "/reports/patients",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.MEDICO, UserRole.ENFERMEIRO),
  exportPatientsController.handle,
);

authRoutes.get(
  "/reports/patients/pdf",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR),
  exportPatientsPdfController.handle,
);

// ------------------------------------------------------
// Evoluções
// ------------------------------------------------------

authRoutes.get(
  "/reports/evolutions",
  authMiddleware,
  roleMiddleware(
    UserRole.COORDENADOR,
    UserRole.MEDICO,
    UserRole.ENFERMEIRO,
    UserRole.FISIOTERAPEUTA,
    UserRole.NUTRICIONISTA,
    UserRole.PSICOLOGO,
    UserRole.ASSISTENTE_SOCIAL,
    UserRole.TERAPEUTA_OCUPACIONAL,
    UserRole.FONOAUDIOLOGO,
  ),
  exportEvolutionController.handle,
);

authRoutes.get(
  "/reports/evolutions/pdf",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR),
  exportEvolutionsPdfController.handle,
);

// ------------------------------------------------------
// Medicamentos
// ------------------------------------------------------

authRoutes.get(
  "/reports/medications",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR, UserRole.MEDICO, UserRole.ENFERMEIRO),
  exportMedicationController.handle,
);

authRoutes.get(
  "/reports/medications/pdf",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR),
  exportMedicationsPdfController.handle,
);

// ------------------------------------------------------
// Sinais vitais
// ------------------------------------------------------

authRoutes.get(
  "/reports/vital-signs",
  authMiddleware,
  roleMiddleware(
    UserRole.COORDENADOR,
    UserRole.MEDICO,
    UserRole.ENFERMEIRO,
    UserRole.TECNICO_ENFERMAGEM,
  ),
  exportVitalSignsController.handle,
);

authRoutes.get(
  "/reports/vital-signs/pdf",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR),
  exportVitalSignsPdfController.handle,
);

// ------------------------------------------------------
// Documentos
// ------------------------------------------------------

authRoutes.get(
  "/reports/documents",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR),
  exportDocumentsController.handle,
);

authRoutes.get(
  "/reports/documents/pdf",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR),
  exportDocumentsPdfController.handle,
);

// ------------------------------------------------------
// Auditoria
// ------------------------------------------------------

authRoutes.get(
  "/reports/audit",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.COORDENADOR),
  exportAuditLogsController.handle,
);

authRoutes.get(
  "/reports/audit/pdf",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.COORDENADOR),
  exportAuditPdfController.handle,
);

// Alias legado — manter temporariamente até a conferência do frontend.
authRoutes.get(
  "/export/audit-logs",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.COORDENADOR),
  exportAuditLogsController.handle,
);

authRoutes.get(
  "/audit-logs",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.COORDENADOR),
  listAuditLogsController.handle,
);

// ======================================================
// DASHBOARD
// ======================================================

// Dashboard operacional.
// ADMIN fica fora do dashboard operacional.
// ADMIN possui os painéis específicos de auditoria abaixo.
authRoutes.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware(...patientReadRoles),
  dashboardController.handle,
);

authRoutes.get(
  "/dashboard/patients-by-month",
  authMiddleware,
  roleMiddleware(...patientReadRoles),
  patientsByMonthController.handle,
);

// Indicador relacionado a evoluções é clínico.
// RECEPÇÃO não acessa.
authRoutes.get(
  "/dashboard/evolutions-by-month",
  authMiddleware,
  roleMiddleware(...clinicalReadRoles),
  evolutionsByMonthController.handle,
);

authRoutes.get(
  "/dashboard/appointments-by-month",
  authMiddleware,
  roleMiddleware(...appointmentReadRoles),
  appointmentsByMonthController.handle,
);

authRoutes.get(
  "/dashboard/documents-by-month",
  authMiddleware,
  roleMiddleware(...documentReadRoles),
  documentsByMonthController.handle,
);

authRoutes.get(
  "/dashboard/today",
  authMiddleware,
  roleMiddleware(...patientReadRoles),
  dashboardTodayController.handle,
);

authRoutes.get(
  "/dashboard/audit-summary",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.COORDENADOR),
  auditSummaryController.handle,
);

authRoutes.get(
  "/dashboard/top-users",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.COORDENADOR),
  topUsersController.handle,
);

// ======================================================
// DOCUMENTOS
// ======================================================

// ------------------------------------------------------
// Upload legado
// ------------------------------------------------------
//

authRoutes.post(
  "/upload",
  authMiddleware,
  roleMiddleware(
    UserRole.COORDENADOR,
    UserRole.ASSISTENTE_SOCIAL,
    UserRole.ENFERMEIRO,
    UserRole.FISIOTERAPEUTA,
    UserRole.MEDICO,
    UserRole.NUTRICIONISTA,
    UserRole.PSICOLOGO,
    UserRole.TECNICO_ENFERMAGEM,
    UserRole.TERAPEUTA_OCUPACIONAL,
    UserRole.FONOAUDIOLOGO,
    UserRole.RECEPCAO,
  ),
  upload.single("file"),
  uploadController.handle,
);

// ------------------------------------------------------
// Upload oficial de documento do paciente
// ------------------------------------------------------

authRoutes.post(
  "/patients/:id/documents",
  authMiddleware,
  roleMiddleware(
    UserRole.COORDENADOR,
    UserRole.ASSISTENTE_SOCIAL,
    UserRole.MEDICO,
    UserRole.ENFERMEIRO,
    UserRole.RECEPCAO,
  ),
  upload.single("file"),
  uploadPatientDocumentController.handle,
);

// ------------------------------------------------------
// Consulta de documentos
// ------------------------------------------------------

authRoutes.get(
  "/documents",
  authMiddleware,
  roleMiddleware(...documentReadRoles),
  listAllDocumentsController.handle,
);

authRoutes.get(
  "/patients/:id/documents",
  authMiddleware,
  roleMiddleware(...documentReadRoles),
  listPatientDocumentsController.handle,
);

authRoutes.get(
  "/documents/:id/download",
  authMiddleware,
  roleMiddleware(...documentReadRoles),
  downloadPatientDocumentController.handle,
);

// Exclusão lógica de documento.
// Somente COORDENADOR.
authRoutes.delete(
  "/documents/:id",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR),
  deletePatientDocumentController.handle,
);

// ======================================================
// SINAIS VITAIS
// ======================================================

authRoutes.post(
  "/patients/:id/vital-signs",
  authMiddleware,
  roleMiddleware(
    UserRole.MEDICO,
    UserRole.ENFERMEIRO,
    UserRole.TECNICO_ENFERMAGEM,
  ),
  createVitalSignController.handle,
);

authRoutes.put(
  "/vital-signs/:id",
  authMiddleware,
  roleMiddleware(
    UserRole.MEDICO,
    UserRole.ENFERMEIRO,
    UserRole.TECNICO_ENFERMAGEM,
  ),
  updateVitalSignController.handle,
);

authRoutes.get(
  "/vital-signs",
  authMiddleware,
  roleMiddleware(...vitalSignsReadRoles),
  listAllVitalSignsController.handle,
);

authRoutes.get(
  "/patients/:id/vital-signs",
  authMiddleware,
  roleMiddleware(...vitalSignsReadRoles),
  listPatientVitalSignsController.handle,
);

authRoutes.get(
  "/patients/:id/vital-signs/latest",
  authMiddleware,
  roleMiddleware(...vitalSignsReadRoles),
  getLatestVitalSignController.handle,
);

// DELETE de sinais vitais NÃO exposto.
// Prisma não possui deletedAt.

// ======================================================
// MEDICAÇÕES
// ======================================================

authRoutes.post(
  "/patients/:id/medications",
  authMiddleware,
  roleMiddleware(UserRole.MEDICO, UserRole.ENFERMEIRO),
  createPatientMedicationController.handle,
);

authRoutes.put(
  "/medications/:id",
  authMiddleware,
  roleMiddleware(UserRole.MEDICO, UserRole.ENFERMEIRO),
  updateMedicationController.handle,
);

authRoutes.get(
  "/patients/:id/medications",
  authMiddleware,
  roleMiddleware(...medicationReadRoles),
  listPatientMedicationsController.handle,
);

authRoutes.get(
  "/medications/:id",
  authMiddleware,
  roleMiddleware(...medicationReadRoles),
  getMedicationController.handle,
);

// ======================================================
// TIMELINE / RELATÓRIO DO PACIENTE
// ======================================================

authRoutes.get(
  "/patients/:id/timeline",
  authMiddleware,
  roleMiddleware(...clinicalReadRoles),
  patientTimelineController.handle,
);

authRoutes.get(
  "/patients/:id/report",
  authMiddleware,
  roleMiddleware(...clinicalReadRoles),
  generatePatientReportController.handle,
);

// ======================================================
// AGENDAMENTOS
// ======================================================

authRoutes.post(
  "/appointments",
  authMiddleware,
  roleMiddleware(...appointmentWriteRoles),
  createAppointmentController.handle,
);

authRoutes.put(
  "/appointments/:id",
  authMiddleware,
  roleMiddleware(...appointmentWriteRoles),
  updateAppointmentController.handle,
);

authRoutes.patch(
  "/appointments/:id/status",
  authMiddleware,
  roleMiddleware(...appointmentWriteRoles),
  updateAppointmentStatusController.handle,
);

authRoutes.get(
  "/appointments",
  authMiddleware,
  roleMiddleware(...appointmentReadRoles),
  listAppointmentsController.handle,
);

authRoutes.get(
  "/patients/:id/appointments",
  authMiddleware,
  roleMiddleware(...appointmentReadRoles),
  listPatientAppointmentsController.handle,
);

authRoutes.get(
  "/appointments/upcoming",
  authMiddleware,
  roleMiddleware(...appointmentReadRoles),
  upcomingAppointmentsController.handle,
);

authRoutes.get(
  "/appointments/today",
  authMiddleware,
  roleMiddleware(...appointmentReadRoles),
  listTodayAppointmentsController.handle,
);

authRoutes.get(
  "/appointments/:id",
  authMiddleware,
  roleMiddleware(...appointmentReadRoles),
  getAppointmentController.handle,
);

// ======================================================
// NUTRIÇÃO
// ======================================================

authRoutes.post(
  "/nutritional-assessments",
  authMiddleware,
  roleMiddleware(UserRole.NUTRICIONISTA),
  createNutritionalAssessmentController.handle,
);

authRoutes.put(
  "/nutritional-assessments/:id",
  authMiddleware,
  roleMiddleware(UserRole.NUTRICIONISTA),
  updateNutritionalAssessmentController.handle,
);

authRoutes.get(
  "/patients/:id/nutritional-assessments",
  authMiddleware,
  roleMiddleware(...nutritionReadRoles),
  listPatientNutritionalAssessmentsController.handle,
);

authRoutes.get(
  "/patients/:id/nutritional-assessments/latest",
  authMiddleware,
  roleMiddleware(...nutritionReadRoles),
  getLatestPatientNutritionalAssessmentController.handle,
);

authRoutes.get(
  "/nutritional-assessments/today",
  authMiddleware,
  roleMiddleware(...nutritionReadRoles),
  getTodayNutritionalAssessmentsController.handle,
);

authRoutes.delete(
  "/nutritional-assessments/:id",
  authMiddleware,
  roleMiddleware(UserRole.COORDENADOR),
  deleteNutritionalAssessmentController.handle
);

// ======================================================
// EXPORT
// ======================================================

export { authRoutes };
