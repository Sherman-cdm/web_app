# SpecialtyStep.tsx

[Índice general](../../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../../src/modules/patient/booking/steps/SpecialtyStep.tsx)

**Ruta:** `src/modules/patient/booking/steps/SpecialtyStep.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import type { Specialty } from '../../../../types';
import { weekdays } from '../../../../utils/date';

interface Props {
  specialties: Specialty[];
  hospitalId: string;
  specialtyId: string;
  changeSpecialty: (id: string) => void;
}

export function SpecialtyStep({ specialties, hospitalId, specialtyId, changeSpecialty }: Props) {
  return (
    <div className="space-y-3">
      {specialties
        .filter((s) => s.hospitalId === hospitalId)
        .map((s) => (
          <button
            type="button"
            key={s.id}
            aria-pressed={specialtyId === s.id}
            onClick={() => changeSpecialty(s.id)}
            className={`w-full rounded-xl border p-4 text-left ${specialtyId === s.id ? 'border-brand-600 bg-brand-50' : 'border-slate-200 hover:bg-slate-50'}`}
          >
            <span className="block font-semibold">{s.name}</span>
            <span className="mt-1 block text-xs capitalize text-slate-500">
              {s.schedule.days.map((d) => weekdays[d]).join(', ')} · {s.schedule.start}–
              {s.schedule.end}
            </span>
          </button>
        ))}
    </div>
  );
}
```
