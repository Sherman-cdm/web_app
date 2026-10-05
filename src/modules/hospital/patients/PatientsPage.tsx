import { patientName } from '../../../utils/patientName';
import { useState } from 'react';
import { Empty } from '../../../shared/components/Empty';
import { Modal } from '../../../shared/components/Modal';
import { PageTitle } from '../../../shared/components/PageTitle';
import { SearchBox } from '../../../shared/components/SearchBox';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { formatDate } from '../../../utils/date';
import { matches } from '../../../utils/search';
import { useHospital } from '../context/HospitalContext';

export function Patients() {
  const { state, hospitalId } = useHospital();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('');
  const appointments = state.appointments.filter((a) => a.hospitalId === hospitalId);
  const dnis = [
    ...new Set([
      ...appointments.map((a) => a.patient.dni),
      ...state.studies.filter((s) => s.hospitalId === hospitalId).map((s) => s.dni),
    ]),
  ];
  const getPatient = (dni: string) =>
    [...appointments]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .find((a) => a.patient.dni === dni)?.patient;
  const filtered = dnis.filter((dni) =>
    matches(`${dni} ${getPatient(dni)?.fullName ?? ''}`, search),
  );
  return (
    <>
      <PageTitle
        title="Pacientes"
        description="Directorio de pacientes con turnos o estudios en el hospital. Consultá sus datos y el historial administrativo."
      />
      <div className="mb-6 max-w-lg">
        <SearchBox value={search} onChange={setSearch} placeholder="Buscar por nombre o DNI" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {filtered.map((dni) => {
          const patient = getPatient(dni);
          return (
            <article className="card" key={dni}>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-700">
                  {patient?.fullName.slice(0, 1).toLocaleUpperCase('es-AR') ?? 'P'}
                </div>
                <div>
                  <h2 className="font-bold">
                    {(patient ? patientName(patient.fullName) : undefined) ??
                      'Paciente con estudios'}
                  </h2>
                  <p className="text-sm text-slate-500">DNI {dni}</p>
                </div>
              </div>
              <p className="mt-4 break-all text-sm text-slate-500">
                {patient?.email ?? 'Sin contacto registrado'}
              </p>
              <p className="mt-1 text-sm text-slate-500">{patient?.phone}</p>
              <div className="mt-5 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500">
                  {appointments.filter((a) => a.patient.dni === dni).length} turnos ·{' '}
                  {state.studies.filter((s) => s.hospitalId === hospitalId && s.dni === dni).length}{' '}
                  estudios
                </span>
                <button className="btn-secondary" onClick={() => setSelected(dni)}>
                  Ver ficha
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {!filtered.length && (
        <Empty text="No hay pacientes con esos datos. Se incorporan al registrar turnos o estudios." />
      )}
      {selected && (
        <Modal
          title={
            (getPatient(selected) ? patientName(getPatient(selected)!.fullName) : undefined) ??
            `Paciente · DNI ${selected}`
          }
          onClose={() => setSelected('')}
        >
          <p className="mb-5 text-sm text-slate-500">DNI {selected} · Historial de este hospital</p>
          <h3 className="mb-3 font-bold">Turnos</h3>
          {appointments
            .filter((a) => a.patient.dni === selected)
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((a) => (
              <div
                key={a.id}
                className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 p-3"
              >
                <div>
                  <p className="text-sm font-semibold">
                    {state.specialties.find((s) => s.id === a.specialtyId)?.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDate(a.date)} · {a.time} h
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          <h3 className="mb-3 mt-6 font-bold">Estudios</h3>
          {state.studies
            .filter((s) => s.hospitalId === hospitalId && s.dni === selected)
            .map((s) => (
              <div className="mb-2 rounded-xl bg-slate-50 p-3" key={s.id}>
                <p className="text-sm font-semibold">{s.name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {formatDate(s.date)} · {s.status === 'available' ? 'Publicado' : 'Pendiente'}
                </p>
              </div>
            ))}
        </Modal>
      )}
    </>
  );
}
