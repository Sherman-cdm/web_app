# audit.ts

[Índice general](../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../src/domain/audit.ts)

**Ruta:** `src/domain/audit.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
import type { HospitalState } from '../types';

export function audit(
  state: HospitalState,
  hospitalId: string,
  action: string,
  detail: string,
  actor = 'Recepción hospitalaria',
) {
  state.audit.unshift({
    id: crypto.randomUUID(),
    hospitalId,
    action,
    detail,
    actor,
    at: new Date().toISOString(),
  });
}
```
