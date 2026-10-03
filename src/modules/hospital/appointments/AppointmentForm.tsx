import { useEffect, useState } from 'react';
import { hospitalApi } from '../../../services/hospitalApi';
import { AsyncForm } from '../../../shared/components/AsyncForm';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import { Field } from '../../../shared/components/Field';
import { Modal } from '../../../shared/components/Modal';
import { errorText } from '../../../shared/errors/errorText';
import type { Appointment, BookingRequest, TimeSlot } from '../../../types';
import { todayISO } from '../../../utils/date';
import { useHospital } from '../context/HospitalContext';

export function AppointmentForm({
  appointment,
  onClose,
}: {
  appointment?: Appointment;
  onClose: () => void;
}) {
  const { state, hospitalId } = useHospital();
  const [draft, setDraft] = useState<BookingRequest>(() =>
    appointment
      ? { ...appointment }
      : {
          hospitalId,
          specialtyId: '',
          professionalId: '',
          date: todayISO(),
          time: '',
          patient: { dni: '', fullName: '', email: '', phone: '' },
        },
  );
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    setSlots([]);
    setError('');
    if (!draft.specialtyId || !draft.date) return;
    setLoading(true);
    hospitalApi
      .getSlots(
        hospitalId,
        draft.specialtyId,
        draft.date,
        draft.professionalId || undefined,
        appointment?.id,
      )
      .then((result) => {
        if (active) setSlots(result);
      })
      .catch((e) => {
        if (active) setError(errorText(e));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [hospitalId, draft.specialtyId, draft.professionalId, draft.date, appointment?.id]);
  const areas = state.specialties.filter((s) => s.hospitalId === hospitalId && s.active !== false);
  const professionals = state.professionals.filter(
    (p) => p.hospitalId === hospitalId && p.active && p.specialtyIds.includes(draft.specialtyId),
  );
  const save = async () => {
    if (!slots.some((s) => s.time === draft.time && s.available))
      throw new Error('Seleccioná un horario disponible.');
    return appointment
      ? hospitalApi.rescheduleAppointment(appointment.id, draft)
      : hospitalApi.createAppointment(draft);
  };
  return (
    <Modal
      title={appointment ? 'Reprogramar turno' : 'Agregar turno desde recepción'}
      onClose={onClose}
    >
      <AsyncForm
        save={save}
        onClose={onClose}
        submit={appointment ? 'Confirmar reprogramación' : 'Crear turno confirmado'}
      >
        <p className="rounded-xl bg-blue-50 p-3 text-sm text-blue-800">
          Los turnos creados por recepción quedan confirmados. Se verifica la disponibilidad antes
          de guardarlos.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Área / especialidad">
            <select
              required
              className="field"
              value={draft.specialtyId}
              onChange={(e) =>
                setDraft({ ...draft, specialtyId: e.target.value, professionalId: '', time: '' })
              }
            >
              <option value="">Seleccionar área</option>
              {areas.map((s) => (
                <option value={s.id} key={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Profesional">
            <select
              className="field"
              value={draft.professionalId ?? ''}
              onChange={(e) => setDraft({ ...draft, professionalId: e.target.value, time: '' })}
            >
              <option value="">Asignar según disponibilidad</option>
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Fecha">
            <input
              required
              type="date"
              min={todayISO()}
              className="field"
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value, time: '' })}
            />
          </Field>
          <Field label="Horario">
            <select
              required
              className="field"
              value={draft.time}
              disabled={loading}
              onChange={(e) => setDraft({ ...draft, time: e.target.value })}
            >
              <option value="">{loading ? 'Consultando…' : 'Seleccionar horario'}</option>
              {slots
                .filter((s) => s.available)
                .map((s) => (
                  <option key={s.id} value={s.time}>
                    {s.time} h
                  </option>
                ))}
            </select>
          </Field>
        </div>
        {!loading && draft.specialtyId && !slots.some((s) => s.available) && (
          <p className="text-sm text-amber-800">
            No hay cupos en esta fecha. Elegí otra fecha o revisá las agendas.
          </p>
        )}
        {error && <ErrorMessage message={error} />}
        <h3 className="pt-2 font-bold">Datos del paciente</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              { key: 'dni', label: 'DNI', type: 'text' },
              { key: 'fullName', label: 'Nombre y apellido', type: 'text' },
              { key: 'email', label: 'Correo electrónico', type: 'email' },
              { key: 'phone', label: 'Teléfono', type: 'tel' },
            ] as const
          ).map((f) => (
            <Field label={f.label} key={f.key}>
              <input
                className="field"
                required
                type={f.type}
                pattern={f.key === 'dni' ? '[0-9]{7,8}' : undefined}
                maxLength={f.key === 'dni' ? 8 : 120}
                value={draft.patient[f.key]}
                onChange={(e) =>
                  setDraft({ ...draft, patient: { ...draft.patient, [f.key]: e.target.value } })
                }
              />
            </Field>
          ))}
        </div>
      </AsyncForm>
    </Modal>
  );
}
