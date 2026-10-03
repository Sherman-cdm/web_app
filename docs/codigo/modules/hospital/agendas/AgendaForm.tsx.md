# AgendaForm.tsx

[Índice general](../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../src/modules/hospital/agendas/AgendaForm.tsx)

**Ruta:** `src/modules/hospital/agendas/AgendaForm.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { useState } from 'react';
import { hospitalApi } from '../../../services/hospitalApi';
import { AsyncForm } from '../../../shared/components/AsyncForm';
import { Field } from '../../../shared/components/Field';
import { Modal } from '../../../shared/components/Modal';
import type { Agenda } from '../../../types';
import { weekdays } from '../../../utils/date';
import { useHospital } from '../context/HospitalContext';

export function AgendaForm({ value, onClose }: { value: Agenda; onClose: () => void }) {
  const { state, hospitalId } = useHospital();
  const [draft, setDraft] = useState(value);
  const pros = state.professionals.filter(
    (p) => p.hospitalId === hospitalId && p.active && p.specialtyIds.includes(draft.specialtyId),
  );
  return (
    <Modal title={draft.id ? 'Editar agenda' : 'Publicar agenda'} onClose={onClose}>
      <AsyncForm
        save={() => hospitalApi.saveAgenda(draft)}
        onClose={onClose}
        submit="Guardar agenda"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Área">
            <select
              className="field"
              required
              value={draft.specialtyId}
              onChange={(e) =>
                setDraft({ ...draft, specialtyId: e.target.value, professionalId: '' })
              }
            >
              <option value="">Seleccionar área</option>
              {state.specialties
                .filter((s) => s.hospitalId === hospitalId && s.active !== false)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </Field>
          <Field label="Profesional">
            <select
              className="field"
              required
              value={draft.professionalId}
              onChange={(e) => setDraft({ ...draft, professionalId: e.target.value })}
            >
              <option value="">Seleccionar profesional</option>
              {pros.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Consultorio">
            <input
              required
              className="field"
              placeholder="Ej.: Consultorio 4"
              value={draft.room}
              onChange={(e) => setDraft({ ...draft, room: e.target.value })}
            />
          </Field>
          <Field label="Duración del turno (minutos)">
            <input
              required
              type="number"
              min={10}
              max={120}
              className="field"
              value={draft.slotMinutes}
              onChange={(e) => setDraft({ ...draft, slotMinutes: Number(e.target.value) })}
            />
          </Field>
          <Field label="Hora de inicio">
            <input
              required
              type="time"
              className="field"
              value={draft.start}
              onChange={(e) => setDraft({ ...draft, start: e.target.value })}
            />
          </Field>
          <Field label="Hora de finalización">
            <input
              required
              type="time"
              className="field"
              value={draft.end}
              onChange={(e) => setDraft({ ...draft, end: e.target.value })}
            />
          </Field>
          <Field label="Vigente desde">
            <input
              required
              type="date"
              className="field"
              value={draft.validFrom}
              onChange={(e) => setDraft({ ...draft, validFrom: e.target.value })}
            />
          </Field>
          <Field label="Vigente hasta">
            <input
              required
              type="date"
              min={draft.validFrom}
              className="field"
              value={draft.validTo}
              onChange={(e) => setDraft({ ...draft, validTo: e.target.value })}
            />
          </Field>
        </div>
        <fieldset>
          <legend className="mb-3 text-sm font-semibold">Días de atención</legend>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 0].map((d) => (
              <label
                key={d}
                className={`flex min-h-11 items-center gap-2 rounded-xl border px-3 text-sm capitalize ${draft.days.includes(d) ? 'border-brand-600 bg-brand-50' : 'border-slate-200'}`}
              >
                <input
                  type="checkbox"
                  checked={draft.days.includes(d)}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      days: e.target.checked
                        ? [...draft.days, d]
                        : draft.days.filter((day) => day !== d),
                    })
                  }
                />
                {weekdays[d].slice(0, 3)}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="flex min-h-11 items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={draft.active}
            onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
          />
          Agenda publicada y habilitada para reservas
        </label>
        <p className="text-xs text-slate-500">
          No se permiten superposiciones del profesional o del consultorio. Los turnos abiertos
          deben reprogramarse antes de retirar su horario.
        </p>
      </AsyncForm>
    </Modal>
  );
}
```
