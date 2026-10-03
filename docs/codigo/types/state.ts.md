# state.ts

[Índice general](../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../src/types/state.ts)

**Ruta:** `src/types/state.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
import type { Appointment } from './appointment';
import type { Hospital, HospitalSettings, Specialty } from './hospital';
import type { Agenda, AgendaBlock, Professional } from './professional';
import type { MedicalStudy } from './study';

export interface AuditEntry {
  id: string;
  hospitalId: string;
  at: string;
  actor: string;
  action: string;
  detail: string;
}

export interface HospitalState {
  version: 2;
  hospitals: Hospital[];
  specialties: Specialty[];
  professionals: Professional[];
  agendas: Agenda[];
  blocks: AgendaBlock[];
  appointments: Appointment[];
  studies: MedicalStudy[];
  settings: HospitalSettings[];
  audit: AuditEntry[];
}
```
