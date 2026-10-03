# ProfessionalsPage.tsx

[Índice general](../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../src/modules/hospital/professionals/ProfessionalsPage.tsx)

**Ruta:** `src/modules/hospital/professionals/ProfessionalsPage.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { Pencil, Plus, Stethoscope } from 'lucide-react';
import { useState } from 'react';
import { Empty } from '../../../shared/components/Empty';
import { PageTitle } from '../../../shared/components/PageTitle';
import { SearchBox } from '../../../shared/components/SearchBox';
import type { Professional } from '../../../types';
import { matches } from '../../../utils/search';
import { useHospital } from '../context/HospitalContext';
import { ProfessionalForm } from './ProfessionalForm';

export function Professionals() {
  const { state, hospitalId } = useHospital();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Professional | null>(null);
  const professionals = state.professionals.filter(
    (p) =>
      p.hospitalId === hospitalId &&
      matches(
        `${p.fullName} ${p.license} ${p.specialtyIds.map((id) => state.specialties.find((s) => s.id === id)?.name).join(' ')}`,
        search,
      ),
  );
  return (
    <>
      <PageTitle
        title="Equipo profesional"
        description="Administrá matrículas, datos de contacto y asignaciones a las áreas del hospital."
        action={
          <button
            className="btn-primary"
            onClick={() =>
              setEditing({
                id: '',
                hospitalId,
                fullName: '',
                license: '',
                email: '',
                phone: '',
                specialtyIds: [],
                active: true,
              })
            }
          >
            <Plus size={18} />
            Agregar profesional
          </button>
        }
      />
      <div className="mb-6 max-w-lg">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Buscar nombre, matrícula o área"
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {professionals.map((p) => (
          <article className="card" key={p.id}>
            <div className="flex items-start gap-4">
              <span className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                <Stethoscope size={24} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold">{p.fullName}</h2>
                <p className="mt-1 text-sm text-slate-500">Matrícula {p.license}</p>
              </div>
              <span
                className={`badge ${p.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
              >
                {p.active ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div className="my-5 flex flex-wrap gap-2">
              {p.specialtyIds.map((id) => (
                <span className="badge bg-slate-100 text-slate-600" key={id}>
                  {state.specialties.find((s) => s.id === id)?.name}
                </span>
              ))}
            </div>
            <p className="break-all text-sm text-slate-500">{p.email}</p>
            <p className="mt-1 text-sm text-slate-500">{p.phone}</p>
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-500">
                {state.agendas.filter((a) => a.professionalId === p.id && a.active).length} agendas
                publicadas
              </p>
              <button className="btn-secondary" onClick={() => setEditing(p)}>
                <Pencil size={15} />
                Editar
              </button>
            </div>
          </article>
        ))}
      </div>
      {!professionals.length && <Empty text="No se encontraron profesionales." />}
      {editing && <ProfessionalForm value={editing} onClose={() => setEditing(null)} />}
    </>
  );
}
```
