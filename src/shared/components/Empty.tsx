import { Inbox } from 'lucide-react';

export function Empty({ text }: { text: string }) {
  return (
    <div className="card py-12 text-center">
      <Inbox className="mx-auto mb-3 text-slate-300" size={36} />
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  );
}
