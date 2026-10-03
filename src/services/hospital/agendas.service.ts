import { activeReservation } from '../../domain/appointments';
import { audit } from '../../domain/audit';
import { availableSlots } from '../../domain/availability';
import { isDate, isTime, requireValue } from '../../domain/validation';
import { transaction } from '../../infrastructure/storage/hospitalRepository';
import type { Agenda, AgendaBlock } from '../../types';
import { todayISO } from '../../utils/date';
import { minutes } from '../../utils/time';

export const agendasService = {
  saveAgenda(input: Agenda) {
    return transaction((state) => {
      const professional = state.professionals.find(
        (p) => p.id === input.professionalId && p.hospitalId === input.hospitalId && p.active,
      );
      requireValue(
        professional &&
          professional.specialtyIds.includes(input.specialtyId) &&
          state.specialties.some((s) => s.id === input.specialtyId && s.active !== false),
        'Asigná un profesional activo al área seleccionada.',
      );
      requireValue(
        input.room.trim().length > 0 &&
          input.days.length > 0 &&
          input.days.every((d) => Number.isInteger(d) && d >= 0 && d <= 6),
        'Completá consultorio y días de atención.',
      );
      requireValue(
        isDate(input.validFrom) && isDate(input.validTo) && input.validFrom <= input.validTo,
        'Revisá la vigencia de la agenda.',
      );
      requireValue(
        isTime(input.start) &&
          isTime(input.end) &&
          input.start < input.end &&
          Number.isInteger(input.slotMinutes) &&
          input.slotMinutes >= 10 &&
          input.slotMinutes <= 120 &&
          minutes(input.end) - minutes(input.start) >= input.slotMinutes,
        'Revisá los horarios y la duración de los turnos (10 a 120 minutos).',
      );
      const previous = state.agendas.find((a) => a.id === input.id);
      requireValue(
        !previous || previous.hospitalId === input.hospitalId,
        'La agenda pertenece a otro hospital.',
      );
      if (input.active)
        requireValue(
          !state.agendas.some(
            (a) =>
              a.id !== input.id &&
              a.active &&
              a.hospitalId === input.hospitalId &&
              (a.professionalId === input.professionalId ||
                a.room.trim().toLowerCase() === input.room.trim().toLowerCase()) &&
              a.validFrom <= input.validTo &&
              a.validTo >= input.validFrom &&
              a.days.some((d) => input.days.includes(d)) &&
              a.start < input.end &&
              input.start < a.end,
          ),
          'La agenda se superpone con otra del profesional o consultorio.',
          'CONFLICT',
        );
      const affected = state.appointments.filter(
        (a) => a.agendaId === input.id && activeReservation(a) && a.date >= todayISO(),
      );
      const value = { ...input, room: input.room.trim(), id: input.id || crypto.randomUUID() };
      state.agendas = [...state.agendas.filter((a) => a.id !== value.id), value];
      requireValue(
        affected.every(
          (a) =>
            input.active &&
            a.professionalId === input.professionalId &&
            a.specialtyId === input.specialtyId &&
            a.durationMinutes === input.slotMinutes &&
            availableSlots(state, a.hospitalId, a.specialtyId, a.date, a.professionalId, a.id).some(
              (s) => s.time === a.time && s.available,
            ),
        ),
        'Este cambio afecta turnos abiertos. Reprogramalos o cancelalos antes de cambiar la agenda.',
        'CONFLICT',
      );
      audit(
        state,
        input.hospitalId,
        previous ? 'Agenda actualizada' : 'Agenda publicada',
        `${professional.fullName} · ${value.room}`,
      );
      return value;
    });
  },
  addBlock(input: Omit<AgendaBlock, 'id'>) {
    return transaction((state) => {
      requireValue(
        isDate(input.from) &&
          isDate(input.to) &&
          input.from <= input.to &&
          input.reason.trim().length >= 3,
        'Completá fechas válidas y motivo del bloqueo.',
      );
      requireValue(
        state.hospitals.some((h) => h.id === input.hospitalId) &&
          (!input.professionalId ||
            state.professionals.some(
              (p) => p.id === input.professionalId && p.hospitalId === input.hospitalId,
            )),
        'Profesional u hospital inválido.',
      );
      requireValue(
        !state.appointments.some(
          (a) =>
            a.hospitalId === input.hospitalId &&
            (!input.professionalId || a.professionalId === input.professionalId) &&
            activeReservation(a) &&
            a.date >= input.from &&
            a.date <= input.to,
        ),
        'Hay turnos abiertos en ese período. Reprogramalos o cancelalos antes de bloquear.',
        'CONFLICT',
      );
      const value = { ...input, id: crypto.randomUUID() };
      state.blocks.push(value);
      audit(
        state,
        input.hospitalId,
        'Bloqueo de agenda creado',
        `${input.from} a ${input.to} · ${input.reason}`,
      );
      return value;
    });
  },
  removeBlock(hospitalId: string, id: string) {
    return transaction((state) => {
      requireValue(
        state.blocks.some((b) => b.id === id && b.hospitalId === hospitalId),
        'No se encontró el bloqueo.',
        'NOT_FOUND',
      );
      state.blocks = state.blocks.filter((b) => b.id !== id);
      audit(state, hospitalId, 'Bloqueo retirado', id);
    });
  },
};
