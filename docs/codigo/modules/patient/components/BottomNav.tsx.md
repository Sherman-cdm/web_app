# BottomNav.tsx

[Índice general](../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../src/modules/patient/components/BottomNav.tsx)

**Ruta:** `src/modules/patient/components/BottomNav.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { CalendarDays, ClipboardList, FileHeart, House } from 'lucide-react';
import type { View } from '../../../types';

const tabs = [
  { id: 'home', label: 'Inicio', icon: House, tone: 'tone-teal' },
  { id: 'booking', label: 'Sacar Turno', icon: CalendarDays, tone: 'tone-blue' },
  { id: 'appointments', label: 'Mis Turnos', icon: ClipboardList, tone: 'tone-violet' },
  { id: 'studies', label: 'Mis Estudios', icon: FileHeart, tone: 'tone-rose' },
] as const;

export default function BottomNav({
  active,
  onNavigate,
}: {
  active: View;
  onNavigate: (view: View) => void;
}) {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-teal-100 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_-12px_#0f766e33] backdrop-blur"
    >
      <div className="mx-auto grid max-w-2xl grid-cols-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onNavigate(tab.id)}
            aria-current={active === tab.id ? 'page' : undefined}
            className={`portal-tab ${tab.tone} flex min-h-[72px] flex-col items-center justify-center gap-1 text-[11px] font-semibold sm:text-xs ${active === tab.id ? 'accent-text' : 'text-slate-600 hover:text-brand-600'}`}
          >
            <span className="portal-tab-icon accent-icon rounded-xl px-5 py-1">
              <tab.icon size={22} aria-hidden="true" />
            </span>
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
```
