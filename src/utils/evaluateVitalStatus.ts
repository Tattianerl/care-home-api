export type HealthStatus = "normal" | "alerta" | "critico";

interface VitalStatusInput {
  frequenciaCardiaca?: number | null;
  saturacao?: number | null;
  temperatura?: number | null;
}

export function evaluateVitalStatus(
  vital: VitalStatusInput
): HealthStatus {
  const {
    frequenciaCardiaca,
    saturacao,
    temperatura,
  } = vital;

  // Estado crítico
  if (
    (saturacao != null && saturacao < 92) ||
    (frequenciaCardiaca != null &&
      (frequenciaCardiaca < 50 ||
        frequenciaCardiaca > 120)) ||
    (temperatura != null &&
      (temperatura < 35 ||
        temperatura > 38.5))
  ) {
    return "critico";
  }

  // Estado de alerta
  if (
    (saturacao != null && saturacao <= 95) ||
    (frequenciaCardiaca != null &&
      (frequenciaCardiaca < 60 ||
        frequenciaCardiaca > 100)) ||
    (temperatura != null &&
      (temperatura >= 37.5 ||
        temperatura <= 35.5))
  ) {
    return "alerta";
  }

  return "normal";
}