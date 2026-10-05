# DashboardPage.tsx

[Índice general](../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../src/modules/hospital/dashboard/DashboardPage.tsx)

**Ruta:** `src/modules/hospital/dashboard/DashboardPage.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { patientActivityDetail, patientName } from '../../../utils/patientName';
import { CalendarDays, CalendarPlus, Clock3, Stethoscope, Users } from 'lucide-react';
import { Empty } from '../../../shared/components/Empty';
import { PageTitle } from '../../../shared/components/PageTitle';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { formatDate, todayISO } from '../../../utils/date';
import { useHospital } from '../context/HospitalContext';

export default function Dashboard() {
  const { state, hospitalId } = useHospital();
  const appointments = state.appointments.filter((a) => a.hospitalId === hospitalId);
  const today = appointments.filter((a) => a.date === todayISO());
  const pending = appointments.filter((a) => a.status === 'pending');
  const professionals = state.professionals.filter((p) => p.hospitalId === hospitalId && p.active);
  const stats = [
    {
      label: 'Turnos para hoy',
      value: today.filter((a) => !['cancelled', 'rejected'].includes(a.status)).length,
      icon: CalendarDays,
      color: 'tone-blue',
      caption: 'Incluye consultas finalizadas',
    },
    {
      label: 'Por aprobar',
      value: pending.length,
      icon: Clock3,
      color: 'tone-amber',
      caption: 'Solicitudes de pacientes',
    },
    {
      label: 'En sala de espera',
      value: today.filter((a) => a.status === 'arrived').length,
      icon: Users,
      color: 'tone-violet',
      caption: 'Llegada registrada hoy',
    },
    {
      label: 'Profesionales activos',
      value: professionals.length,
      icon: Stethoscope,
      color: 'tone-teal',
      caption: 'Equipo de este hospital',
    },
  ];
  return (
    <>
      <PageTitle
        title="El hospital, de un vistazo"
        description={`Organizá la jornada y acompañá cada etapa de la atención. ${formatDate(todayISO())}.`}
        action={
          <a className="btn-primary" href="#hospital/appointments/new">
            <CalendarPlus size={18} />
            Agregar turno
          </a>
        }
      />
      <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <article className={`card accent-card ${s.color}`} key={s.label}>
            <div className="mb-4 flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-500">{s.label}</span>
              <s.icon className="accent-icon shrink-0 rounded-xl p-2" size={38} />
            </div>
            <p className="accent-text text-3xl font-bold">{s.value}</p>
            <p className="mt-2 text-xs text-slate-500">{s.caption}</p>
          </article>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="min-w-0">
          <h2 className="mb-4 text-lg font-bold">Jornada de hoy</h2>
          {today.length ? (
            <div className="card space-y-4">
              {today
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((a) => (
                  <div
                    className="flex flex-wrap items-center gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                    key={a.id}
                  >
                    <span className="rounded-xl bg-slate-50 px-3 py-3 text-sm font-bold">
                      {a.time}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{patientName(a.patient.fullName)}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {state.specialties.find((s) => s.id === a.specialtyId)?.name}
                      </p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                ))}
            </div>
          ) : (
            <Empty text="No hay turnos para hoy. Las nuevas reservas aparecerán aquí." />
          )}
          <div className="medical-hero mt-6 rounded-2xl p-6 text-white shadow-lg shadow-indigo-900/10">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Coordinación de la atención
            </p>
            <h3 className="mt-3 text-xl font-bold">Un equipo conectado, una agenda clara.</h3>
            <p className="mt-3 text-sm leading-6 text-emerald-50/80">
              Desde Agendas en el menú, publicá los horarios de cada profesional para habilitar las
              reservas.
            </p>
          </div>
        </section>
        <section>
          <h2 className="mb-4 text-lg font-bold">Solicitudes por revisar</h2>
          <div className="card accent-card tone-amber">
            {pending.slice(0, 5).map((a) => (
              <div className="mb-4 border-b border-slate-100 pb-4" key={a.id}>
                <p className="text-sm font-bold">{patientName(a.patient.fullName)}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {state.specialties.find((s) => s.id === a.specialtyId)?.name}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {formatDate(a.date)} · {a.time} h
                </p>
              </div>
            ))}
            {!pending.length && (
              <p className="py-6 text-sm text-slate-500">
                Estás al día. No hay solicitudes pendientes.
              </p>
            )}
            {!!pending.length && (
              <p className="text-sm text-slate-600">
                Revisá las solicitudes desde Turnos y recepción en el menú.
              </p>
            )}
          </div>
          <h2 className="mb-4 mt-6 text-lg font-bold">Actividad reciente</h2>
          <div className="card accent-card tone-violet">
            {state.audit
              .filter((a) => a.hospitalId === hospitalId)
              .slice(0, 4)
              .map((a) => (
                <div key={a.id} className="mb-4 last:mb-0">
                  <p className="text-sm font-semibold">{a.action}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {patientActivityDetail(a.action, a.detail)}
                  </p>
                </div>
              ))}
            {!state.audit.some((a) => a.hospitalId === hospitalId) && (
              <p className="text-sm text-slate-500">
                Los cambios realizados por el equipo aparecerán aquí.
              </p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
```
