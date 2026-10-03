import { useState } from 'react';
import { hospitalApi } from '../../../services/hospitalApi';
import { AsyncForm } from '../../../shared/components/AsyncForm';
import { Field } from '../../../shared/components/Field';
import { Modal } from '../../../shared/components/Modal';
import type { AgendaBlock } from '../../../types';
import { useHospital } from '../context/HospitalContext';

export function BlockForm({
  value,
  onClose,
}: {
  value: Omit<AgendaBlock, 'id'>;
  onClose: () => void;
}) {
  const { state, hospitalId } = useHospital();
  const [block, setBlock] = useState(value);
  return (
    <Modal title="Bloquear fechas de atención" onClose={onClose}>
      <AsyncForm save={() => hospitalApi.addBlock(block)} onClose={onClose} submit="Crear bloqueo">
        <Field label="Alcance">
          <select
            className="field"
            value={block.professionalId}
            onChange={(e) => setBlock({ ...block, professionalId: e.target.value })}
          >
            <option value="">Todo el hospital</option>
            {state.professionals
              .filter((p) => p.hospitalId === hospitalId)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName}
                </option>
              ))}
          </select>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Desde">
            <input
              required
              type="date"
              className="field"
              value={block.from}
              onChange={(e) => setBlock({ ...block, from: e.target.value })}
            />
          </Field>
          <Field label="Hasta">
            <input
              required
              type="date"
              min={block.from}
              className="field"
              value={block.to}
              onChange={(e) => setBlock({ ...block, to: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Motivo">
          <textarea
            required
            minLength={3}
            className="field"
            value={block.reason}
            onChange={(e) => setBlock({ ...block, reason: e.target.value })}
          />
        </Field>
        <p className="text-xs text-slate-500">
          El bloqueo abarca días completos. Si hay turnos abiertos, primero deberás reprogramarlos o
          cancelarlos.
        </p>
      </AsyncForm>
    </Modal>
  );
}
