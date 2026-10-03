import { type ReactNode } from 'react';

export function PageTitle({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-r from-blue-50 via-white to-violet-50 p-5 sm:p-6">
      <div>
        <p className="eyebrow mb-2">Gestión hospitalaria</p>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  );
}
