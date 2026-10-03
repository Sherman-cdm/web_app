import { FilePlus2 } from 'lucide-react';
import { useState } from 'react';
import { Empty } from '../../../shared/components/Empty';
import { PageTitle } from '../../../shared/components/PageTitle';
import { SearchBox } from '../../../shared/components/SearchBox';
import type { MedicalStudy } from '../../../types';
import { formatDate, todayISO } from '../../../utils/date';
import { matches } from '../../../utils/search';
import { useHospital } from '../context/HospitalContext';
import { StudyForm } from './StudyForm';

export function Studies() {
  const { state, hospitalId } = useHospital();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [editing, setEditing] = useState<MedicalStudy | null>(null);
  const studies = state.studies.filter(
    (s) =>
      s.hospitalId === hospitalId &&
      (!status || s.status === status) &&
      matches(`${s.name} ${s.dni}`, search),
  );
  return (
    <>
      <PageTitle
        title="Estudios y resultados"
        description="Registrá estudios y publicá informes de ejemplo para que el paciente pueda consultarlos."
        action={
          <button
            className="btn-primary"
            onClick={() =>
              setEditing({
                id: '',
                hospitalId,
                dni: '',
                name: '',
                date: todayISO(),
                status: 'pending',
                result: '',
              })
            }
          >
            <FilePlus2 size={18} />
            Agregar estudio
          </button>
        }
      />
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <SearchBox value={search} onChange={setSearch} placeholder="Buscar estudio o DNI" />
        <select
          aria-label="Filtrar estado de estudio"
          className="field"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="available">Publicados</option>
        </select>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {studies.map((s) => (
          <article className="card" key={s.id}>
            <span
              className={`badge ${s.status === 'available' ? 'bg-brand-50 text-brand-700' : 'bg-amber-50 text-amber-800'}`}
            >
              {s.status === 'available' ? 'Resultado publicado' : 'Pendiente de informe'}
            </span>
            <h2 className="mt-4 text-lg font-bold">{s.name}</h2>
            <p className="mt-1 text-sm text-slate-500">
              DNI {s.dni} · {formatDate(s.date)}
            </p>
            <p className="mt-4 line-clamp-2 text-sm text-slate-500">
              {s.result || 'Todavía no se cargó un informe.'}
            </p>
            <button className="btn-secondary mt-5" onClick={() => setEditing(s)}>
              {s.status === 'pending' ? 'Cargar resultado' : 'Editar estudio'}
            </button>
          </article>
        ))}
      </div>
      {!studies.length && <Empty text="No hay estudios con estos filtros." />}
      {editing && <StudyForm value={editing} onClose={() => setEditing(null)} />}
    </>
  );
}
