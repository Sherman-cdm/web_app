# hospitalApi.ts

[Índice general](../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../src/services/hospitalApi.ts)

**Ruta:** `src/services/hospitalApi.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
import { availableSlots } from '../domain/availability';
import { readState } from '../infrastructure/storage/hospitalRepository';
import { wait } from '../utils/delay';
import { agendasService } from './hospital/agendas.service';
import { appointmentsService } from './hospital/appointments.service';
import { areasService } from './hospital/areas.service';
import { professionalsService } from './hospital/professionals.service';
import { settingsService } from './hospital/settings.service';
import { studiesService } from './hospital/studies.service';

export const hospitalApi = {
  async getState() {
    await wait();
    return readState();
  },
  async getSlots(
    hospitalId: string,
    specialtyId: string,
    date: string,
    professionalId?: string,
    excludeId?: string,
  ) {
    await wait();
    return availableSlots(readState(), hospitalId, specialtyId, date, professionalId, excludeId);
  },
  ...appointmentsService,
  ...professionalsService,
  ...areasService,
  ...agendasService,
  ...studiesService,
  ...settingsService,
};
```
