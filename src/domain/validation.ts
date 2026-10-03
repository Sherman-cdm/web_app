import { ApiError } from '../shared/errors/ApiError';
import type { Appointment, BookingRequest } from '../types';
import { parseDate, toISO, validDni } from '../utils/date';

export const isDate = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(parseDate(value).getTime()) &&
  toISO(parseDate(value)) === value;

export const isTime = (value: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

export function requireValue(
  condition: unknown,
  message: string,
  code: ApiError['code'] = 'VALIDATION',
): asserts condition {
  if (!condition) throw new ApiError(message, code);
}

export function validAppointment(value: unknown): value is Appointment {
  const a = value as Appointment;
  return (
    !!a &&
    typeof a.id === 'string' &&
    typeof a.hospitalId === 'string' &&
    typeof a.specialtyId === 'string' &&
    isDate(a.date) &&
    isTime(a.time) &&
    ['pending', 'confirmed', 'arrived', 'completed', 'no_show', 'rejected', 'cancelled'].includes(
      a.status,
    ) &&
    !!a.patient &&
    validDni(a.patient.dni) &&
    ['fullName', 'email', 'phone'].every(
      (key) => typeof a.patient[key as keyof typeof a.patient] === 'string',
    )
  );
}

export function validatePatient(patient: BookingRequest['patient']) {
  requireValue(
    validDni(patient.dni) &&
      patient.fullName.trim().length >= 3 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patient.email) &&
      /^\+?[\d\s()-]{8,20}$/.test(patient.phone),
    'Revisá el DNI, nombre y datos de contacto.',
  );
}
