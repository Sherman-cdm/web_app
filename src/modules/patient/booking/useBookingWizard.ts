import { useEffect, useRef, useState, type FormEvent } from 'react';
import { api, ApiError } from '../../../services/api';
import { errorText } from '../../../shared/errors/errorText';
import type { Appointment, Hospital, Patient, Specialty, TimeSlot } from '../../../types';
import { parseDate, todayISO, validDni } from '../../../utils/date';
import { useAuth } from '../../auth/AuthContext';

interface BookingOptions {
  hospitals: Hospital[];
  specialties: Specialty[];
  initialHospital: string;
  initialSpecialty?: string;
}

export function useBookingWizard({
  hospitals,
  specialties,
  initialHospital,
  initialSpecialty,
}: BookingOptions) {
  const { session } = useAuth();
  const [step, setStep] = useState(0);
  const [hospitalId, setHospitalId] = useState(initialHospital);
  const [specialtyId, setSpecialtyId] = useState(initialSpecialty ?? '');
  const [month, setMonth] = useState(() => {
    const d = parseDate(todayISO());
    return new Date(d.getFullYear(), d.getMonth(), 1, 12);
  });
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState<Appointment | null>(null);
  const [patient, setPatient] = useState<Patient>(() =>
    session?.user.patient
      ? { ...session.user.patient }
      : { dni: '', fullName: '', email: '', phone: '' },
  );
  const heading = useRef<HTMLHeadingElement>(null);
  const submitting = useRef(false);
  const hospital = hospitals.find((h) => h.id === hospitalId);
  const specialty = specialties.find((s) => s.id === specialtyId && s.hospitalId === hospitalId);
  useEffect(() => {
    heading.current?.focus();
  }, [step, receipt]);
  useEffect(() => {
    if (step !== 3 || !date || !specialty) return;
    let active = true;
    setBusy(true);
    setError('');
    setSlots([]);
    api
      .getTimeSlots(hospitalId, specialtyId, date)
      .then((result) => {
        if (active) setSlots(result);
      })
      .catch((err) => {
        if (active) setError(errorText(err));
      })
      .finally(() => {
        if (active) setBusy(false);
      });
    return () => {
      active = false;
    };
  }, [step, date, hospitalId, specialtyId, specialty]);
  function changeHospital(id: string) {
    setHospitalId(id);
    setSpecialtyId('');
    setDate('');
    setTime('');
  }
  function changeSpecialty(id: string) {
    setSpecialtyId(id);
    setDate('');
    setTime('');
  }
  function go(next: number) {
    setError('');
    setStep(next);
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    if (!validDni(patient.dni)) {
      setError('El DNI debe tener 7 u 8 dígitos, sin puntos.');
      return;
    }
    submitting.current = true;
    setBusy(true);
    setError('');
    try {
      setReceipt(await api.createAppointment({ hospitalId, specialtyId, date, time, patient }));
    } catch (err) {
      setError(errorText(err));
      if (err instanceof ApiError && err.code === 'CONFLICT') {
        setTime('');
        setStep(3);
      }
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  const canContinue =
    step === 0 ? !!hospital : step === 1 ? !!specialty : step === 2 ? !!date : !!time && !busy;
  return {
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
  };
}
