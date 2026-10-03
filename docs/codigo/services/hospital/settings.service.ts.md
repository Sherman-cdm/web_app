# settings.service.ts

[Índice general](../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../src/services/hospital/settings.service.ts)

**Ruta:** `src/services/hospital/settings.service.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
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
```
