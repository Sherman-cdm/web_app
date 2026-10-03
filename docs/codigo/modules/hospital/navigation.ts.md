# navigation.ts

[Índice general](../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../src/modules/hospital/navigation.ts)

**Ruta:** `src/modules/hospital/navigation.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
import {
  Activity as ActivityIcon,
  BarChart3,
  CalendarDays,
  ClipboardList,
  FileHeart,
  Layers3,
  LayoutDashboard,
  Settings as SettingsIcon,
  Stethoscope,
  Users,
} from 'lucide-react';

export const nav = [
  { id: 'dashboard', label: 'Panel general', icon: LayoutDashboard, tone: 'tone-blue' },
  { id: 'appointments', label: 'Turnos y recepción', icon: ClipboardList, tone: 'tone-teal' },
  { id: 'professionals', label: 'Profesionales', icon: Stethoscope, tone: 'tone-violet' },
  { id: 'areas', label: 'Áreas y especialidades', icon: Layers3, tone: 'tone-rose' },
  { id: 'agendas', label: 'Agendas', icon: CalendarDays, tone: 'tone-blue' },
  { id: 'patients', label: 'Pacientes', icon: Users, tone: 'tone-teal' },
  { id: 'studies', label: 'Estudios', icon: FileHeart, tone: 'tone-rose' },
  { id: 'reports', label: 'Reportes', icon: BarChart3, tone: 'tone-violet' },
  { id: 'activity', label: 'Actividad', icon: ActivityIcon, tone: 'tone-amber' },
  { id: 'settings', label: 'Configuración', icon: SettingsIcon, tone: 'tone-blue' },
];

export const currentPage = () => {
  const page = window.location.hash.split('/')[1] ?? 'dashboard';
  return nav.some((n) => n.id === page) ? page : 'dashboard';
};
```
