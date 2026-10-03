import { activeReservation } from '../../domain/appointments';
import { audit } from '../../domain/audit';
import { requireValue } from '../../domain/validation';
import { transaction } from '../../infrastructure/storage/hospitalRepository';
import type { Professional } from '../../types';
import { todayISO } from '../../utils/date';

export const professionalsService = {
  saveProfessional(input: Professional) {
    return transaction((state) => {
      requireValue(
        state.hospitals.some((h) => h.id === input.hospitalId),
        'Hospital inválido.',
      );
      requireValue(
        input.fullName.trim().length >= 3 &&
          input.license.trim().length >= 3 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) &&
          /^\+?[\d\s()-]{8,20}$/.test(input.phone),
        'Completá nombre, matrícula, correo y teléfono válidos.',
      );
      requireValue(
        input.specialtyIds.length > 0 &&
          input.specialtyIds.every((id) =>
            state.specialties.some(
              (s) => s.id === id && s.hospitalId === input.hospitalId && s.active !== false,
            ),
          ),
        'Seleccioná al menos un área activa del hospital.',
      );
      requireValue(
        !state.professionals.some(
          (p) =>
            p.id !== input.id &&
            p.hospitalId === input.hospitalId &&
            p.license.trim().toLowerCase() === input.license.trim().toLowerCase(),
        ),
        'Esa matrícula ya está registrada en este hospital.',
        'CONFLICT',
      );
      const previous = state.professionals.find((p) => p.id === input.id);
      requireValue(
        !previous || previous.hospitalId === input.hospitalId,
        'El profesional pertenece a otro hospital.',
      );
      requireValue(
        !state.appointments.some(
          (a) =>
            a.professionalId === input.id &&
            activeReservation(a) &&
            a.date >= todayISO() &&
            (!input.active || !input.specialtyIds.includes(a.specialtyId)),
        ),
        'Hay turnos abiertos afectados. Reprogramalos o cancelalos antes de desactivar o quitar áreas.',
        'CONFLICT',
      );
      const value = {
        ...input,
        id: input.id || crypto.randomUUID(),
        fullName: input.fullName.trim(),
        license: input.license.trim(),
      };
      state.professionals = [...state.professionals.filter((p) => p.id !== value.id), value];
      audit(
        state,
        input.hospitalId,
        previous ? 'Profesional actualizado' : 'Profesional incorporado',
        value.fullName,
      );
      return value;
    });
  },
};
