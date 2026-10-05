# App.tsx

[Índice general](../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../src/App.tsx)

**Ruta:** `src/App.tsx`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```tsx
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './modules/auth/AuthContext';
import { LoginPage } from './modules/auth/LoginPage';
import HospitalPortal from './modules/hospital/HospitalPortal';
import { PatientPortal } from './modules/patient/PatientPortal';
import { canAccess } from './services/authService';
import type { UserRole } from './types/auth';

function PortalAccess() {
  const { session } = useAuth();
  const [route, setRoute] = useState(() => window.location.hash);
  useEffect(() => {
    const change = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, []);
  const role: UserRole =
    route.startsWith('#hospital') || route === '#login/medical' ? 'medical' : 'patient';
  if (route.startsWith('#login/') || !canAccess(session, role))
    return <LoginPage key={role} role={role} />;
  return role === 'medical' ? <HospitalPortal /> : <PatientPortal key={session?.user.id} />;
}

export default function App() {
  return (
    <AuthProvider>
      <PortalAccess />
    </AuthProvider>
  );
}
```
