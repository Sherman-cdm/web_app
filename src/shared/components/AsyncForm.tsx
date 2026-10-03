import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { errorText } from '../errors/errorText';
import { ErrorMessage } from './ErrorMessage';

export function AsyncForm({
  children,
  save,
  onClose,
  submit = 'Guardar cambios',
  showCancel = true,
}: {
  children: ReactNode;
  save: () => Promise<unknown>;
  onClose: () => void;
  submit?: string;
  showCancel?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submitting = useRef(false);
  async function handle(event: FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setError('');
    try {
      await save();
      onClose();
    } catch (err) {
      setError(errorText(err));
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  return (
    <form onSubmit={handle}>
      <fieldset disabled={busy} className="space-y-4">
        {children}
      </fieldset>
      {error && <ErrorMessage message={error} />}
      <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
        {showCancel && (
          <button type="button" className="btn-secondary" disabled={busy} onClick={onClose}>
            Volver
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? 'Guardando…' : submit}
        </button>
      </div>
    </form>
  );
}
