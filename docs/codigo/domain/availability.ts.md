# availability.ts

[Índice general](../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../src/domain/availability.ts)

**Ruta:** `src/domain/availability.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
import type { Agenda, HospitalState, TimeSlot } from '../types';
import { currentHospitalTime, parseDate, todayISO } from '../utils/date';
import { minutes, overlap, timeText } from '../utils/time';
import { occupies } from './appointments';
import { isDate } from './validation';

export function agendaApplies(state: HospitalState, a: Agenda, date: string) {
  return (
    a.active &&
    a.validFrom <= date &&
    a.validTo >= date &&
    a.days.includes(parseDate(date).getDay()) &&
    state.professionals.some(
      (p) => p.id === a.professionalId && p.active && p.specialtyIds.includes(a.specialtyId),
    ) &&
    state.specialties.some((s) => s.id === a.specialtyId && s.active !== false) &&
    !state.blocks.some(
      (b) =>
        b.hospitalId === a.hospitalId &&
        (!b.professionalId || b.professionalId === a.professionalId) &&
        b.from <= date &&
        b.to >= date,
    )
  );
}

export function candidates(
  state: HospitalState,
  hospitalId: string,
  specialtyId: string,
  date: string,
  professionalId?: string,
  excludeId?: string,
) {
  if (!isDate(date) || date < todayISO()) return [];
  const result: (TimeSlot & {
    professionalId: string;
    agendaId: string;
    durationMinutes: number;
  })[] = [];
  for (const a of state.agendas.filter(
    (a) =>
      a.hospitalId === hospitalId &&
      a.specialtyId === specialtyId &&
      (!professionalId || a.professionalId === professionalId) &&
      agendaApplies(state, a, date),
  )) {
    for (let m = minutes(a.start); m + a.slotMinutes <= minutes(a.end); m += a.slotMinutes) {
      const time = timeText(m);
      const busy = state.appointments.some(
        (booking) =>
          booking.id !== excludeId &&
          booking.date === date &&
          booking.professionalId === a.professionalId &&
          occupies(booking) &&
          overlap(m, a.slotMinutes, minutes(booking.time), booking.durationMinutes ?? 30),
      );
      result.push({
        id: `${a.id}-${date}-${time}`,
        hospitalId,
        specialtyId,
        date,
        time,
        available: !(date === todayISO() && time <= currentHospitalTime()) && !busy,
        professionalId: a.professionalId,
        agendaId: a.id,
        durationMinutes: a.slotMinutes,
      });
    }
  }
  return result;
}

export function availableSlots(
  state: HospitalState,
  hospitalId: string,
  specialtyId: string,
  date: string,
  professionalId?: string,
  excludeId?: string,
): TimeSlot[] {
  const grouped = new Map<string, TimeSlot>();
  for (const slot of candidates(state, hospitalId, specialtyId, date, professionalId, excludeId)) {
    const previous = grouped.get(slot.time);
    if (!previous || slot.available)
      grouped.set(slot.time, {
        id: `${specialtyId}-${date}-${slot.time}`,
        hospitalId,
        specialtyId,
        date,
        time: slot.time,
        available: slot.available,
      });
  }
  return [...grouped.values()].sort((a, b) => a.time.localeCompare(b.time));
}
```
