import type { Appointment } from '../types';

export const occupies = (a: Appointment) =>
  !['cancelled', 'rejected', 'no_show'].includes(a.status);

export const activeReservation = (a: Appointment) =>
  ['pending', 'confirmed', 'arrived'].includes(a.status);
