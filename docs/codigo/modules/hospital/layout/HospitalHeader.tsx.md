# HospitalHeader.tsx

[Índice general](../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../src/modules/hospital/layout/HospitalHeader.tsx)

**Ruta:** `src/modules/hospital/layout/HospitalHeader.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { Building2, Menu } from 'lucide-react';
import type { HospitalState } from '../../../types';
import { useAuth } from '../../auth/AuthContext';
import { LogoutButton } from '../../auth/components/LogoutButton';

interface Props {
  state: HospitalState | null;
  hospitalId: string;
  open: boolean;
  onOpen: () => void;
  onHospitalChange: (id: string) => void;
}

export function HospitalHeader({ state, hospitalId, open, onOpen, onHospitalChange }: Props) {
  const { session } = useAuth();
  return (
    <header className="color-header sticky top-0 z-30 border-b backdrop-blur">
      <div className="flex min-h-20 items-center gap-3 px-4 sm:px-8">
        <button
          aria-label="Abrir menú hospitalario"
          aria-expanded={open}
          aria-controls="hospital-navigation"
          className="btn-secondary p-2 lg:hidden"
          onClick={() => onOpen()}
        >
          <Menu size={22} />
        </button>
        <Building2 className="hidden shrink-0 text-indigo-600 sm:block" size={22} />
        <label className="min-w-0 flex-1">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Hospital seleccionado
          </span>
          <select
            aria-label="Hospital del portal"
            className="mt-1 w-full max-w-md border-0 bg-transparent text-sm font-bold text-slate-700"
            value={hospitalId}
            onChange={(e) => onHospitalChange(e.target.value)}
          >
            {state ? (
              state.hospitals.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))
            ) : (
              <option value="central">Cargando hospital…</option>
            )}
          </select>
        </label>
        <div className="hidden items-center gap-3 border-l border-slate-200 pl-5 sm:flex">
          <span className="medical-hero flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white">
            LF
          </span>
          <div>
            <p className="text-xs font-bold">{session?.user.name ?? 'Equipo médico'}</p>
            <p className="mt-1 text-[10px] text-slate-400">Sesión de demostración</p>
          </div>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}
```
