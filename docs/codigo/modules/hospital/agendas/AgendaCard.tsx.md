# AgendaCard.tsx

[Índice general](../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../src/modules/hospital/agendas/AgendaCard.tsx)

**Ruta:** `src/modules/hospital/agendas/AgendaCard.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { Clock3 } from 'lucide-react';
import type { Agenda } from '../../../types';
import { formatDate, weekdays } from '../../../utils/date';
import { minutes } from '../../../utils/time';
import { useHospital } from '../context/HospitalContext';

export function AgendaCard({ a, onEdit }: { a: Agenda; onEdit: (a: Agenda) => void }) {
  const { state } = useHospital();
  return (
    <article className="card" key={a.id}>
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-bold">
          {state.professionals.find((p) => p.id === a.professionalId)?.fullName}
        </h2>
        <span
          className={`badge ${a.active ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-500'}`}
        >
          {a.active ? 'Publicada' : 'Pausada'}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        {state.specialties.find((s) => s.id === a.specialtyId)?.name} · {a.room}
      </p>
      <p className="mt-4 flex items-center gap-2 text-sm font-semibold">
        <Clock3 size={16} className="text-brand-600" />
        {a.start}–{a.end} h · {a.slotMinutes} min
      </p>
      <p className="mt-2 text-sm capitalize text-slate-500">
        {a.days.map((d) => weekdays[d]).join(', ')}
      </p>
      <p className="mt-2 text-xs text-slate-500">
        {formatDate(a.validFrom)} — {formatDate(a.validTo)}
      </p>
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
        <span className="text-xs text-slate-500">
          {Math.floor((minutes(a.end) - minutes(a.start)) / a.slotMinutes)} cupos por jornada
        </span>
        <button className="btn-secondary" onClick={() => onEdit(a)}>
          Editar agenda
        </button>
      </div>
    </article>
  );
}
```
