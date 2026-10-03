import { CalendarPlus, Download } from 'lucide-react';
import { useState } from 'react';
import { Empty } from '../../../shared/components/Empty';
import { Field } from '../../../shared/components/Field';
import { PageTitle } from '../../../shared/components/PageTitle';
import { SearchBox } from '../../../shared/components/SearchBox';
import type { Appointment, AppointmentStatus } from '../../../types';
import { exportCsv } from '../../../utils/csv';
import { matches } from '../../../utils/search';
import { statusLabels } from '../../../utils/status';
import { useHospital } from '../context/HospitalContext';
import { AppointmentCard } from './AppointmentCard';
import { AppointmentForm } from './AppointmentForm';
import { StatusChangeDialog } from './StatusChangeDialog';

export default function AppointmentManager() {
  const { state, hospitalId } = useHospital();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [area, setArea] = useState('');
  const [editing, setEditing] = useState<Appointment | 'new' | null>(() =>
    window.location.hash.endsWith('/new') ? 'new' : null,
  );
  const [transition, setTransition] = useState<{
    appointment: Appointment;
    status: AppointmentStatus;
  } | null>(null);

  const appointments = state.appointments
    .filter(
      (a) =>
        a.hospitalId === hospitalId &&
        (!status || a.status === status) &&
        (!date || a.date === date) &&
        (!area || a.specialtyId === area) &&
        matches(`${a.patient.fullName} ${a.patient.dni} ${a.id}`, search),
    )
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const ask = (appointment: Appointment, next: AppointmentStatus) => {
    setTransition({ appointment, status: next });
  };
  return (
    <>
      <PageTitle
        title="Gestión de turnos"
        description="Revisá solicitudes, coordiná la recepción y seguí cada consulta."
        action={
          <button className="btn-primary" onClick={() => setEditing('new')}>
            <CalendarPlus size={18} />
            Agregar turno
          </button>
        }
      />
      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Buscar paciente, DNI o código"
        />
        <Field label="Estado">
          <select className="field" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Todos los estados</option>
            {Object.entries(statusLabels).map(([id, name]) => (
              <option value={id} key={id}>
                {name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Fecha">
          <input
            type="date"
            className="field"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>
        <Field label="Área">
          <select className="field" value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">Todas las áreas</option>
            {state.specialties
              .filter((s) => s.hospitalId === hospitalId)
              .map((s) => (
                <option value={s.id} key={s.id}>
                  {s.name}
                </option>
              ))}
          </select>
        </Field>
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{appointments.length} turnos encontrados</p>
        <div className="flex gap-2">
          <button
            className="btn-secondary"
            onClick={() => {
              setSearch('');
              setStatus('');
              setDate('');
              setArea('');
            }}
          >
            Limpiar filtros
          </button>
          <button
            className="btn-secondary"
            onClick={() =>
              exportCsv('turnos.csv', [
                ['Fecha', 'Hora', 'Paciente', 'DNI', 'Área', 'Profesional', 'Estado'],
                ...appointments.map((a) => [
                  a.date,
                  a.time,
                  a.patient.fullName,
                  a.patient.dni,
                  state.specialties.find((s) => s.id === a.specialtyId)?.name ?? '',
                  state.professionals.find((p) => p.id === a.professionalId)?.fullName ?? '',
                  statusLabels[a.status],
                ]),
              ])
            }
          >
            <Download size={16} />
            Exportar
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {appointments.map((a) => (
          <AppointmentCard key={a.id} a={a} onEdit={setEditing} ask={ask} />
        ))}
      </div>
      {!appointments.length && (
        <Empty text="No hay turnos con estos filtros. Podés agregar uno desde recepción." />
      )}
      {editing && (
        <AppointmentForm
          appointment={editing === 'new' ? undefined : editing}
          onClose={() => setEditing(null)}
        />
      )}{' '}
      {transition && (
        <StatusChangeDialog transition={transition} onClose={() => setTransition(null)} />
      )}
    </>
  );
}
