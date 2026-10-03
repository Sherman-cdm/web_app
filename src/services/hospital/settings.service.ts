import { audit } from '../../domain/audit';
import { requireValue } from '../../domain/validation';
import { transaction } from '../../infrastructure/storage/hospitalRepository';

export const settingsService = {
  saveSettings(hospitalId: string, autoApprove: boolean) {
    return transaction((state) => {
      const settings = state.settings.find((s) => s.hospitalId === hospitalId);
      requireValue(settings, 'Hospital inválido.');
      settings.autoApprove = autoApprove;
      audit(
        state,
        hospitalId,
        'Configuración actualizada',
        autoApprove ? 'Aprobación automática activada' : 'Aprobación manual activada',
      );
      return settings;
    });
  },
};
