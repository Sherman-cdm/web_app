# SpecialtiesBoard.tsx

[Índice general](../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../src/modules/patient/specialties/SpecialtiesBoard.tsx)

**Ruta:** `src/modules/patient/specialties/SpecialtiesBoard.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Hospital, Specialty } from '../../../types';
import { SpecialtyCard } from './SpecialtyCard';

export default function SpecialtiesBoard({
  hospitals,
  specialties,
  onBook,
}: {
  hospitals: Hospital[];
  specialties: Specialty[];
  onBook: (hospitalId: string, specialtyId: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const normalize = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  const filtered = useMemo(
    () =>
      specialties.filter(
        (s) =>
          (!hospitalId || s.hospitalId === hospitalId) &&
          normalize(`${s.name} ${hospitals.find((h) => h.id === s.hospitalId)?.name}`).includes(
            normalize(search),
          ),
      ),
    [search, hospitalId, specialties, hospitals],
  );
  return (
    <section>
      <p className="eyebrow">Nuestros servicios</p>
      <h1 className="mt-2 text-3xl font-bold">Especialidades</h1>
      <p className="mt-2 text-slate-500">Consultá la agenda de atención de cada hospital.</p>
      <div className="my-6 grid gap-3 sm:grid-cols-2">
        <label className="relative">
          <span className="sr-only">Buscar especialidad u hospital</span>
          <Search className="absolute left-3 top-3.5 text-slate-400" size={20} aria-hidden="true" />
          <input
            className="field pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar especialidad u hospital"
          />
        </label>
        <label>
          <span className="sr-only">Filtrar por hospital</span>
          <select
            className="field"
            value={hospitalId}
            onChange={(e) => setHospitalId(e.target.value)}
          >
            <option value="">Todos los hospitales</option>
            {hospitals.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="mb-3 text-sm text-slate-500" aria-live="polite">
        {filtered.length} especialidades encontradas
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((s) => (
          <SpecialtyCard
            key={s.id}
            specialty={s}
            hospital={hospitals.find((h) => h.id === s.hospitalId)}
            onBook={onBook}
          />
        ))}
      </div>
      {!filtered.length && (
        <p className="card text-center text-slate-500">
          No encontramos especialidades con esos filtros.
        </p>
      )}
    </section>
  );
}
```
