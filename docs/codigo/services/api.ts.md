# api.ts

[Índice general](../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../src/services/api.ts)

**Ruta:** `src/services/api.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
import { activeReservation } from '../domain/appointments';
import { audit } from '../domain/audit';
import { availableSlots } from '../domain/availability';
import { reserve } from '../domain/booking';
import { requireValue } from '../domain/validation';
import { readState, transaction } from '../infrastructure/storage/hospitalRepository';
import type { HealthApi } from '../types';
import { validDni } from '../utils/date';
import { wait } from '../utils/delay';

export { STORAGE_KEY } from '../infrastructure/storage/keys';

export { ApiError } from '../shared/errors/ApiError';

export const api: HealthApi = {
  async getHospitals() {
    await wait();
    return readState().hospitals;
  },
  async getSpecialties(hospitalId) {
    await wait();
    const state = readState();
    return state.specialties
      .filter((s) => s.active !== false && (!hospitalId || s.hospitalId === hospitalId))
      .map((s) => {
        const agendas = state.agendas.filter(
          (a) =>
            a.specialtyId === s.id &&
            a.active &&
            state.professionals.some(
              (p) => p.id === a.professionalId && p.active && p.specialtyIds.includes(s.id),
            ),
        );
        return {
          ...s,
          schedule: {
            ...s.schedule,
            days: [...new Set(agendas.flatMap((a) => a.days))].sort(),
            start: agendas.map((a) => a.start).sort()[0] ?? s.schedule.start,
            end:
              agendas
                .map((a) => a.end)
                .sort()
                .at(-1) ?? s.schedule.end,
          },
        };
      });
  },
  async getTimeSlots(hospitalId, specialtyId, date) {
    await wait();
    return availableSlots(readState(), hospitalId, specialtyId, date);
  },
  async getAppointments() {
    await wait();
    return readState().appointments.sort((a, b) =>
      `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`),
    );
  },
  createAppointment(request) {
    return transaction((state) => reserve(state, request, 'patient'));
  },
  cancelAppointment(id) {
    return transaction((state) => {
      const a = state.appointments.find((a) => a.id === id);
      requireValue(a, 'No se encontró el turno.', 'NOT_FOUND');
      requireValue(activeReservation(a) || a.status === 'cancelled', 'Este turno ya está cerrado.');
      if (a.status !== 'cancelled') {
        a.status = 'cancelled';
        a.reason = 'Cancelado por el paciente';
        audit(
          state,
          a.hospitalId,
          'Turno cancelado',
          `${a.patient.fullName} · ${a.date}`,
          'Portal del paciente',
        );
      }
      return a;
    });
  },
  async getStudies(dni) {
    await wait();
    requireValue(validDni(dni), 'Ingresá un DNI de 7 u 8 dígitos, sin puntos.');
    return readState().studies.filter((s) => s.dni === dni);
  },
};
```
