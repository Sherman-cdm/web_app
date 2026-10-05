# hospitalRepository.ts

[Índice general](../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../src/infrastructure/storage/hospitalRepository.ts)

**Ruta:** `src/infrastructure/storage/hospitalRepository.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
import data from '../../mocks/mockData.json';
import { validAppointment } from '../../domain/validation';
import { ApiError } from '../../shared/errors/ApiError';
import type { HospitalState } from '../../types';
import { wait } from '../../utils/delay';
import { CHANGE_EVENT, LEGACY_KEY, STORAGE_KEY } from './keys';
import { initialState } from './seed';

export function readState(): HospitalState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const state = JSON.parse(raw) as HospitalState;
      if (
        state.version !== 2 ||
        ![
          'hospitals',
          'specialties',
          'professionals',
          'agendas',
          'blocks',
          'appointments',
          'studies',
          'settings',
          'audit',
        ].every((key) => Array.isArray(state[key as keyof HospitalState])) ||
        !state.appointments.every(validAppointment)
      )
        throw new Error();
      const missingSpecialties = data.specialties.filter(
        (specialty) => !state.specialties.some((saved) => saved.id === specialty.id),
      );
      if (missingSpecialties.length > 0) {
        state.specialties.push(
          ...missingSpecialties.map((specialty) => ({
            ...structuredClone(specialty),
            active: true,
          })),
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
      return state;
    }
    const state = initialState();
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const appointments: unknown = JSON.parse(legacy);
      if (!Array.isArray(appointments) || !appointments.every(validAppointment)) throw new Error();
      state.appointments = appointments.map((a) => ({
        ...a,
        professionalId: `prof-${a.specialtyId}`,
        agendaId: `agenda-${a.specialtyId}`,
        durationMinutes:
          state.specialties.find((s) => s.id === a.specialtyId)?.schedule.slotMinutes ?? 30,
        source: 'patient',
      }));
    }
    return state;
  } catch {
    throw new ApiError(
      'No se pudieron leer los datos guardados. Revisá el almacenamiento del navegador; tus datos no se borraron.',
      'STORAGE',
    );
  }
}

let queue: Promise<unknown> = Promise.resolve();

export function transaction<T>(operation: (state: HospitalState) => T): Promise<T> {
  const execute = async () => {
    await wait();
    const commit = () => {
      const state = readState();
      const result = operation(state);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        throw new ApiError(
          'No se pudo guardar. Verificá el espacio y los permisos de almacenamiento.',
          'STORAGE',
        );
      }
      window.dispatchEvent(new Event(CHANGE_EVENT));
      return structuredClone(result);
    };
    if (typeof navigator !== 'undefined' && navigator.locks)
      return navigator.locks.request('mi-salud-write', commit);
    return commit();
  };
  const next = queue.then(execute);
  queue = next.catch(() => undefined);
  return next;
}
```
