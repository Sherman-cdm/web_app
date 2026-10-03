import type { AppointmentStatus } from '../types';

export const statusLabels: Record<AppointmentStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  arrived: 'En espera',
  completed: 'Atendido',
  no_show: 'Ausente',
  rejected: 'Rechazado',
  cancelled: 'Cancelado',
};
