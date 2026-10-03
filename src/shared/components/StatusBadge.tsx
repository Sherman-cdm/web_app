import type { AppointmentStatus } from '../../types';
import { statusLabels } from '../../utils/status';

export const statusColors: Record<AppointmentStatus, string> = {
  pending: 'bg-amber-50 text-amber-800',
  confirmed: 'bg-blue-50 text-blue-700',
  arrived: 'bg-violet-50 text-violet-700',
  completed: 'bg-emerald-50 text-emerald-700',
  no_show: 'bg-orange-50 text-orange-800',
  rejected: 'bg-red-50 text-red-700',
  cancelled: 'bg-slate-100 text-slate-600',
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span className={`badge whitespace-nowrap ${statusColors[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
