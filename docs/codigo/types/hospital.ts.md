# hospital.ts

[Índice general](../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../src/types/hospital.ts)

**Ruta:** `src/types/hospital.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
export interface Hospital {
  id: string;
  name: string;
  shortName: string;
  address: string;
  area: string;
}

export interface Schedule {
  days: number[];
  start: string;
  end: string;
  slotMinutes: number;
}

export interface Specialty {
  id: string;
  hospitalId: string;
  name: string;
  description: string;
  schedule: Schedule;
  active?: boolean;
}

export interface HospitalSettings {
  hospitalId: string;
  autoApprove: boolean;
}
```
