import { useState } from 'react';
import { hospitalApi } from '../../../services/hospitalApi';
import { AsyncForm } from '../../../shared/components/AsyncForm';
import { Field } from '../../../shared/components/Field';
import { Modal } from '../../../shared/components/Modal';
import type { MedicalStudy } from '../../../types';
import { todayISO } from '../../../utils/date';

export function StudyForm({ value, onClose }: { value: MedicalStudy; onClose: () => void }) {
  const [editing, setEditing] = useState(value);
  return (
    <Modal title={editing.id ? 'Editar estudio e informe' : 'Registrar estudio'} onClose={onClose}>
      <AsyncForm save={() => hospitalApi.saveStudy(editing)} onClose={onClose}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="DNI del paciente">
            <input
              required
              pattern="[0-9]{7,8}"
              maxLength={8}
              className="field"
              value={editing.dni}
              onChange={(e) => setEditing({ ...editing, dni: e.target.value })}
            />
          </Field>
          <Field label="Fecha del estudio">
            <input
              required
              type="date"
              max={todayISO()}
              className="field"
              value={editing.date}
              onChange={(e) => setEditing({ ...editing, date: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Nombre del estudio">
          <input
            required
            minLength={3}
            className="field"
            value={editing.name}
            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
          />
        </Field>
        <Field label="Informe de ejemplo">
          <textarea
            className="field min-h-40"
            value={editing.result ?? ''}
            onChange={(e) => setEditing({ ...editing, result: e.target.value })}
            placeholder="Contenido ficticio del informe…"
          />
        </Field>
        <Field label="Publicación">
          <select
            className="field"
            value={editing.status}
            onChange={(e) =>
              setEditing({ ...editing, status: e.target.value as MedicalStudy['status'] })
            }
          >
            <option value="pending">Pendiente (resultado oculto al paciente)</option>
            <option value="available">Publicado (resultado disponible para el paciente)</option>
          </select>
        </Field>
      </AsyncForm>
    </Modal>
  );
}
