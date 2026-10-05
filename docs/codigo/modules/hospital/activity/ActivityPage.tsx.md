# ActivityPage.tsx

[Índice general](../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../src/modules/hospital/activity/ActivityPage.tsx)

**Ruta:** `src/modules/hospital/activity/ActivityPage.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { useState } from 'react';
import { Empty } from '../../../shared/components/Empty';
import { PageTitle } from '../../../shared/components/PageTitle';
import { SearchBox } from '../../../shared/components/SearchBox';
import { matches } from '../../../utils/search';
import { patientActivityDetail } from '../../../utils/patientName';
import { useHospital } from '../context/HospitalContext';

export function Activity() {
  const { state, hospitalId } = useHospital();
  const [search, setSearch] = useState('');
  const entries = state.audit.filter(
    (a) => a.hospitalId === hospitalId && matches(`${a.action} ${a.detail} ${a.actor}`, search),
  );
  return (
    <>
      <PageTitle
        title="Registro de actividad"
        description="Historial local de operaciones realizadas en turnos, profesionales, agendas y estudios."
      />
      <div className="mb-6 max-w-lg">
        <SearchBox value={search} onChange={setSearch} placeholder="Buscar en actividad" />
      </div>
      <div className="space-y-3">
        {entries.map((a) => (
          <article className="card flex flex-wrap items-center justify-between gap-3" key={a.id}>
            <div>
              <h2 className="text-sm font-bold">{a.action}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {patientActivityDetail(a.action, a.detail)}
              </p>
              <p className="mt-2 text-xs text-brand-600">{a.actor}</p>
            </div>
            <time className="text-xs text-slate-500" dateTime={a.at}>
              {new Date(a.at).toLocaleString('es-AR', {
                timeZone: 'America/Argentina/Buenos_Aires',
              })}
            </time>
          </article>
        ))}
      </div>
      {!entries.length && <Empty text="Todavía no hay actividad con esos filtros." />}
    </>
  );
}
```
