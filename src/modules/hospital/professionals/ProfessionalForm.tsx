import { useState } from 'react';
import { hospitalApi } from '../../../services/hospitalApi';
import { AsyncForm } from '../../../shared/components/AsyncForm';
import { Field } from '../../../shared/components/Field';
import { Modal } from '../../../shared/components/Modal';
import type { Professional } from '../../../types';
import { useHospital } from '../context/HospitalContext';

export function ProfessionalForm({ value, onClose }: { value: Professional; onClose: () => void }) {
  const { state, hospitalId } = useHospital();
  const [draft, setDraft] = useState(value);
  return (
    <Modal title={draft.id ? 'Editar profesional' : 'Incorporar profesional'} onClose={onClose}>
      <AsyncForm onClose={onClose} save={() => hospitalApi.saveProfessional(draft)}>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              { key: 'fullName', label: 'Nombre y apellido', type: 'text' },
              { key: 'license', label: 'Matrícula', type: 'text' },
              { key: 'email', label: 'Correo electrónico', type: 'email' },
              { key: 'phone', label: 'Teléfono', type: 'tel' },
            ] as const
          ).map((f) => (
            <Field label={f.label} key={f.key}>
              <input
                required
                className="field"
                type={f.type}
                value={draft[f.key]}
                onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
              />
            </Field>
          ))}
        </div>
        <fieldset>
          <legend className="mb-3 text-sm font-semibold">Áreas asignadas</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {state.specialties
              .filter((s) => s.hospitalId === hospitalId && s.active !== false)
              .map((s) => (
                <label
                  key={s.id}
                  className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={draft.specialtyIds.includes(s.id)}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        specialtyIds: e.target.checked
                          ? [...draft.specialtyIds, s.id]
                          : draft.specialtyIds.filter((id) => id !== s.id),
                      })
                    }
                  />
                  {s.name}
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
          Profesional activo para recibir turnos
        </label>
        <p className="text-xs text-slate-500">
          Después de incorporarlo, publicá sus días y horarios en Agendas.
        </p>
      </AsyncForm>
    </Modal>
  );
}
