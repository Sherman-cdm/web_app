# PatientDataStep.tsx

[Índice general](../../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../../src/modules/patient/booking/steps/PatientDataStep.tsx)

**Ruta:** `src/modules/patient/booking/steps/PatientDataStep.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { type FormEvent } from 'react';
import type { Hospital, Patient, Specialty } from '../../../../types';
import { formatDate } from '../../../../utils/date';

interface Props {
  submit: (event: FormEvent) => void;
  specialty?: Specialty;
  hospital?: Hospital;
  date: string;
  time: string;
  patient: Patient;
  setPatient: (patient: Patient) => void;
}

export function PatientDataStep({
  submit,
  specialty,
  hospital,
  date,
  time,
  patient,
  setPatient,
}: Props) {
  return (
    <form id="patient-form" onSubmit={submit}>
      <div className="mb-5 rounded-xl bg-brand-50 p-4 text-sm text-brand-900">
        <p className="font-semibold">
          {specialty?.name} · {hospital?.shortName}
        </p>
        <p className="mt-1">
          {formatDate(date)} · {time} h
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            key: 'dni' as const,
            label: 'DNI (sin puntos)',
            type: 'text',
            placeholder: '30123456',
            auto: 'off',
          },
          {
            key: 'fullName' as const,
            label: 'Nombre y apellido',
            type: 'text',
            placeholder: 'María Pérez',
            auto: 'name',
          },
          {
            key: 'email' as const,
            label: 'Correo electrónico',
            type: 'email',
            placeholder: 'maria@ejemplo.com',
            auto: 'email',
          },
          {
            key: 'phone' as const,
            label: 'Teléfono',
            type: 'tel',
            placeholder: '11 5555 1234',
            auto: 'tel',
          },
        ].map((field) => (
          <label key={field.key} className="text-sm font-medium">
            {field.label}
            <input
              required
              readOnly={field.key === 'dni'}
              className="field mt-2"
              type={field.type}
              inputMode={field.key === 'dni' ? 'numeric' : undefined}
              pattern={
                field.key === 'dni'
                  ? '[0-9]{7,8}'
                  : field.key === 'phone'
                    ? '[+0-9 ()\-]{8,20}'
                    : undefined
              }
              minLength={field.key === 'fullName' ? 3 : undefined}
              maxLength={field.key === 'dni' ? 8 : 120}
              autoComplete={field.auto}
              placeholder={field.placeholder}
              value={patient[field.key]}
              onChange={(e) => setPatient({ ...patient, [field.key]: e.target.value })}
            />
          </label>
        ))}
      </div>
      <p className="mt-5 text-xs leading-5 text-slate-500">
        Todos los campos son obligatorios. Usá datos ficticios: esta reserva se guarda solo en este
        navegador.
      </p>
    </form>
  );
}
```
