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

const createPatientMedicationController =
  new CreatePatientMedicationController();
const listPatientMedicationsController = new ListPatientMedicationsController();
const generatePatientReportController = new GeneratePatientReportController();

const createAppointmentController = new CreateAppointmentController();
const listAppointmentsController = new ListAppointmentsController();
const listPatientAppointmentsController =
  new ListPatientAppointmentsController();
const updateAppointmentStatusController =
  new UpdateAppointmentStatusController();
const listTodayAppointmentsController = new ListTodayAppointmentsController();
const getAppointmentController = new GetAppointmentController();
const getMedicationController = new GetMedicationController();
const updateMedicationController = new UpdateMedicationController();
const updateAppointmentController = new UpdateAppointmentController();

const createNutritionalAssessmentController =
  new CreateNutritionalAssessmentController();
const listPatientNutritionalAssessmentsController =
  new ListPatientNutritionalAssessmentsController();
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
const downloadPatientDocumentController =
  new DownloadPatientDocumentController();
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
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login do usuário
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 */
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
authRoutes.put(
  "/users/update-password",
  authMiddleware,
  updatePasswordController.handle,
);
authRoutes.patch(
  "/users/:id/toggle-status",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  toggleUserStatusController.handle,
);

/**
 * @swagger
 * /auth/patients:
 *   post:
 *     summary: Cadastrar paciente
 *     tags:
 *       - Patients
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - dataNascimento
 *               - responsavel
 *               - telefone
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Maria da Silva
 *               dataNascimento:
 *                 type: string
 *                 example: 1945-05-09
 *               responsavel:
 *                 type: string
 *                 example: João Silva
 *               telefone:
 *                 type: string
 *                 example: 21999999999
 *               historicoMedico:
 *                 type: string
 *               medicamentos:
 *                 type: string
 *               alergias:
 *                 type: string
 *               diagnosticos:
 *                 type: string
 *               observacoes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Paciente cadastrado com sucesso
 *       401:
 *         description: Não autenticado
 */
authRoutes.post(
  "/patients",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.COORDENADOR, UserRole.RECEPCAO),
  createPatientController.handle
);

/**
 * @swagger
 * /auth/evolutions:
 *   post:
 *     summary: Registrar evolução de paciente
 *     tags:
 *       - Evolutions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descricao
 *               - patientId
 *             properties:
 *               descricao:
 *                 type: string
 *                 example: Paciente apresentou melhora clínica.
 *               patientId:
 *                 type: string
 *               assinatura:
 *                 type: string
 *     responses:
 *       201:
 *         description: Evolução criada com sucesso
 */

authRoutes.post("/evolutions",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.ASSISTENTE_SOCIAL, UserRole.PSICOLOGO, UserRole.NUTRICIONISTA), 
  createEvolutionController.handle
);

/**
 * @swagger
 * /auth/patients:
 *   get:
 *     summary: Listar pacientes
 *     tags:
 *       - Patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de pacientes
 */
authRoutes.get("/patients", authMiddleware, listPatientsController.handle);

/**
 * @swagger
 * /auth/patients/{id}:
 *   get:
 *     summary: Buscar paciente por ID
 *     tags:
 *       - Patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do paciente
 *       404:
 *         description: Paciente não encontrado
 */
authRoutes.get("/patients/:id", authMiddleware, getPatientController.handle);

/**
 * @swagger
 * /auth/evolutions:
 *   get:
 *     summary: Listar todas as evoluções
 *     tags:
 *       - Evolutions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de evoluções
 */
authRoutes.get("/evolutions", authMiddleware, listEvolutionsController.handle);

/**
 * @swagger
 * /auth/patients/{id}/evolutions:
 *   get:
 *     summary: Listar evoluções de um paciente
 *     tags:
 *       - Evolutions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evoluções do paciente
 */
authRoutes.get(
  "/patients/:id/evolutions",
  authMiddleware,
  listPatientEvolutionsController.handle,
);

/**
 * @swagger
 * /auth/patients/{id}:
 *   put:
 *     summary: Atualizar paciente
 *     tags:
 *       - Patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Paciente atualizado
 *       404:
 *         description: Paciente não encontrado
 */


authRoutes.put("/patients/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ENFERMEIRO, UserRole.ASSISTENTE_SOCIAL, UserRole.RECEPCAO),
  updatePatientController.handle
);

/**
 * @swagger
 * /auth/patients/{id}:
 *   delete:
 *     summary: Desativar paciente
 *     tags:
 *       - Patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paciente desativado
 *       404:
 *         description: Paciente não encontrado
 *       403:
 *         description: Apenas administradores
 */
authRoutes.delete(
  "/patients/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  deletePatientController.handle,
);

/**
 * @swagger
 * /auth/evolutions/{id}:
 *   put:
 *     summary: Atualizar evolução
 *     tags:
 *       - Evolutions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evolução atualizada
 */

authRoutes.put(
  "/evolutions/:id",
  authMiddleware,
  roleMiddleware(
    UserRole.ADMIN, 
    UserRole.COORDENADOR, 
    UserRole.MEDICO, 
    UserRole.ENFERMEIRO, 
    UserRole.ASSISTENTE_SOCIAL, 
    UserRole.PSICOLOGO, 
    UserRole.NUTRICIONISTA, 
    UserRole.FISIOTERAPEUTA, 
    UserRole.TERAPEUTA_OCUPACIONAL, 
    UserRole.FONOAUDIOLOGO
  ), 
  updateEvolutionController.handle,
);

/**
 * @swagger
 * /auth/evolutions/{id}:
 *   delete:
 *     summary: Excluir evolução
 *     tags:
 *       - Evolutions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evolução removida
 *       403:
 *         description: Apenas administradores
 */
authRoutes.delete(
  "/evolutions/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  deleteEvolutionController.handle,
);

authRoutes.get(
  "/reports/patients",
  authMiddleware,
  exportPatientsController.handle,
);
authRoutes.get(
  "/reports/patients/pdf",
  authMiddleware,
  exportPatientsPdfController.handle,
);

authRoutes.get(
  "/reports/evolutions",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.COORDENADOR, UserRole.MEDICO, UserRole.ENFERMEIRO),
  exportEvolutionController.handle,
);

authRoutes.get(
  "/reports/medications",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN,UserRole.COORDENADOR, UserRole.MEDICO, UserRole.ENFERMEIRO),
  exportMedicationController.handle,
);

authRoutes.get(
  "/reports/medications/pdf",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  exportMedicationsPdfController.handle,
);

authRoutes.get("/reports/vital-signs",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.COORDENADOR, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM),
  exportVitalSignsController.handle,
);
authRoutes.get(
  "/vital-signs",
  authMiddleware,
  listAllVitalSignsController.handle,
);

authRoutes.get(
  "/reports/documents",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  exportDocumentsController.handle,
);

authRoutes.get(
  "/reports/audit",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  exportAuditLogsController.handle,
);

authRoutes.get(
  "/reports/audit/pdf",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  exportAuditPdfController.handle,
);

authRoutes.get(
  "/reports/documents/pdf",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  exportDocumentsPdfController.handle,
);
/**
 * @swagger
 * /auth/dashboard:
 *   get:
 *     summary: Dashboard principal
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumo geral do sistema
 */
authRoutes.get("/dashboard", authMiddleware, dashboardController.handle);

/**
 * @swagger
 * /auth/upload:
 *   post:
 *     summary: Upload de arquivo
 *     tags:
 *       - Upload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload realizado
 */
authRoutes.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadController.handle,
);

/**
 * @swagger
 * /auth/patients/{id}/documents:
 *   post:
 *     summary: Enviar documento para paciente
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Documento enviado
 */

authRoutes.post(
  "/patients/:id/documents",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ENFERMEIRO, UserRole.ASSISTENTE_SOCIAL),
  upload.single("file"),
  uploadPatientDocumentController.handle,
);

/**
 * @swagger
 * /auth/patients/{id}/documents:
 *   get:
 *     summary: Listar documentos do paciente
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de documentos
 */


authRoutes.get(
  "/patients/:id/documents",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.ENFERMEIRO, UserRole.ASSISTENTE_SOCIAL, UserRole.MEDICO),
  listPatientDocumentsController.handle,
);

/**
 * @swagger
 * /auth/patients/{id}/vital-signs:
 *   post:
 *     summary: Registrar sinais vitais
 *     tags:
 *       - Vital Signs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Sinais vitais registrados
 */
authRoutes.post(
  "/patients/:id/vital-signs",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM),
  createVitalSignController.handle
);

authRoutes.put(
  "/vital-signs/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.MEDICO, UserRole.ENFERMEIRO, UserRole.TECNICO_ENFERMAGEM), 
  updateVitalSignController.handle,
);

/**
 * @swagger
 * /auth/patients/{id}/vital-signs:
 *   get:
 *     summary: Listar sinais vitais
 *     tags:
 *       - Vital Signs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Histórico de sinais vitais
 */
authRoutes.get(
  "/patients/:id/vital-signs",
  authMiddleware,
  listPatientVitalSignsController.handle,
);

authRoutes.get(
  "/patients/:id/vital-signs/latest",
  authMiddleware,
  getLatestVitalSignController.handle,
);

/**
 * @swagger
 * /auth/patients/{id}/medications:
 *   post:
 *     summary: Registrar medicação
 *     tags:
 *       - Medications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Medicação registrada
 */
authRoutes.post(
  "/patients/:id/medications",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.MEDICO, UserRole.ENFERMEIRO), 
  createPatientMedicationController.handle,
);

authRoutes.put(
  "/medications/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.MEDICO, UserRole.ENFERMEIRO),
  updateMedicationController.handle,
);

/**
 * @swagger
 * /auth/patients/{id}/medications:
 *   get:
 *     summary: Listar medicações do paciente
 *     tags:
 *       - Medications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Histórico de medicações
 */
authRoutes.get(
  "/patients/:id/medications",
  authMiddleware,
  listPatientMedicationsController.handle,
);

authRoutes.get(
  "/medications/:id",
  authMiddleware,
  getMedicationController.handle,
);

/**
 * @swagger
 * /auth/patients/{id}/report:
 *   get:
 *     summary: Gerar relatório PDF do paciente
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PDF gerado
 */
authRoutes.get(
  "/patients/:id/report",
  authMiddleware,
  generatePatientReportController.handle,
);

/**
 * @swagger
 * /auth/appointments:
 *   post:
 *     summary: Criar agendamento
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - dataHora
 *               - patientId
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Consulta geriátrica
 *               dataHora:
 *                 type: string
 *                 format: date-time
 *               observacoes:
 *                 type: string
 *               patientId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 */
authRoutes.post(
  "/appointments",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.COORDENADOR, UserRole.RECEPCAO),
  createAppointmentController.handle
);

/**
 * @swagger
 * /auth/patients/{id}/appointments:
 *   get:
 *     summary: Listar agendamentos do paciente
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 */
authRoutes.get(
  "/patients/:id/appointments",
  authMiddleware,
  listPatientAppointmentsController.handle,
);

/**
 * @swagger
 * /auth/appointments/{id}/status:
 *   patch:
 *     summary: Atualizar status do agendamento
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: concluido
 *     responses:
 *       200:
 *         description: Status atualizado
 */
authRoutes.patch(
  "/appointments/:id/status",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.COORDENADOR, UserRole.RECEPCAO),
  updateAppointmentStatusController.handle,
);

/**
 * @swagger
 * /auth/appointments/today:
 *   get:
 *     summary: Listar agendamentos do dia
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Agendamentos de hoje
 */
authRoutes.get(
  "/appointments/today",
  authMiddleware,
  listTodayAppointmentsController.handle,
);
authRoutes.get(
  "/appointments",
  authMiddleware,
  listAppointmentsController.handle,
);

authRoutes.put(
  "/appointments/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.COORDENADOR, UserRole.RECEPCAO),
  updateAppointmentController.handle,
);

/**
 * @swagger
 * /auth/nutritional-assessments:
 *   post:
 *     summary: Registrar avaliação nutricional
 *     tags:
 *       - Nutritional Assessment"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Avaliação registrada
 */
authRoutes.post(
  "/nutritional-assessments",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.NUTRICIONISTA, UserRole.MEDICO), 
  createNutritionalAssessmentController.handle
);
/**
 * @swagger
 * /auth/patients/{id}/nutritional-assessments:
 *   get:
 *     summary: Listar avaliações nutricionais
 *     tags:
 *       - Nutritional Assessment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Histórico nutricional
 */
authRoutes.get(
  "/patients/:id/nutritional-assessments",
  authMiddleware,
  listPatientNutritionalAssessmentsController.handle,
);

/**
 * @swagger
 * /auth/users/signature:
 *   post:
 *     summary: Upload de assinatura digital
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Assinatura enviada
 */
authRoutes.post(
  "/users/signature",
  authMiddleware,
  upload.single("file"),
  uploadSignatureController.handle,
);

authRoutes.get("/me", authMiddleware, getProfileController.handle);

/**
 * @swagger
 * /auth/audit-logs:
 *   get:
 *     summary: Listar logs de auditoria
 *     tags:
 *       - Audit
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de logs
 */
authRoutes.get("/audit-logs", authMiddleware,
roleMiddleware(UserRole.ADMIN, UserRole.COORDENADOR),listAuditLogsController.handle);

/**
 * @swagger
 * /auth/dashboard/patients-by-month:
 *   get:
 *     summary: Pacientes cadastrados por mês
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas mensais de pacientes
 */
authRoutes.get(
  "/dashboard/patients-by-month",
  authMiddleware,
  patientsByMonthController.handle,
);

/**
 * @swagger
 * /auth/dashboard/evolutions-by-month:
 *   get:
 *     summary: Evoluções registradas por mês
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estatísticas de evoluções
 */
authRoutes.get(
  "/dashboard/evolutions-by-month",
  authMiddleware,
  evolutionsByMonthController.handle,
);

/**
 * @swagger
 * /auth/dashboard/appointments-by-month:
 *   get:
 *     summary: Agendamentos por mês
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas de agendamentos
 */
authRoutes.get(
  "/dashboard/appointments-by-month",
  authMiddleware,
  appointmentsByMonthController.handle,
);

authRoutes.get("/documents", authMiddleware, listAllDocumentsController.handle);

/**
 * @swagger
 * /auth/dashboard/documents-by-month:
 *   get:
 *     summary: Documentos enviados por mês
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas de documentos
 */
authRoutes.get(
  "/dashboard/documents-by-month",
  authMiddleware,
  documentsByMonthController.handle,
);

/**
 * @swagger
 * /auth/dashboard/audit-summary:
 *   get:
 *     summary: Resumo de auditoria
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumo das ações auditadas
 */
authRoutes.get(
  "/dashboard/audit-summary",
  authMiddleware,
  auditSummaryController.handle,
);

/**
 * @swagger
 * /auth/dashboard/top-users:
 *   get:
 *     summary: Usuários mais ativos
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ranking de usuários
 */
authRoutes.get(
  "/dashboard/top-users",
  authMiddleware,
  topUsersController.handle,
);

/**
 * @swagger
 * /auth/patients/{id}/timeline:
 *   get:
 *     summary: Timeline completa do paciente
 *     tags:
 *       - Timeline
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Histórico completo do paciente
 */
authRoutes.get(
  "/patients/:id/timeline",
  authMiddleware,
  patientTimelineController.handle,
);

/**
 * @swagger
 * /auth/appointments/upcoming:
 *   get:
 *     summary: Listar próximos agendamentos
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Próximos agendamentos
 */
authRoutes.get(
  "/appointments/upcoming",
  authMiddleware,
  upcomingAppointmentsController.handle,
);

authRoutes.get(
  "/appointments/:id",
  authMiddleware,
  getAppointmentController.handle,
);

/**
 * @swagger
 * /auth/dashboard/today:
 *   get:
 *     summary: Dashboard operacional do dia
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Indicadores do dia
 */
authRoutes.get(
  "/dashboard/today",
  authMiddleware,
  dashboardTodayController.handle,
);

/**
 * @swagger
 * /auth/documents/{id}/download:
 *   get:
 *     summary: Download de documento
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Arquivo baixado
 */
authRoutes.get(
  "/documents/:id/download",
  authMiddleware,
  downloadPatientDocumentController.handle,
);

authRoutes.delete(
  "/documents/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.COORDENADOR, UserRole.ASSISTENTE_SOCIAL),
  deletePatientDocumentController.handle,
);

authRoutes.get(
  "/reports/evolutions/pdf",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  exportEvolutionsPdfController.handle,
);

authRoutes.get(
  "/reports/vitals/pdf",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  exportVitalSignsPdfController.handle,
);

authRoutes.get(
  "/export/audit-logs",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.COORDENADOR),
  exportAuditLogsController.handle,
);
authRoutes.get(
  "/patients/:id/nutritional-assessments/latest",
  authMiddleware,
  new GetLatestPatientNutritionalAssessmentController().handle,
);

authRoutes.put(
  "/nutritional-assessments/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.NUTRICIONISTA, UserRole.MEDICO),
  new UpdateNutritionalAssessmentController().handle,
);

authRoutes.delete(
  "/nutritional-assessments/:id",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN, UserRole.NUTRICIONISTA),
  new DeleteNutritionalAssessmentController().handle,
);

authRoutes.get(
  "/nutritional-assessments/today",
  authMiddleware,
  new GetTodayNutritionalAssessmentsController().handle,
);
export { authRoutes };
