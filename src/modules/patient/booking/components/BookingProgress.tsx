import { Check } from 'lucide-react';

const steps = ['Hospital', 'Especialidad', 'Fecha', 'Horario', 'Tus datos'];

export function BookingProgress({ step }: { step: number }) {
  return (
    <ol aria-label="Pasos de reserva" className="my-7 grid grid-cols-5 gap-1">
      {steps.map((label, index) => (
        <li key={label} aria-current={step === index ? 'step' : undefined} className="text-center">
          <span
            className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${index < step ? 'bg-brand-600 text-white' : index === step ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : 'bg-indigo-100 text-indigo-700'}`}
          >
            {index < step ? <Check size={17} aria-hidden="true" /> : index + 1}
          </span>
          <span
            className={`text-[10px] sm:text-xs ${index === step ? 'font-bold text-brand-700' : 'text-slate-500'}`}
          >
            {label}
          </span>
        </li>
      ))}
    </ol>
  );
}
