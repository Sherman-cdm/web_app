# HospitalStep.tsx

[Índice general](../../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../../src/modules/patient/booking/steps/HospitalStep.tsx)

**Ruta:** `src/modules/patient/booking/steps/HospitalStep.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { Building2, Check } from 'lucide-react';
import type { Hospital } from '../../../../types';

interface Props {
  hospitals: Hospital[];
  hospitalId: string;
  changeHospital: (id: string) => void;
}

export function HospitalStep({ hospitals, hospitalId, changeHospital }: Props) {
  return (
    <div className="space-y-3">
      {hospitals.map((h) => (
        <button
          type="button"
          key={h.id}
          aria-pressed={hospitalId === h.id}
          onClick={() => changeHospital(h.id)}
          className={`flex min-h-20 w-full items-center gap-4 rounded-xl border p-4 text-left ${hospitalId === h.id ? 'border-brand-600 bg-brand-50' : 'border-slate-200 hover:bg-slate-50'}`}
        >
          <Building2 className="shrink-0 text-brand-600" aria-hidden="true" />
          <span>
            <span className="block text-sm font-semibold">{h.name}</span>
            <span className="text-xs text-slate-500">{h.area}</span>
          </span>
          {hospitalId === h.id && (
            <Check className="ml-auto shrink-0 text-brand-600" size={18} aria-hidden="true" />
          )}
        </button>
      ))}
    </div>
  );
}
```
