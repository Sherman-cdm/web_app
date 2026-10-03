import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Specialty } from '../../../../types';
import { formatDate, todayISO, toISO, weekdays } from '../../../../utils/date';

interface Props {
  month: Date;
  setMonth: (date: Date) => void;
  specialty?: Specialty;
  date: string;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
}

export function CalendarStep({ month, setMonth, specialty, date, setDate, setTime }: Props) {
  const firstDay = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const currentMonth = todayISO().slice(0, 7);
  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <button
          type="button"
          className="btn-secondary px-3"
          aria-label="Mes anterior"
          disabled={toISO(month).slice(0, 7) <= currentMonth}
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1, 12))}
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-base font-bold capitalize">
          {month.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
        </h3>
        <button
          type="button"
          className="btn-secondary px-3"
          aria-label="Mes siguiente"
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1, 12))}
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2" aria-label="Calendario de atención">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
          <span
            key={i}
            className="pb-2 text-center text-xs font-semibold text-slate-500"
            aria-label={weekdays[(i + 1) % 7]}
          >
            {day}
          </span>
        ))}
        {Array.from({ length: firstDay }, (_, i) => (
          <span key={`empty-${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const day = new Date(month.getFullYear(), month.getMonth(), i + 1, 12);
          const value = toISO(day);
          const available =
            value >= todayISO() && !!specialty?.schedule.days.includes(day.getDay());
          return (
            <button
              type="button"
              key={value}
              disabled={!available}
              aria-pressed={date === value}
              aria-label={`${formatDate(value)}${available ? ', día de atención' : ', sin atención'}`}
              onClick={() => {
                setDate(value);
                setTime('');
              }}
              className={`min-h-11 rounded-xl text-sm font-semibold sm:min-h-14 ${date === value ? 'bg-brand-600 text-white' : available ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100' : 'bg-slate-50 text-slate-400'}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <p className="mt-5 flex items-center gap-2 text-xs text-slate-500">
        <span className="h-3 w-3 rounded bg-emerald-100" />
        Verde: días de atención. Los horarios libres se consultan en el siguiente paso.
      </p>
      {date && (
        <p className="mt-4 text-sm font-semibold text-brand-700">
          Fecha seleccionada: {formatDate(date)}
        </p>
      )}
    </>
  );
}
