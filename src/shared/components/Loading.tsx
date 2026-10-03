import { LoaderCircle } from 'lucide-react';

export function Loading({ text = 'Cargando información…' }: { text?: string }) {
  return (
    <div
      role="status"
      className="flex items-center gap-3 rounded-xl bg-white p-6 text-sm text-slate-500"
    >
      <LoaderCircle className="animate-spin" aria-hidden="true" size={20} />
      {text}
    </div>
  );
}
