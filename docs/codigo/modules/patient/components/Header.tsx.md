# Header.tsx

[Índice general](../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../src/modules/patient/components/Header.tsx)

**Ruta:** `src/modules/patient/components/Header.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { patientName } from '../../../utils/patientName';
import { HeartPulse, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { LogoutButton } from '../../auth/components/LogoutButton';

export default function Header() {
  const { session } = useAuth();
  return (
    <header className="color-header sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="patient-hero flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-md shadow-teal-900/15">
            <HeartPulse aria-hidden="true" size={25} />
          </span>
          <div className="min-w-0">
            <p className="text-xl font-bold text-brand-900">
              Mi salud<span className="text-brand-600">.</span>
            </p>
            <p className="break-words text-xs text-slate-500">
              {session ? patientName(session.user.name) : 'Hospitales de Pilar'}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href="#login/medical"
            aria-label="Acceso médico"
            className="btn-secondary px-3 text-brand-700"
          >
            <ShieldCheck size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Acceso médico</span>
          </a>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
```
