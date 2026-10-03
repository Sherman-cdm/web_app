# contracts.ts

[Índice general](../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../src/types/contracts.ts)

**Ruta:** `src/types/contracts.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
import type { Appointment, BookingRequest, TimeSlot } from './appointment';
import type { Hospital, Specialty } from './hospital';
import type { MedicalStudy } from './study';

export interface HealthApi {
  getHospitals(): Promise<Hospital[]>;
  getSpecialties(hospitalId?: string): Promise<Specialty[]>;
  getTimeSlots(hospitalId: string, specialtyId: string, date: string): Promise<TimeSlot[]>;
  getAppointments(): Promise<Appointment[]>;
  createAppointment(request: BookingRequest): Promise<Appointment>;
  cancelAppointment(id: string): Promise<Appointment>;
  getStudies(dni: string): Promise<MedicalStudy[]>;
}
```
