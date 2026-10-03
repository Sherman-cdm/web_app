# booking.ts

[Índice general](../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../src/domain/booking.ts)

**Ruta:** `src/domain/booking.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
import type { Appointment, BookingRequest, HospitalState } from '../types';
import { minutes, overlap } from '../utils/time';
import { occupies } from './appointments';
import { audit } from './audit';
import { candidates } from './availability';
import { requireValue, validatePatient } from './validation';

export function reserve(
  state: HospitalState,
  request: BookingRequest,
  source: 'patient' | 'hospital',
  existingId?: string,
): Appointment {
  validatePatient(request.patient);
  const slot = candidates(
    state,
    request.hospitalId,
    request.specialtyId,
    request.date,
    request.professionalId,
    existingId,
  ).find((s) => s.time === request.time && s.available);
  requireValue(
    slot,
    'El horario ya no está disponible. Revisá la agenda y elegí otro.',
    'CONFLICT',
  );
  requireValue(
    !state.appointments.some(
      (a) =>
        a.id !== existingId &&
        occupies(a) &&
        a.date === request.date &&
        a.patient.dni === request.patient.dni &&
        overlap(minutes(a.time), a.durationMinutes ?? 30, minutes(slot.time), slot.durationMinutes),
    ),
    'Este paciente ya tiene un turno que se superpone.',
    'CONFLICT',
  );
  const status =
    source === 'hospital' ||
    state.settings.find((s) => s.hospitalId === request.hospitalId)?.autoApprove
      ? 'confirmed'
      : 'pending';
  const appointment: Appointment = {
    ...request,
    patient: {
      ...request.patient,
      fullName: request.patient.fullName.trim(),
      email: request.patient.email.trim(),
      phone: request.patient.phone.trim(),
    },
    id: existingId ?? `PIL-${crypto.randomUUID()}`,
    status,
    professionalId: slot.professionalId,
    agendaId: slot.agendaId,
    durationMinutes: slot.durationMinutes,
    source,
    createdAt: new Date().toISOString(),
  };
  if (existingId) {
    const index = state.appointments.findIndex((a) => a.id === existingId);
    requireValue(index >= 0, 'No se encontró el turno.', 'NOT_FOUND');
    appointment.createdAt = state.appointments[index].createdAt;
    state.appointments[index] = appointment;
  } else state.appointments.push(appointment);
  audit(
    state,
    request.hospitalId,
    existingId ? 'Turno reprogramado' : 'Turno creado',
    `${appointment.patient.fullName} · ${request.date} ${request.time}`,
    source === 'patient' ? 'Portal del paciente' : 'Recepción hospitalaria',
  );
  return appointment;
}
```
