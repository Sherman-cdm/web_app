# AreaForm.tsx

[Índice general](../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../src/modules/hospital/areas/AreaForm.tsx)

**Ruta:** `src/modules/hospital/areas/AreaForm.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { useState } from 'react';
import { hospitalApi } from '../../../services/hospitalApi';
import { AsyncForm } from '../../../shared/components/AsyncForm';
import { Field } from '../../../shared/components/Field';
import { Modal } from '../../../shared/components/Modal';
import type { Specialty } from '../../../types';

export function AreaForm({ value, onClose }: { value: Specialty; onClose: () => void }) {
  const [editing, setEditing] = useState(value);
  return (
    <Modal title={editing.id ? 'Editar área' : 'Crear área'} onClose={onClose}>
      <AsyncForm save={() => hospitalApi.saveSpecialty(editing)} onClose={onClose}>
        <Field label="Nombre del área">
          <input
            required
            minLength={3}
            className="field"
            value={editing.name}
            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
          />
        </Field>
        <Field label="Descripción para pacientes">
          <textarea
            required
            minLength={3}
            className="field min-h-24"
            value={editing.description}
            onChange={(e) => setEditing({ ...editing, description: e.target.value })}
          />
        </Field>
        <label className="flex min-h-11 items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={editing.active !== false}
            onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
          />
          Área activa
        </label>
        <p className="text-xs text-slate-500">
          La disponibilidad se define en las agendas de sus profesionales.
        </p>
      </AsyncForm>
    </Modal>
  );
}
```
