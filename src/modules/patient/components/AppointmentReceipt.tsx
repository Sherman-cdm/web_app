import { patientName } from '../../../utils/patientName';
import { CheckCircle2, Printer } from 'lucide-react';
import type { Appointment, Hospital, Specialty } from '../../../types';
import { formatDate } from '../../../utils/date';

export default function AppointmentReceipt({
  appointment,
  hospital,
  specialty,
  onDone,
}: {
  appointment: Appointment;
  hospital?: Hospital;
  specialty?: Specialty;
  onDone: () => void;
}) {
  return (
    <section className="card mx-auto max-w-xl">
      <div className="mb-6 text-center">
        <CheckCircle2 className="mx-auto mb-3 text-brand-600" size={48} aria-hidden="true" />
        <p className="eyebrow">
          {appointment.status === 'pending' ? 'Solicitud recibida' : 'Reserva confirmada'}
        </p>
        <h2 className="mt-2 text-2xl font-bold">
          {appointment.status === 'pending'
            ? 'Tu solicitud está en revisión'
            : '¡Tu turno está listo!'}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {appointment.status === 'pending'
            ? 'El hospital debe aprobar tu turno. Consultá su estado en Mis Turnos.'
            : 'Guardamos el comprobante en Mis Turnos.'}
        </p>
      </div>
      <dl className="space-y-4 rounded-xl bg-slate-50 p-5">
        {[
          ['Paciente', patientName(appointment.patient.fullName)],
          ['DNI', appointment.patient.dni],
          ['Hospital', hospital?.name ?? appointment.hospitalId],
          ['Especialidad', specialty?.name ?? appointment.specialtyId],
          ['Fecha', formatDate(appointment.date)],
          ['Horario', `${appointment.time} h`],
          ['Código de reserva', appointment.id],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-slate-500">{label}</dt>
            <dd className="break-words text-sm font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-sm text-slate-500">
        Comprobante de demostración. No representa un turno real. Para probar el flujo, usá datos
        ficticios.
      </p>
      <div className="no-print mt-6 flex flex-wrap gap-3">
        <button type="button" className="btn-primary flex-1" onClick={onDone}>
          Ver Mis Turnos
        </button>
        <button type="button" className="btn-secondary" onClick={() => window.print()}>
          <Printer size={18} aria-hidden="true" />
          Imprimir
        </button>
      </div>
    </section>
  );
}
