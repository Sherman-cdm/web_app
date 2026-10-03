# appointments.ts

[Índice general](../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../src/domain/appointments.ts)

**Ruta:** `src/domain/appointments.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
import type { Appointment } from '../types';

export const occupies = (a: Appointment) =>
  !['cancelled', 'rejected', 'no_show'].includes(a.status);

export const activeReservation = (a: Appointment) =>
  ['pending', 'confirmed', 'arrived'].includes(a.status);
```
