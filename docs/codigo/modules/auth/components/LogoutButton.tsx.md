# LogoutButton.tsx

[Índice general](../../../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../../../src/modules/auth/components/LogoutButton.tsx)

**Ruta:** `src/modules/auth/components/LogoutButton.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { LogOut } from 'lucide-react';
import { useAuth } from '../AuthContext';

export function LogoutButton() {
  const { logout } = useAuth();
  return (
    <button
      type="button"
      className="btn-secondary shrink-0 px-3"
      onClick={logout}
      aria-label="Cerrar sesión"
    >
      <LogOut size={17} aria-hidden="true" />
      <span className="hidden md:inline">Cerrar sesión</span>
    </button>
  );
}
```
