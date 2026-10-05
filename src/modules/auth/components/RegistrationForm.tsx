import { Eye, EyeOff, LoaderCircle, UserRoundPlus } from 'lucide-react';
import { useRef, useState, type FormEvent } from 'react';
import { authService } from '../../../services/authService';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import { errorText } from '../../../shared/errors/errorText';
import type { PatientRegistration } from '../../../types/auth';

export function RegistrationForm({
  onCreated,
  onBack,
}: {
  onCreated: (dni: string) => void;
  onBack: () => void;
}) {
  const [data, setData] = useState<PatientRegistration>({
    fullName: '',
    dni: '',
    email: '',
    password: '',
  });
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submitting = useRef(false);
  const update = (field: keyof PatientRegistration, value: string) =>
    setData((current) => ({ ...current, [field]: value }));
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setError('');
    try {
      const user = await authService.registerPatient(data);
      onCreated(user.identifier);
    } catch (error) {
      setError(errorText(error));
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="space-y-5">
      <label className="block text-sm font-semibold" htmlFor="register-name">
        Nombre y apellido
        <input
          id="register-name"
          className="field mt-2 uppercase"
          autoComplete="name"
          required
          minLength={2}
          maxLength={100}
          disabled={busy}
          value={data.fullName}
          onChange={(event) => update('fullName', event.target.value)}
        />
      </label>
      <label className="block text-sm font-semibold" htmlFor="register-dni">
        DNI
        <input
          id="register-dni"
          className="field mt-2"
          autoComplete="username"
          inputMode="numeric"
          pattern="[0-9]{7,8}"
          required
          maxLength={8}
          placeholder="Sin puntos"
          disabled={busy}
          value={data.dni}
          onChange={(event) => update('dni', event.target.value)}
        />
      </label>
      <label className="block text-sm font-semibold" htmlFor="register-email">
        Correo electrónico
        <input
          id="register-email"
          className="field mt-2"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          disabled={busy}
          value={data.email}
          onChange={(event) => update('email', event.target.value)}
        />
      </label>
      <div>
        <label className="block text-sm font-semibold" htmlFor="register-password">
          Contraseña
        </label>
        <div className="relative mt-2">
          <input
            id="register-password"
            className="field pr-12"
            type={visible ? 'text' : 'password'}
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={128}
            aria-describedby="password-help"
            disabled={busy}
            value={data.password}
            onChange={(event) => update('password', event.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-slate-500"
            aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={visible}
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        </div>
        <p id="password-help" className="mt-2 text-xs text-slate-500">
          Usá entre 8 y 128 caracteres.
        </p>
      </div>
      {error && <ErrorMessage message={error} />}
      <button type="submit" className="btn-primary w-full" disabled={busy}>
        {busy ? <LoaderCircle size={18} className="animate-spin" /> : <UserRoundPlus size={18} />}
        {busy ? 'Creando cuenta…' : 'Crear mi cuenta'}
      </button>
      <button
        type="button"
        className="min-h-11 w-full text-sm font-semibold text-brand-700 underline underline-offset-4"
        disabled={busy}
        onClick={onBack}
      >
        Ya tengo cuenta. Ingresar
      </button>
    </form>
  );
}
