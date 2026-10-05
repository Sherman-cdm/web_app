# SpecialtyCard.tsx

[Índice general](../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../src/modules/patient/specialties/SpecialtyCard.tsx)

**Ruta:** `src/modules/patient/specialties/SpecialtyCard.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { CalendarDays, Clock3 } from 'lucide-react';
import type { Hospital, Specialty } from '../../../types';
import { weekdays } from '../../../utils/date';

export function SpecialtyCard({
  specialty,
  hospital,
  onBook,
}: {
  specialty: Specialty;
  hospital?: Hospital;
  onBook: (hospitalId: string, specialtyId: string) => void;
}) {
  const hasSchedule = specialty.schedule.days.length > 0;
  return (
    <article className="card accent-card tone-teal flex flex-col">
      <p className="eyebrow">{hospital?.shortName}</p>
      <h3 className="mt-2 text-xl font-bold">{specialty.name}</h3>
      <p className="mt-2 text-sm text-slate-500">{specialty.description}</p>
      {hasSchedule ? (
        <>
          <p className="mt-5 flex items-start gap-2 text-sm capitalize">
            <CalendarDays size={17} className="mt-0.5 shrink-0 text-brand-600" aria-hidden="true" />
            {specialty.schedule.days.map((day) => weekdays[day]).join(', ')}
          </p>
          <p className="mb-5 mt-2 flex items-center gap-2 text-sm">
            <Clock3 size={17} className="text-brand-600" aria-hidden="true" />
            {specialty.schedule.start} a {specialty.schedule.end} h
          </p>
        </>
      ) : (
        <p className="my-5 text-sm text-slate-500">Sin agenda publicada por el momento.</p>
      )}
      <button
        type="button"
        className="btn-secondary mt-auto w-full"
        disabled={!hasSchedule}
        aria-label={`Pedir turno en ${specialty.name} de ${hospital?.name ?? specialty.hospitalId}`}
        onClick={() => onBook(specialty.hospitalId, specialty.id)}
      >
        Pedir turno
      </button>
    </article>
  );
}
```
