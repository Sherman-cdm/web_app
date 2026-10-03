# professional.ts

[Índice general](../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../src/types/professional.ts)

**Ruta:** `src/types/professional.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
import type { Schedule } from './hospital';

export interface Professional {
  id: string;
  hospitalId: string;
  fullName: string;
  license: string;
  specialtyIds: string[];
  email: string;
  phone: string;
  active: boolean;
}

export interface Agenda extends Schedule {
  id: string;
  hospitalId: string;
  specialtyId: string;
  professionalId: string;
  room: string;
  validFrom: string;
  validTo: string;
  active: boolean;
}

export interface AgendaBlock {
  id: string;
  hospitalId: string;
  professionalId: string;
  from: string;
  to: string;
  reason: string;
}
```
