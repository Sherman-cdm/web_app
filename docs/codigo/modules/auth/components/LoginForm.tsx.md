# LoginForm.tsx

[Índice general](../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../src/modules/auth/components/LoginForm.tsx)

**Ruta:** `src/modules/auth/components/LoginForm.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { ArrowRight, Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useRef, useState, type FormEvent } from 'react';
import { demoAccountFor } from '../../../mocks/demoAccounts';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import { errorText } from '../../../shared/errors/errorText';
import type { UserRole } from '../../../types/auth';
import { useAuth } from '../AuthContext';

export function LoginForm({ role }: { role: UserRole }) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submitting = useRef(false);
  const patient = role === 'patient';
  const demo = demoAccountFor(role);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setError('');
    try {
      await login({ role, identifier, password });
      window.location.hash = patient ? 'home' : 'hospital/dashboard';
    } catch (error) {
      setError(errorText(error));
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  return (
    <>
      <form onSubmit={submit} className="space-y-5">
        <label className="block text-sm font-semibold" htmlFor="login-identifier">
          {patient ? 'Número de DNI' : 'Correo institucional'}
          <input
            id="login-identifier"
            className="field mt-2"
            required
            autoComplete="username"
            type={patient ? 'text' : 'email'}
            inputMode={patient ? 'numeric' : 'email'}
            pattern={patient ? '[0-9]{7,8}' : undefined}
            maxLength={patient ? 8 : 120}
            placeholder={patient ? 'Tu DNI, sin puntos' : 'nombre@hospital.com'}
            value={identifier}
            disabled={busy}
            onChange={(event) => setIdentifier(event.target.value)}
          />
        </label>
        <label className="block text-sm font-semibold" htmlFor="login-password">
          Contraseña
        </label>
        <div className="relative !mt-2">
          <input
            id="login-password"
            className="field pr-12"
            type={visible ? 'text' : 'password'}
            required
            autoComplete="current-password"
            value={password}
            placeholder="Ingresá tu contraseña"
            disabled={busy}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-slate-400 hover:text-brand-600"
            aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={visible}
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        </div>
        {error && <ErrorMessage message={error} />}
        <button
          type="submit"
          className={`btn-primary w-full min-h-12 ${patient ? '' : 'from-indigo-700 to-violet-700 hover:from-indigo-800 hover:to-violet-800'}`}
          disabled={busy}
        >
          {busy ? (
            <>
              <LoaderCircle size={18} className="animate-spin" />
              Ingresando…
            </>
          ) : (
            <>
              Ingresar como {patient ? 'paciente' : 'médico'}
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
      <div
        className={`accent-card mt-7 rounded-2xl border p-4 ${patient ? 'tone-teal' : 'tone-violet'}`}
      >
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Probá el acceso</p>
        <dl className="mt-3 space-y-2 text-sm">
          <div>
            <dt className="text-xs text-slate-500">{patient ? 'DNI' : 'Correo'}</dt>
            <dd className="break-all font-medium">{demo.user.identifier}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Contraseña de ejemplo</dt>
            <dd className="font-medium">{demo.password}</dd>
          </div>
        </dl>
        <button
          type="button"
          className="mt-3 min-h-11 text-sm font-semibold text-brand-700 underline underline-offset-4"
          disabled={busy}
          onClick={() => {
            setIdentifier(demo.user.identifier);
            setPassword(demo.password);
            setError('');
          }}
        >
          Completar datos de prueba
        </button>
      </div>
    </>
  );
}
```
