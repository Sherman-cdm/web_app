import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import type { Hospital, Specialty } from '../../../types';
import AppointmentReceipt from '../components/AppointmentReceipt';
import { BookingProgress } from './components/BookingProgress';
import { CalendarStep } from './steps/CalendarStep';
import { HospitalStep } from './steps/HospitalStep';
import { PatientDataStep } from './steps/PatientDataStep';
import { SpecialtyStep } from './steps/SpecialtyStep';
import { TimeSlotStep } from './steps/TimeSlotStep';
import { useBookingWizard } from './useBookingWizard';

export default function BookingWizard({
  hospitals,
  specialties,
  initialHospital,
  initialSpecialty,
  onDone,
}: {
  hospitals: Hospital[];
  specialties: Specialty[];
  initialHospital: string;
  initialSpecialty?: string;
  onDone: () => void;
}) {
  const {
    step,
    hospitalId,
    specialtyId,
    month,
    date,
    time,
    slots,
    busy,
    error,
    receipt,
    patient,
    heading,
    hospital,
    specialty,
    changeHospital,
    changeSpecialty,
    go,
    submit,
    setDate,
    setTime,
    setMonth,
    setPatient,
    canContinue,
  } = useBookingWizard({ hospitals, specialties, initialHospital, initialSpecialty });
  if (receipt)
    return (
      <AppointmentReceipt
        appointment={receipt}
        hospital={hospital}
        specialty={specialty}
        onDone={onDone}
      />
    );

  return (
    <section className="mx-auto max-w-3xl">
      <p className="eyebrow">Una consulta, paso a paso</p>
      <h1 className="mt-2 text-3xl font-bold">Reservá tu turno</h1>
      <p className="mt-2 text-slate-500">Elegí dónde y cuándo querés atenderte.</p>
      {hospital && specialty && (
        <p className="mt-4 rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-brand-900">
          <strong>{hospital.name}</strong> · {specialty.name}
        </p>
      )}
      <BookingProgress step={step} />
      <div className="card">
        <h2 ref={heading} tabIndex={-1} className="mb-5 text-xl font-bold">
          {step + 1}.{' '}
          {
            [
              'Seleccioná un hospital',
              'Elegí la especialidad',
              'Elegí una fecha',
              'Elegí un horario',
              'Completá tus datos',
            ][step]
          }
        </h2>
        {step === 0 && (
          <HospitalStep
            hospitals={hospitals}
            hospitalId={hospitalId}
            changeHospital={changeHospital}
          />
        )}
        {step === 1 && (
          <SpecialtyStep
            specialties={specialties}
            hospitalId={hospitalId}
            specialtyId={specialtyId}
            changeSpecialty={changeSpecialty}
          />
        )}
        {step === 2 && (
          <CalendarStep
            month={month}
            setMonth={setMonth}
            specialty={specialty}
            date={date}
            setDate={setDate}
            setTime={setTime}
          />
        )}
        {step === 3 && (
          <TimeSlotStep
            specialty={specialty}
            date={date}
            busy={busy}
            slots={slots}
            time={time}
            setTime={setTime}
          />
        )}
        {step === 4 && (
          <PatientDataStep
            submit={submit}
            specialty={specialty}
            hospital={hospital}
            date={date}
            time={time}
            patient={patient}
            setPatient={setPatient}
          />
        )}
        {error && <ErrorMessage message={error} />}
        <div className="no-print mt-7 flex justify-between gap-3 border-t border-slate-100 pt-5">
          <button
            type="button"
            className="btn-secondary"
            disabled={step === 0 || busy}
            onClick={() => go(step - 1)}
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Atrás
          </button>
          {step < 4 ? (
            <button
              type="button"
              className="btn-primary"
              disabled={!canContinue}
              onClick={() => go(step + 1)}
            >
              Continuar
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          ) : (
            <button type="submit" form="patient-form" className="btn-primary" disabled={busy}>
              {busy ? 'Confirmando…' : 'Confirmar turno'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
