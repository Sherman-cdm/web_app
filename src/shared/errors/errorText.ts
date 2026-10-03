export function errorText(error: unknown): string {
  return error instanceof Error ? error.message : 'Ocurrió un error. Volvé a intentar.';
}
