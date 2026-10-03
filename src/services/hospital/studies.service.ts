import { audit } from '../../domain/audit';
import { isDate, requireValue } from '../../domain/validation';
import { transaction } from '../../infrastructure/storage/hospitalRepository';
import type { MedicalStudy } from '../../types';
import { todayISO, validDni } from '../../utils/date';

export const studiesService = {
  saveStudy(input: MedicalStudy) {
    return transaction((state) => {
      requireValue(
        state.hospitals.some((h) => h.id === input.hospitalId) &&
          validDni(input.dni) &&
          input.name.trim().length >= 3 &&
          isDate(input.date) &&
          input.date <= todayISO(),
        'Revisá hospital, DNI, nombre y fecha del estudio.',
      );
      requireValue(input.status === 'pending' || input.status === 'available', 'Estado inválido.');
      requireValue(
        input.status !== 'available' || (input.result?.trim().length ?? 0) >= 10,
        'Escribí el informe antes de publicarlo (al menos 10 caracteres).',
      );
      const previous = state.studies.find((s) => s.id === input.id);
      requireValue(
        !previous || previous.hospitalId === input.hospitalId,
        'El estudio pertenece a otro hospital.',
      );
      const value = { ...input, id: input.id || `EST-${crypto.randomUUID()}` };
      state.studies = [...state.studies.filter((s) => s.id !== value.id), value];
      audit(state, input.hospitalId, 'Estudio actualizado', `${input.name} · DNI ${input.dni}`);
      return value;
    });
  },
};
