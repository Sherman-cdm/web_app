# appointments.service.ts

[Índice general](../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../src/services/hospital/appointments.service.ts)

**Ruta:** `src/services/hospital/appointments.service.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
import { activeReservation } from '../../domain/appointments';
import { audit } from '../../domain/audit';
import { reserve } from '../../domain/booking';
import { requireValue } from '../../domain/validation';
import { transaction } from '../../infrastructure/storage/hospitalRepository';
import type { AppointmentStatus, BookingRequest } from '../../types';
import { currentHospitalTime, todayISO } from '../../utils/date';
import { statusLabels } from '../../utils/status';

export const appointmentsService = {
  createAppointment(request: BookingRequest) {
    return transaction((state) => reserve(state, request, 'hospital'));
  },
  rescheduleAppointment(id: string, request: BookingRequest) {
    return transaction((state) => {
      const a = state.appointments.find((a) => a.id === id && a.hospitalId === request.hospitalId);
      requireValue(
        a && activeReservation(a),
        'Solo se pueden reprogramar turnos abiertos del hospital seleccionado.',
      );
      return reserve(state, request, 'hospital', id);
    });
  },
  setStatus(hospitalId: string, id: string, status: AppointmentStatus, reason = '') {
    return transaction((state) => {
      const a = state.appointments.find((a) => a.id === id && a.hospitalId === hospitalId);
      requireValue(a, 'No se encontró el turno.', 'NOT_FOUND');
      const allowed: Record<AppointmentStatus, AppointmentStatus[]> = {
        pending: ['confirmed', 'rejected', 'cancelled'],
        confirmed: ['arrived', 'completed', 'no_show', 'cancelled'],
        arrived: ['completed', 'cancelled'],
        completed: [],
        no_show: [],
        rejected: [],
        cancelled: [],
      };
      requireValue(
        allowed[a.status].includes(status),
        'El estado del turno cambió. Actualizá la vista.',
        'CONFLICT',
      );
      if (['cancelled', 'rejected'].includes(status))
        requireValue(reason.trim().length >= 3, 'Ingresá un motivo de al menos 3 caracteres.');
      if (status === 'confirmed')
        requireValue(
          a.date > todayISO() || (a.date === todayISO() && a.time > currentHospitalTime()),
          'Este turno ya pasó. Reprogramalo antes de aprobar.',
        );
      if (['arrived', 'completed', 'no_show'].includes(status))
        requireValue(
          a.date <= todayISO(),
          'La atención solo se registra para el día del turno o fechas anteriores.',
        );
      if (status === 'arrived')
        requireValue(a.date === todayISO(), 'La llegada se registra únicamente el día del turno.');
      a.status = status;
      a.reason = reason.trim();
      audit(
        state,
        hospitalId,
        'Estado de turno actualizado',
        `${a.patient.fullName} · ${statusLabels[status]}`,
      );
      return a;
    });
  },
};
```
