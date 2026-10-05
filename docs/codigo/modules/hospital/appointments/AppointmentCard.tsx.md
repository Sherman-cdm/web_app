# AppointmentCard.tsx

[Índice general](../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../src/modules/hospital/appointments/AppointmentCard.tsx)

**Ruta:** `src/modules/hospital/appointments/AppointmentCard.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { patientName } from '../../../utils/patientName';
import { activeReservation } from '../../../domain/appointments';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import type { Appointment, AppointmentStatus } from '../../../types';
import { formatDate, todayISO } from '../../../utils/date';
import { useHospital } from '../context/HospitalContext';

export function AppointmentCard({
  a,
  onEdit,
  ask,
}: {
  a: Appointment;
  onEdit: (a: Appointment) => void;
  ask: (a: Appointment, status: AppointmentStatus) => void;
}) {
  const { state } = useHospital();
  return (
    <article className="card" key={a.id}>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr_auto]">
        <div>
          <h2 className="font-bold">{patientName(a.patient.fullName)}</h2>
          <p className="mt-1 text-sm text-slate-500">DNI {a.patient.dni}</p>
          <p className="mt-1 break-all text-xs text-slate-400">
            {a.patient.phone} · {a.patient.email}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">
            {state.specialties.find((s) => s.id === a.specialtyId)?.name}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {state.professionals.find((p) => p.id === a.professionalId)?.fullName ?? 'Sin asignar'}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {state.agendas.find((g) => g.id === a.agendaId)?.room}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">{formatDate(a.date)}</p>
          <p className="mt-1 text-sm text-slate-500">
            {a.time} h · {a.durationMinutes ?? 30} min
          </p>
        </div>
        <div>
          <StatusBadge status={a.status} />
        </div>
      </div>
      {a.reason && <p className="mt-3 text-sm text-slate-500">Motivo: {a.reason}</p>}
      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
        {a.status === 'pending' && (
          <button className="btn-primary py-2" onClick={() => ask(a, 'confirmed')}>
            Aprobar
          </button>
        )}
        {a.status === 'confirmed' && a.date === todayISO() && (
          <button className="btn-secondary" onClick={() => ask(a, 'arrived')}>
            Registrar llegada
          </button>
        )}
        {['confirmed', 'arrived'].includes(a.status) && a.date <= todayISO() && (
          <button className="btn-secondary" onClick={() => ask(a, 'completed')}>
            Marcar atendido
          </button>
        )}
        {a.status === 'confirmed' && a.date <= todayISO() && (
          <button className="btn-secondary" onClick={() => ask(a, 'no_show')}>
            Ausente
          </button>
        )}
        {activeReservation(a) && (
          <>
            <button className="btn-secondary" onClick={() => onEdit(a)}>
              Reprogramar
            </button>
            <button className="btn-secondary text-red-700" onClick={() => ask(a, 'cancelled')}>
              Cancelar
            </button>
          </>
        )}
      </div>
    </article>
  );
}
```
