# StatusChangeDialog.tsx

[Índice general](../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../src/modules/hospital/appointments/StatusChangeDialog.tsx)

**Ruta:** `src/modules/hospital/appointments/StatusChangeDialog.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { patientName } from '../../../utils/patientName';
import { useState } from 'react';
import { hospitalApi } from '../../../services/hospitalApi';
import { AsyncForm } from '../../../shared/components/AsyncForm';
import { Field } from '../../../shared/components/Field';
import { Modal } from '../../../shared/components/Modal';
import type { Appointment, AppointmentStatus } from '../../../types';
import { formatDate } from '../../../utils/date';
import { statusLabels } from '../../../utils/status';
import { useHospital } from '../context/HospitalContext';

export function StatusChangeDialog({
  transition,
  onClose,
}: {
  transition: { appointment: Appointment; status: AppointmentStatus };
  onClose: () => void;
}) {
  const { hospitalId } = useHospital();
  const [reason, setReason] = useState('');
  return (
    <Modal
      title={`Cambiar estado a ${statusLabels[transition.status].toLowerCase()}`}
      onClose={onClose}
    >
      <AsyncForm
        save={() =>
          hospitalApi.setStatus(hospitalId, transition.appointment.id, transition.status, reason)
        }
        onClose={onClose}
        submit="Confirmar cambio"
      >
        <p className="text-sm">
          {patientName(transition.appointment.patient.fullName)} ·{' '}
          {formatDate(transition.appointment.date)} · {transition.appointment.time} h
        </p>
        {['cancelled', 'rejected'].includes(transition.status) && (
          <Field label="Motivo (visible para el paciente)">
            <textarea
              required
              minLength={3}
              className="field min-h-24"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Field>
        )}
      </AsyncForm>
    </Modal>
  );
}
```
