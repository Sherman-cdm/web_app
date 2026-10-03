import type { HospitalState } from '../types';

export function audit(
  state: HospitalState,
  hospitalId: string,
  action: string,
  detail: string,
  actor = 'Recepción hospitalaria',
) {
  state.audit.unshift({
    id: crypto.randomUUID(),
    hospitalId,
    action,
    detail,
    actor,
    at: new Date().toISOString(),
  });
}
