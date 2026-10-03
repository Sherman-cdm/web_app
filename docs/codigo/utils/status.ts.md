# status.ts

[Índice general](../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../src/utils/status.ts)

**Ruta:** `src/utils/status.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
import type { AppointmentStatus } from '../types';

export const statusLabels: Record<AppointmentStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  arrived: 'En espera',
  completed: 'Atendido',
  no_show: 'Ausente',
  rejected: 'Rechazado',
  cancelled: 'Cancelado',
};
```
