# AreasPage.tsx

[Índice general](../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../src/modules/hospital/areas/AreasPage.tsx)

**Ruta:** `src/modules/hospital/areas/AreasPage.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { Layers3, Plus } from 'lucide-react';
import { useState } from 'react';
import { Empty } from '../../../shared/components/Empty';
import { PageTitle } from '../../../shared/components/PageTitle';
import { SearchBox } from '../../../shared/components/SearchBox';
import type { Specialty } from '../../../types';
import { matches } from '../../../utils/search';
import { useHospital } from '../context/HospitalContext';
import { AreaForm } from './AreaForm';

export function Areas() {
  const { state, hospitalId } = useHospital();
  const [editing, setEditing] = useState<Specialty | null>(null);
  const [search, setSearch] = useState('');
  const areas = state.specialties.filter(
    (s) => s.hospitalId === hospitalId && matches(s.name, search),
  );
  return (
    <>
      <PageTitle
        title="Áreas y especialidades"
        description="Organizá los servicios que ofrece tu hospital y el equipo de cada área."
        action={
          <button
            className="btn-primary"
            onClick={() =>
              setEditing({
                id: '',
                hospitalId,
                name: '',
                description: '',
                active: true,
                schedule: { days: [], start: '08:00', end: '13:00', slotMinutes: 30 },
              })
            }
          >
            <Plus size={18} />
            Crear área
          </button>
        }
      />
      <div className="mb-6 max-w-lg">
        <SearchBox value={search} onChange={setSearch} placeholder="Buscar área" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {areas.map((s) => (
          <article className="card" key={s.id}>
            <div className="flex items-center justify-between">
              <Layers3 className="text-brand-600" size={25} />
              <span
                className={`badge ${s.active !== false ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-500'}`}
              >
                {s.active !== false ? 'Visible al paciente' : 'Inactiva'}
              </span>
            </div>
            <h2 className="mt-4 text-xl font-bold">{s.name}</h2>
            <p className="mt-2 text-sm text-slate-500">{s.description}</p>
            <p className="mt-5 text-sm text-slate-600">
              {state.professionals.filter((p) => p.active && p.specialtyIds.includes(s.id)).length}{' '}
              profesionales activos ·{' '}
              {state.agendas.filter((a) => a.active && a.specialtyId === s.id).length} agendas
            </p>
            <button className="btn-secondary mt-4" onClick={() => setEditing(s)}>
              Editar área
            </button>
          </article>
        ))}
      </div>
      {!areas.length && <Empty text="No hay áreas con ese nombre." />}
      {editing && <AreaForm value={editing} onClose={() => setEditing(null)} />}
    </>
  );
}
```
