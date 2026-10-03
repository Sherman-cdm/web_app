# AgendasPage.tsx

[Índice general](../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../src/modules/hospital/agendas/AgendasPage.tsx)

**Ruta:** `src/modules/hospital/agendas/AgendasPage.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { Ban, CalendarPlus } from 'lucide-react';
import { useState } from 'react';
import { hospitalApi } from '../../../services/hospitalApi';
import { AsyncForm } from '../../../shared/components/AsyncForm';
import { Empty } from '../../../shared/components/Empty';
import { Field } from '../../../shared/components/Field';
import { Modal } from '../../../shared/components/Modal';
import { PageTitle } from '../../../shared/components/PageTitle';
import type { Agenda, AgendaBlock } from '../../../types';
import { formatDate, parseDate, todayISO, toISO, weekdays } from '../../../utils/date';
import { useHospital } from '../context/HospitalContext';
import { AgendaCard } from './AgendaCard';
import { AgendaForm } from './AgendaForm';
import { BlockForm } from './BlockForm';

export default function AgendaManager() {
  const { state, hospitalId } = useHospital();
  const [editing, setEditing] = useState<Agenda | null>(null);
  const [filter, setFilter] = useState('');
  const [weekly, setWeekly] = useState(false);
  const [block, setBlock] = useState<Omit<AgendaBlock, 'id'> | null>(null);
  const [removing, setRemoving] = useState<AgendaBlock | null>(null);
  const agendas = state.agendas.filter(
    (a) => a.hospitalId === hospitalId && (!filter || a.professionalId === filter),
  );
  const newAgenda = () => {
    const until = parseDate(todayISO());
    until.setMonth(until.getMonth() + 3);
    setEditing({
      id: '',
      hospitalId,
      specialtyId: '',
      professionalId: '',
      room: '',
      days: [1, 2, 3, 4, 5],
      start: '08:00',
      end: '12:00',
      slotMinutes: 30,
      validFrom: todayISO(),
      validTo: toISO(until),
      active: true,
    });
  };

  return (
    <>
      <PageTitle
        title="Agendas y disponibilidad"
        description="Definí jornadas, duración de consultas y consultorios. Los cupos se publican en el portal del paciente."
        action={
          <button className="btn-primary" onClick={newAgenda}>
            <CalendarPlus size={18} />
            Nueva agenda
          </button>
        }
      />
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <Field label="Profesional">
          <select className="field" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Todos los profesionales</option>
            {state.professionals
              .filter((p) => p.hospitalId === hospitalId)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName}
                </option>
              ))}
          </select>
        </Field>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => setWeekly(!weekly)}>
            {weekly ? 'Ver listado' : 'Ver semana tipo'}
          </button>
          <button
            className="btn-secondary"
            onClick={() =>
              setBlock({
                hospitalId,
                professionalId: '',
                from: todayISO(),
                to: todayISO(),
                reason: '',
              })
            }
          >
            <Ban size={16} />
            Bloquear fechas
          </button>
        </div>
      </div>
      {weekly ? (
        <>
          <p className="mb-4 text-xs text-slate-500">
            Semana tipo de agendas publicadas. La vigencia y los bloqueos se aplican al consultar
            cada fecha.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 0].map((d) => (
              <section className="rounded-2xl bg-slate-100 p-3" key={d}>
                <h2 className="mb-3 font-bold capitalize">{weekdays[d]}</h2>
                {agendas
                  .filter((a) => a.active && a.days.includes(d))
                  .map((a) => (
                    <button
                      key={a.id}
                      className="mb-2 block w-full rounded-xl border border-brand-100 bg-white p-3 text-left"
                      onClick={() => setEditing(a)}
                    >
                      <span className="block text-sm font-bold text-brand-700">
                        {a.start}–{a.end}
                      </span>
                      <span className="mt-1 block text-xs">
                        {state.professionals.find((p) => p.id === a.professionalId)?.fullName}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">{a.room}</span>
                    </button>
                  ))}
                {!agendas.some((a) => a.active && a.days.includes(d)) && (
                  <p className="py-3 text-xs text-slate-400">Sin agenda publicada</p>
                )}
              </section>
            ))}
          </div>
        </>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {agendas.map((a) => (
            <AgendaCard key={a.id} a={a} onEdit={setEditing} />
          ))}
        </div>
      )}
      {!agendas.length && <Empty text="No hay agendas. Publicá una para habilitar turnos." />}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-bold">Bloqueos y ausencias</h2>
        {state.blocks
          .filter((b) => b.hospitalId === hospitalId)
          .map((b) => (
            <div className="card mb-3 flex flex-wrap items-center justify-between gap-4" key={b.id}>
              <div>
                <p className="font-semibold">
                  {b.professionalId
                    ? state.professionals.find((p) => p.id === b.professionalId)?.fullName
                    : 'Todo el hospital'}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {formatDate(b.from)} — {formatDate(b.to)}
                </p>
                <p className="mt-1 text-sm">{b.reason}</p>
              </div>
              <button className="btn-secondary" onClick={() => setRemoving(b)}>
                Retirar bloqueo
              </button>
            </div>
          ))}
        {!state.blocks.some((b) => b.hospitalId === hospitalId) && (
          <p className="text-sm text-slate-500">No hay bloqueos registrados.</p>
        )}
      </section>
      {editing && <AgendaForm value={editing} onClose={() => setEditing(null)} />}{' '}
      {block && <BlockForm value={block} onClose={() => setBlock(null)} />}
      {removing && (
        <Modal title="Retirar bloqueo" onClose={() => setRemoving(null)}>
          <AsyncForm
            save={() => hospitalApi.removeBlock(hospitalId, removing.id)}
            onClose={() => setRemoving(null)}
            submit="Retirar bloqueo"
          >
            <p className="text-sm">
              Se volverán a ofrecer los horarios de las agendas vigentes durante este período.
            </p>
          </AsyncForm>
        </Modal>
      )}
    </>
  );
}
```
