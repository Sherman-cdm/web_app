# TimeSlotStep.tsx

[Índice general](../../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../../src/modules/patient/booking/steps/TimeSlotStep.tsx)

**Ruta:** `src/modules/patient/booking/steps/TimeSlotStep.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { Clock3 } from 'lucide-react';
import { Loading } from '../../../../shared/components/Loading';
import type { Specialty, TimeSlot } from '../../../../types';
import { formatDate } from '../../../../utils/date';

interface Props {
  specialty?: Specialty;
  date: string;
  busy: boolean;
  slots: TimeSlot[];
  time: string;
  setTime: (time: string) => void;
}

export function TimeSlotStep({ specialty, date, busy, slots, time, setTime }: Props) {
  return (
    <>
      <p className="mb-5 text-sm text-slate-500">
        {specialty?.name} · {formatDate(date)}
      </p>
      {busy ? (
        <Loading text="Buscando horarios libres…" />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.map((slot) => (
              <button
                type="button"
                key={slot.id}
                disabled={!slot.available}
                aria-pressed={time === slot.time}
                onClick={() => setTime(slot.time)}
                className={`flex min-h-12 items-center justify-center gap-1 rounded-xl border text-sm font-semibold ${time === slot.time ? 'border-brand-600 bg-brand-600 text-white' : !slot.available ? 'border-slate-100 bg-slate-100 text-slate-400 line-through' : 'border-slate-200 hover:border-brand-600 hover:bg-brand-50'}`}
              >
                <Clock3 size={14} aria-hidden="true" />
                {slot.time}
              </button>
            ))}
          </div>
          {!slots.some((s) => s.available) && (
            <p className="mt-4 text-sm text-slate-500">
              No hay horarios disponibles. Volvé y elegí otra fecha.
            </p>
          )}
          <p className="mt-4 text-xs text-slate-500">
            Los horarios tachados están ocupados o ya pasaron.
          </p>
        </>
      )}
    </>
  );
}
```
