# auth.ts

[Índice general](../../../CODIGO_COMPLETO.md) · [Volver al módulo](./README.md) · [Abrir archivo fuente](../../../src/types/auth.ts)

**Ruta:** `src/types/auth.ts`. Este documento contiene solamente el código de este archivo.

Copia generada para consulta. Para modificar la aplicación, editar el archivo fuente.

```typescript
import type { Patient } from './appointment';

export type UserRole = 'patient' | 'medical';

export interface AuthUser {
  id: string;
  role: UserRole;
  name: string;
  identifier: string;
  patient?: Patient;
}

export interface AuthSession {
  user: AuthUser;
  expiresAt: number;
}

export interface LoginCredentials {
  role: UserRole;
  identifier: string;
  password: string;
}

export interface PatientRegistration {
  fullName: string;
  dni: string;
  email: string;
  password: string;
}
```
