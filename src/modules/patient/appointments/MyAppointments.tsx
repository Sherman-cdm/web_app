import { CalendarDays, Clock3, Plus, Printer } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import { Loading } from '../../../shared/components/Loading';
import { errorText } from '../../../shared/errors/errorText';
import type { Appointment, Hospital, Specialty } from '../../../types';
import { formatDate } from '../../../utils/date';
import { statusLabels } from '../../../utils/status';
import { useAuth } from '../../auth/AuthContext';

export default function MyAppointments({
  hospitals,
  specialties,
  onBook,
}: {
  hospitals: Hospital[];
  specialties: Specialty[];
  onBook: () => void;
}) {
  const { session } = useAuth();
  const dni = session?.user.patient?.dni ?? '';
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pending, setPending] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [notice, setNotice] = useState('');
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setAppointments(
        (await api.getAppointments()).filter((appointment) => appointment.patient.dni === dni),
      );
    } catch (err) {
      setError(errorText(err));
    } finally {
      setLoading(false);
    }
  }, [dni]);
  useEffect(() => {
    void load();
    const refresh = () => {
      void load();
    };
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, [load]);
  async function cancel() {
    if (!pending || cancelling) return;
    setCancelling(true);
    setError('');
    try {
      const updated = await api.cancelAppointment(pending);
      setAppointments((items) => items.map((a) => (a.id === updated.id ? updated : a)));
      setPending(null);
      setNotice('El turno se canceló y su horario volvió a quedar disponible.');
    } catch (err) {
      setError(errorText(err));
    } finally {
      setCancelling(false);
    }
  }
  const filtered = appointments.filter((a) => !dni || a.patient.dni === dni);
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Tu agenda de salud</p>
          <h1 className="mt-2 text-3xl font-bold">Mis Turnos</h1>
          <p className="mt-2 text-slate-500">Reservas de tu cuenta · DNI {dni}.</p>
        </div>
        <button type="button" className="btn-primary" onClick={onBook}>
          <Plus size={18} aria-hidden="true" />
          Nuevo turno
        </button>
      </div>
      <p className="my-6 text-sm text-slate-500">Acá aparecen los turnos asociados a tu DNI.</p>
      {error && (
        <>
          <ErrorMessage message={error} />
          <button className="btn-secondary mb-4" type="button" onClick={load}>
            Reintentar
          </button>
        </>
      )}
      {notice && (
        <p role="status" className="mb-4 rounded-xl bg-brand-50 p-4 text-sm text-brand-700">
          {notice}
        </p>
      )}
      {loading ? (
        <Loading />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((a) => (
            <article key={a.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="eyebrow">
                    {hospitals.find((h) => h.id === a.hospitalId)?.shortName}
                  </p>
                  <h2 className="mt-2 text-xl font-bold">
                    {specialties.find((s) => s.id === a.specialtyId)?.name ?? a.specialtyId}
                  </h2>
                </div>
                <span
                  className={`badge ${a.status === 'confirmed' ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-500'}`}
                >
                  {statusLabels[a.status]}
                </span>
              </div>
              <p className="mt-5 flex items-center gap-2 text-sm">
                <CalendarDays size={17} className="text-brand-600" aria-hidden="true" />
                {formatDate(a.date)}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm">
                <Clock3 size={17} className="text-brand-600" aria-hidden="true" />
                {a.time} h
              </p>
              {a.reason && <p className="mt-3 text-sm text-slate-500">Motivo: {a.reason}</p>}
              <div className="mt-4 border-t border-slate-100 pt-4 text-sm">
                <p className="font-semibold">{a.patient.fullName}</p>
                <p className="mt-1 text-slate-500">DNI {a.patient.dni}</p>
                <p className="mt-2 break-all text-xs text-slate-400">{a.id}</p>
              </div>
              {['pending', 'confirmed', 'arrived'].includes(a.status) && (
                <button
                  type="button"
                  className="no-print mt-5 min-h-11 rounded-lg px-3 text-sm font-semibold text-red-700 hover:bg-red-50"
                  onClick={() => {
                    setPending(a.id);
                    setNotice('');
                  }}
                >
                  Cancelar turno
                </button>
              )}
            </article>
          ))}
        </div>
      )}
      {!loading && !error && !filtered.length && (
        <div className="card py-12 text-center">
          <CalendarDays className="mx-auto mb-4 text-brand-600" size={40} aria-hidden="true" />
          <h2 className="text-xl font-bold">
            {dni ? 'No hay turnos para este DNI' : 'Tu próxima consulta empieza acá'}
          </h2>
          <p className="my-3 text-sm text-slate-500">
            Los turnos que reserves aparecerán en esta sección.
          </p>
          <button type="button" className="btn-primary" onClick={onBook}>
            Reservar un turno
          </button>
        </div>
      )}
      {!!filtered.length && (
        <button
          type="button"
          className="btn-secondary no-print mt-5"
          onClick={() => window.print()}
        >
          <Printer size={17} aria-hidden="true" />
          Imprimir listado
        </button>
      )}
      {pending && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onKeyDown={(e) => {
            if (e.key === 'Escape' && !cancelling) setPending(null);
            if (e.key === 'Tab') {
              const buttons =
                e.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
              const first = buttons[0];
              const last = buttons[buttons.length - 1];
              if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last?.focus();
              } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first?.focus();
              }
            }
          }}
        >
          <div className="card w-full max-w-sm">
            <h2 id="cancel-title" className="text-xl font-bold">
              ¿Cancelar este turno?
            </h2>
            <p className="my-4 text-sm text-slate-500">
              Se conservará en tu historial y el horario quedará libre.
            </p>
            {error && <ErrorMessage message={error} />}
            <div className="flex gap-2">
              <button
                autoFocus
                type="button"
                className="btn-secondary flex-1"
                disabled={cancelling}
                onClick={() => setPending(null)}
              >
                Conservar
              </button>
              <button
                type="button"
                className="btn-primary flex-1 bg-red-700 hover:bg-red-800"
                disabled={cancelling}
                onClick={cancel}
              >
                {cancelling ? 'Cancelando…' : 'Sí, cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
