/** Presentación uniforme, también para cuentas y turnos guardados anteriormente. */
export function patientName(name: string): string {
  return name.toLocaleUpperCase('es-AR');
}

export function patientActivityDetail(action: string, detail: string): string {
  const patientActions = [
    'Turno creado',
    'Turno reprogramado',
    'Turno cancelado',
    'Estado de turno actualizado',
  ];
  const separator = detail.lastIndexOf(' · ');
  return patientActions.includes(action) && separator >= 0
    ? patientName(detail.slice(0, separator)) + detail.slice(separator)
    : detail;
}
