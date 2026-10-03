# appointment.ts

[Índice general](../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../src/types/appointment.ts)

**Ruta:** `src/types/appointment.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
export interface TimeSlot {
  id: string;
  hospitalId: string;
  specialtyId: string;
  date: string;
  time: string;
  available: boolean;
}

export interface Patient {
  dni: string;
  fullName: string;
  email: string;
  phone: string;
}

export type AppointmentStatus =
  'pending' | 'confirmed' | 'arrived' | 'completed' | 'no_show' | 'rejected' | 'cancelled';

export interface Appointment {
  id: string;
  hospitalId: string;
  specialtyId: string;
  date: string;
  time: string;
  patient: Patient;
  status: AppointmentStatus;
  createdAt: string;
  professionalId?: string;
  agendaId?: string;
  durationMinutes?: number;
  reason?: string;
  source?: 'patient' | 'hospital';
}

export interface BookingRequest {
  hospitalId: string;
  specialtyId: string;
  date: string;
  time: string;
  patient: Patient;
  professionalId?: string;
}
```
