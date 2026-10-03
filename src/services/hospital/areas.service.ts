import { activeReservation } from '../../domain/appointments';
import { audit } from '../../domain/audit';
import { requireValue } from '../../domain/validation';
import { transaction } from '../../infrastructure/storage/hospitalRepository';
import type { Specialty } from '../../types';
import { todayISO } from '../../utils/date';

export const areasService = {
  saveSpecialty(input: Specialty) {
    return transaction((state) => {
      requireValue(
        state.hospitals.some((h) => h.id === input.hospitalId) &&
          input.name.trim().length >= 3 &&
          input.description.trim().length >= 3,
        'Completá nombre y descripción del área.',
      );
      requireValue(
        !state.specialties.some(
          (s) =>
            s.id !== input.id &&
            s.hospitalId === input.hospitalId &&
            s.name.trim().toLowerCase() === input.name.trim().toLowerCase(),
        ),
        'Ya existe un área con ese nombre.',
        'CONFLICT',
      );
      const previous = state.specialties.find((s) => s.id === input.id);
      requireValue(
        !previous || previous.hospitalId === input.hospitalId,
        'El área pertenece a otro hospital.',
      );
      requireValue(
        input.active !== false ||
          !state.appointments.some(
            (a) => a.specialtyId === input.id && activeReservation(a) && a.date >= todayISO(),
          ),
        'El área tiene turnos abiertos; reprogramalos o cancelalos primero.',
        'CONFLICT',
      );
      const value = { ...input, id: input.id || crypto.randomUUID(), name: input.name.trim() };
      state.specialties = [...state.specialties.filter((s) => s.id !== value.id), value];
      audit(state, input.hospitalId, previous ? 'Área actualizada' : 'Área creada', value.name);
      return value;
    });
  },
};
